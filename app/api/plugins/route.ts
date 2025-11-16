import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName } from '@/lib/utils/helpers'

// GET - List all plugins
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: plugins, error } = await supabase
      .from('plugins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: plugins }, { status: 200 })
  } catch (error) {
    console.error('Get plugins error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new plugin (admin only)
export async function POST(request: NextRequest) {
  try {
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
    const logoFile = formData.get('logo') as File
    const pluginFile = formData.get('file') as File

    if (!title || !description || !priceCoins || !logoFile || !pluginFile) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Upload logo to public bucket
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

    const { data: { publicUrl: logoUrl } } = adminClient.storage
      .from('logos')
      .getPublicUrl(logoFileName)

    // Upload plugin file to private bucket
    const pluginFileName = generateFileName(pluginFile.name)
    const { error: fileError } = await adminClient.storage
      .from('plugins')
      .upload(pluginFileName, pluginFile, {
        contentType: pluginFile.type,
        upsert: false,
      })

    if (fileError) {
      // Cleanup logo if plugin upload fails
      await adminClient.storage.from('logos').remove([logoFileName])
      return NextResponse.json({ error: `Plugin upload failed: ${fileError.message}` }, { status: 400 })
    }

    // Store file path (not public URL for private bucket)
    const fileUrl = pluginFileName

    // Create plugin record
    const { data: plugin, error: dbError } = await supabase
      .from('plugins')
      .insert({
        title,
        description,
        price_coins: priceCoins,
        logo_url: logoUrl,
        file_url: fileUrl,
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup uploaded files if DB insert fails
      await adminClient.storage.from('logos').remove([logoFileName])
      await adminClient.storage.from('plugins').remove([pluginFileName])
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ data: plugin, message: 'Plugin created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Create plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
