import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName } from '@/lib/utils/helpers'

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
    const logoFile = formData.get('logo') as File | null
    const pluginFile = formData.get('file') as File | null

    // Get existing plugin
    const { data: existingPlugin, error: fetchError } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 })
    }

    let logoUrl = existingPlugin.logo_url
    let fileUrl = existingPlugin.file_url

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

    // Update plugin file if new file provided
    if (pluginFile && pluginFile.size > 0) {
      const pluginFileName = generateFileName(pluginFile.name)
      const { error: fileError } = await adminClient.storage
        .from('plugins')
        .upload(pluginFileName, pluginFile, {
          contentType: pluginFile.type,
          upsert: false,
        })

      if (fileError) {
        return NextResponse.json({ error: `Plugin upload failed: ${fileError.message}` }, { status: 400 })
      }

      fileUrl = pluginFileName

      // Delete old file
      if (existingPlugin.file_url) {
        await adminClient.storage.from('plugins').remove([existingPlugin.file_url])
      }
    }

    // Update plugin record
    const { data: plugin, error: updateError } = await supabase
      .from('plugins')
      .update({
        title,
        description,
        price_coins: priceCoins,
        logo_url: logoUrl,
        file_url: fileUrl,
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

    // Delete files from storage
    const logoPath = plugin.logo_url.split('/').pop()
    if (logoPath) {
      await adminClient.storage.from('logos').remove([logoPath])
    }
    if (plugin.file_url) {
      await adminClient.storage.from('plugins').remove([plugin.file_url])
    }

    return NextResponse.json({ message: 'Plugin deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
