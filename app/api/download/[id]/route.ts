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

    // Verify purchase
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

    // Generate signed URL (valid for 60 seconds)
    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('plugins')
      .createSignedUrl(plugin.file_url, 60)

    if (urlError || !signedUrlData) {
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    // Redirect to the signed URL for direct download
    return NextResponse.redirect(signedUrlData.signedUrl)
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
