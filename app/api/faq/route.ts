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
    let query = supabase.from('faq').select('*');
    
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
      console.error('Error fetching FAQ:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in FAQ API:', error);
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
    const { question, answer, category, display_order, is_published } = body;

    // Validate required fields
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    // Insert new FAQ
    const { data, error } = await supabase
      .from('faq')
      .insert({
        question,
        answer,
        category: category || 'general',
        display_order: display_order || 0,
        is_published: is_published !== undefined ? is_published : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating FAQ:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in FAQ API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
