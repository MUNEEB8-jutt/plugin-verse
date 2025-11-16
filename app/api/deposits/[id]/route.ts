import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT - Approve or reject deposit (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { status } = await request.json()

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    // Get deposit details
    const { data: deposit, error: fetchError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json(
        { error: 'Deposit has already been processed' },
        { status: 400 }
      )
    }

    // Update deposit status
    const { error: updateError } = await supabase
      .from('deposits')
      .update({ status })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // If approved, add coins to user balance
    if (status === 'approved') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', deposit.user_id)
        .single()

      if (userError || !userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const { error: balanceError } = await supabase
        .from('users')
        .update({ balance: userData.balance + deposit.amount })
        .eq('id', deposit.user_id)

      if (balanceError) {
        // Rollback deposit status update
        await supabase
          .from('deposits')
          .update({ status: 'pending' })
          .eq('id', id)

        return NextResponse.json(
          { error: 'Failed to update user balance' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        message: `Deposit ${status} successfully`,
        data: { id, status },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
