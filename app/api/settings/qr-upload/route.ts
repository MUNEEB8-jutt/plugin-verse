import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName } from '@/lib/utils/helpers'

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
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 })
    }

    const validTypes = ['easypaisa', 'jazzcash', 'upi']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    // Upload to background bucket
    const fileName = `qr_${type}_${generateFileName(file.name)}`
    const { error: uploadError } = await adminClient.storage
      .from('background')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: { publicUrl } } = adminClient.storage
      .from('background')
      .getPublicUrl(fileName)

    // Save to settings
    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({ key: `${type}_qr`, value: publicUrl }, { onConflict: 'key' })

    if (settingsError) {
      return NextResponse.json({ error: settingsError.message }, { status: 400 })
    }

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error('QR upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
