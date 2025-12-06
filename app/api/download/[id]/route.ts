import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get plugin details
    const { data: plugin, error: pluginError } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', id)
      .single()

    if (pluginError || !plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 })
    }

    // Check if plugin is free
    const isFree = plugin.price_coins === 0

    // Verify purchase (skip for free plugins)
    if (!isFree) {
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('plugin_id', id)
        .single()

      if (purchaseError || !purchase) {
        return NextResponse.json(
          { error: 'You must purchase this plugin before downloading' },
          { status: 403 }
        )
      }
    }

    // Handle download based on type
    if (plugin.download_type === 'external') {
      // Redirect to external URL
      if (!plugin.external_url) {
        return NextResponse.json(
          { error: 'External download link not configured' },
          { status: 500 }
        )
      }
      return NextResponse.redirect(plugin.external_url)
    } else {
      // Generate signed URL for uploaded files (valid for 60 seconds)
      if (!plugin.file_url) {
        return NextResponse.json(
          { error: 'Plugin file not found' },
          { status: 404 }
        )
      }

      // Parse file_url (could be JSON array or single file)
      let fileToDownload: string
      try {
        const files = JSON.parse(plugin.file_url) as string[]
        // Download first file (or could zip multiple files in future)
        fileToDownload = files[0]
      } catch {
        // Single file (backward compatibility)
        fileToDownload = plugin.file_url
      }

      // Create proper filename for download (sanitize plugin name)
      const originalFileName = fileToDownload.split('/').pop() || `${plugin.name}.jar`
      const sanitizedPluginName = plugin.name.replace(/[^a-zA-Z0-9-_]/g, '_')
      const fileExtension = originalFileName.split('.').pop() || 'jar'
      const downloadFileName = `${sanitizedPluginName}.${fileExtension}`

      // Generate signed URL with download option
      const { data: signedUrlData, error: urlError } = await adminClient.storage
        .from('plugins')
        .createSignedUrl(fileToDownload, 60, {
          download: downloadFileName
        })

      if (urlError || !signedUrlData) {
        console.error('Signed URL error:', urlError)
        return NextResponse.json(
          { error: 'Failed to generate download link' },
          { status: 500 }
        )
      }

      // Redirect to signed URL - browser will download with correct filename
      return NextResponse.redirect(signedUrlData.signedUrl)
    }
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
