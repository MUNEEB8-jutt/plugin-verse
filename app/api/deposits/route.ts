import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateFileName } from '@/lib/utils/helpers'

// GET - List deposits (users see own, admins see all)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = user.user_metadata?.role === 'admin'

    let query = supabase
      .from('deposits')
      .select('*')
      .order('created_at', { ascending: false })

    // Non-admin users only see their own deposits
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    const { data: deposits, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: deposits }, { status: 200 })
  } catch (error) {
    console.error('Get deposits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create deposit request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const amount = parseInt(formData.get('amount') as string)
    const method = formData.get('method') as string
    const transactionId = formData.get('transactionId') as string
    const screenshotFile = formData.get('screenshot') as File

    if (!amount || !method || !transactionId || !screenshotFile) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!['Easypaisa', 'JazzCash', 'UPI'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Upload screenshot to receipts bucket
    const screenshotFileName = `${user.id}/${generateFileName(screenshotFile.name)}`
    const { error: uploadError } = await adminClient.storage
      .from('receipts')
      .upload(screenshotFileName, screenshotFile, {
        contentType: screenshotFile.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Screenshot upload failed: ${uploadError.message}` },
        { status: 400 }
      )
    }

    // Get screenshot URL (for admin viewing)
    const { data: { publicUrl: screenshotUrl } } = adminClient.storage
      .from('receipts')
      .getPublicUrl(screenshotFileName)

    // Create deposit record
    const { data: deposit, error: dbError } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,
        amount,
        method,
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup uploaded file if DB insert fails
      await adminClient.storage.from('receipts').remove([screenshotFileName])
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json(
      { data: deposit, message: 'Deposit request submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
