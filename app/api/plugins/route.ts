import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName, isValidUrl } from '@/lib/utils/helpers'

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
    const version = (formData.get('version') as string) || '1.0.0'
    const platform = (formData.get('platform') as string) || 'plugin'
    const downloadType = (formData.get('downloadType') as string) || 'upload'
    const logoFile = formData.get('logo') as File
    const externalUrl = formData.get('externalUrl') as string

    // Basic validation
    if (!title || !description || isNaN(priceCoins) || !logoFile) {
      return NextResponse.json(
        { error: 'Title, description, price, and logo are required' },
        { status: 400 }
      )
    }

    // Validate download method
    if (downloadType === 'upload') {
      const files = formData.getAll('files') as File[]
      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: 'At least one plugin file is required for upload method' },
          { status: 400 }
        )
      }
    } else if (downloadType === 'external') {
      if (!externalUrl || !isValidUrl(externalUrl)) {
        return NextResponse.json(
          { error: 'Valid external URL is required for external link method' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid download type' },
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

    let fileUrl: string | null = null
    const uploadedFiles: string[] = []

    // Handle file uploads if upload type
    if (downloadType === 'upload') {
      const files = formData.getAll('files') as File[]
      
      for (const file of files) {
        const fileName = generateFileName(file.name)
        const { error: fileError } = await adminClient.storage
          .from('plugins')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
          })

        if (fileError) {
          // Cleanup: remove logo and any uploaded files
          await adminClient.storage.from('logos').remove([logoFileName])
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

      // Store file paths as JSON array
      fileUrl = JSON.stringify(uploadedFiles)
    }

    // Create plugin record
    const { data: plugin, error: dbError } = await supabase
      .from('plugins')
      .insert({
        title,
        description,
        price_coins: priceCoins,
        version,
        platform,
        logo_url: logoUrl,
        file_url: fileUrl,
        download_type: downloadType,
        external_url: downloadType === 'external' ? externalUrl : null,
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup uploaded files if DB insert fails
      await adminClient.storage.from('logos').remove([logoFileName])
      if (uploadedFiles.length > 0) {
        await adminClient.storage.from('plugins').remove(uploadedFiles)
      }
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ data: plugin, message: 'Plugin created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Create plugin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
