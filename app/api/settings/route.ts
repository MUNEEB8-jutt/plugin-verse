import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all settings
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: settings }, { status: 200 })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Settings Update - User:', user?.email, 'Role:', user?.user_metadata?.role)
    
    if (!user || user.user_metadata?.role !== 'admin') {
      console.log('Settings Update - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { easypaisa_number, jazzcash_number, upi_id } = body

    if (!easypaisa_number && !jazzcash_number && !upi_id) {
      return NextResponse.json(
        { error: 'At least one setting must be provided' },
        { status: 400 }
      )
    }

    const updates = []

    if (easypaisa_number) {
      updates.push(
        supabase
          .from('settings')
          .upsert({ key: 'easypaisa_number', value: easypaisa_number })
      )
    }

    if (jazzcash_number) {
      updates.push(
        supabase
          .from('settings')
          .upsert({ key: 'jazzcash_number', value: jazzcash_number })
      )
    }

    if (upi_id) {
      updates.push(
        supabase
          .from('settings')
          .upsert({ key: 'upi_id', value: upi_id })
      )
    }

    await Promise.all(updates)

    return NextResponse.json(
      { message: 'Settings updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
