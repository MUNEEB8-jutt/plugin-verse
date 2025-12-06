import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName, isValidUrl } from '@/lib/utils/helpers'

// GET - Get single plugin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: plugin, error } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ data: plugin }, { status: 200 })
  } catch (error) {
    console.error('Get plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update plugin (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceCoins = parseInt(formData.get('priceCoins') as string)
    const version = (formData.get('version') as string) || '1.0.0'
    const platform = (formData.get('platform') as string) || 'plugin-paper'
    const downloadType = (formData.get('downloadType') as string) || 'upload'
    const logoFile = formData.get('logo') as File | null
    const externalUrl = formData.get('externalUrl') as string

    // Get existing plugin
    const { data: existingPlugin, error: fetchError } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 })
    }

    // Validate download method
    if (downloadType === 'external' && (!externalUrl || !isValidUrl(externalUrl))) {
      return NextResponse.json(
        { error: 'Valid external URL is required for external link method' },
        { status: 400 }
      )
    }

    let logoUrl = existingPlugin.logo_url
    let fileUrl = existingPlugin.file_url
    let newExternalUrl = existingPlugin.external_url

    // Update logo if new file provided
    if (logoFile && logoFile.size > 0) {
      const logoFileName = generateFileName(logoFile.name)
      const { error: logoError } = await adminClient.storage
        .from('logos')
        .upload(logoFileName, logoFile, {
          contentType: logoFile.type,
          upsert: false,
        })

      if (logoError) {
        return NextResponse.json({ error: `Logo upload failed: ${logoError.message}` }, { status: 400 })
      }

      const { data: { publicUrl } } = adminClient.storage
        .from('logos')
        .getPublicUrl(logoFileName)

      logoUrl = publicUrl

      // Delete old logo
      const oldLogoPath = existingPlugin.logo_url.split('/').pop()
      if (oldLogoPath) {
        await adminClient.storage.from('logos').remove([oldLogoPath])
      }
    }

    // Handle download type changes
    if (downloadType === 'upload') {
      const files = formData.getAll('files') as File[]
      
      // If new files provided, upload them
      if (files && files.length > 0) {
        const uploadedFiles: string[] = []

        for (const file of files) {
          const fileName = generateFileName(file.name)
          const { error: fileError } = await adminClient.storage
            .from('plugins')
            .upload(fileName, file, {
              contentType: file.type,
              upsert: false,
            })

          if (fileError) {
            // Cleanup any uploaded files
            if (uploadedFiles.length > 0) {
              await adminClient.storage.from('plugins').remove(uploadedFiles)
            }
            return NextResponse.json(
              { error: `File upload failed: ${fileError.message}` },
              { status: 400 }
            )
          }

          uploadedFiles.push(fileName)
        }

        // Delete old files if switching from upload or updating files
        if (existingPlugin.file_url && existingPlugin.download_type === 'upload') {
          try {
            const oldFiles = JSON.parse(existingPlugin.file_url) as string[]
            await adminClient.storage.from('plugins').remove(oldFiles)
          } catch {
            // If not JSON, treat as single file
            await adminClient.storage.from('plugins').remove([existingPlugin.file_url])
          }
        }

        fileUrl = JSON.stringify(uploadedFiles)
      }

      newExternalUrl = null
    } else if (downloadType === 'external') {
      // Switching to external link
      newExternalUrl = externalUrl

      // Delete old files if switching from upload
      if (existingPlugin.download_type === 'upload' && existingPlugin.file_url) {
        try {
          const oldFiles = JSON.parse(existingPlugin.file_url) as string[]
          await adminClient.storage.from('plugins').remove(oldFiles)
        } catch {
          // If not JSON, treat as single file
          await adminClient.storage.from('plugins').remove([existingPlugin.file_url])
        }
      }

      fileUrl = null
    }

    // Update plugin record
    const { data: plugin, error: updateError } = await supabase
      .from('plugins')
      .update({
        title,
        description,
        price_coins: priceCoins,
        version,
        platform,
        logo_url: logoUrl,
        file_url: fileUrl,
        download_type: downloadType,
        external_url: newExternalUrl,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ data: plugin, message: 'Plugin updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Update plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete plugin (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get plugin to delete files
    const { data: plugin, error: fetchError } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 })
    }

    // Delete plugin record (will cascade delete purchases)
    const { error: deleteError } = await supabase
      .from('plugins')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    // Delete logo from storage
    const logoPath = plugin.logo_url.split('/').pop()
    if (logoPath) {
      await adminClient.storage.from('logos').remove([logoPath])
    }

    // Delete plugin files only if upload type
    if (plugin.download_type === 'upload' && plugin.file_url) {
      try {
        // Try to parse as JSON array (multiple files)
        const files = JSON.parse(plugin.file_url) as string[]
        await adminClient.storage.from('plugins').remove(files)
      } catch {
        // If not JSON, treat as single file (backward compatibility)
        await adminClient.storage.from('plugins').remove([plugin.file_url])
      }
    }
    // For external type, no files to delete

    return NextResponse.json({ message: 'Plugin deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
