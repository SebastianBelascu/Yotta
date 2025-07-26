import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let query = supabase
      .from('footer')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching footer data:', error);
      return NextResponse.json({ error: 'Failed to fetch footer data' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in footer GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('footer')
      .insert([{
        section: body.section,
        title: body.title,
        content: body.content,
        link_url: body.link_url,
        icon_name: body.icon_name,
        display_order: body.display_order || 0,
        is_active: body.is_active !== undefined ? body.is_active : true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating footer item:', error);
      return NextResponse.json({ error: 'Failed to create footer item' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in footer POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
