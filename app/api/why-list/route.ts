import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const published = url.searchParams.get('published');
    
    // Build query
    let query = supabase.from('why_list_with_us').select('*');
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Apply published filter if provided
    if (published === 'true') {
      query = query.eq('is_published', true);
    }
    
    // Order by display_order and created_at
    query = query.order('display_order', { ascending: true }).order('created_at', { ascending: true });
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching Why List With Us items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Why List With Us API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, icon_name, category, display_order, is_published } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Insert new item
    const { data, error } = await supabase
      .from('why_list_with_us')
      .insert({
        title,
        description,
        icon_name: icon_name || null,
        category: category || 'benefit',
        display_order: display_order || 0,
        is_published: is_published !== undefined ? is_published : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating Why List With Us item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in Why List With Us API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
