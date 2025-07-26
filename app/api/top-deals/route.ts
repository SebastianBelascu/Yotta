import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get top deals settings
    const { data: settings, error: settingsError } = await supabase
      .from('top_deals_settings')
      .select('*')
      .single();
    
    if (settingsError) {
      console.error('Error fetching top deals settings:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
    
    // Get active top deals ordered by display_order
    const { data: deals, error: dealsError } = await supabase
      .from('top_deals')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (dealsError) {
      console.error('Error fetching top deals:', dealsError);
      return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
    }
    
    return NextResponse.json({ settings, deals });
  } catch (error) {
    console.error('Unexpected error in top deals API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Create new top deal
    const { data, error } = await supabase
      .from('top_deals')
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating top deal:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating top deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
