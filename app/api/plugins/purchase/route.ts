import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pluginId } = await request.json()

    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID is required' }, { status: 400 })
    }

    // Get plugin details
    const { data: plugin, error: pluginError } = await supabase
      .from('plugins')
      .select('*')
      .eq('id', pluginId)
      .single()

    if (pluginError || !plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 })
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('plugin_id', pluginId)
      .single()

    if (existingPurchase) {
      return NextResponse.json({ error: 'Plugin already purchased' }, { status: 400 })
    }

    // Get user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check sufficient balance
    if (userData.balance < plugin.price_coins) {
      return NextResponse.json(
        { error: 'Insufficient balance', required: plugin.price_coins, current: userData.balance },
        { status: 400 }
      )
    }

    // Deduct coins from user balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: userData.balance - plugin.price_coins })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 400 })
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        plugin_id: pluginId,
      })
      .select()
      .single()

    if (purchaseError) {
      // Rollback balance update
      await supabase
        .from('users')
        .update({ balance: userData.balance })
        .eq('id', user.id)

      return NextResponse.json({ error: 'Failed to create purchase' }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Purchase successful',
        data: purchase,
        newBalance: userData.balance - plugin.price_coins,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
