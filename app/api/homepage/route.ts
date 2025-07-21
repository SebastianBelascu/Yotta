import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get query parameters
    const url = new URL(req.url);
    const section = url.searchParams.get('section');
    const published = url.searchParams.get('published');
    
    // Build query
    let query = supabase.from('homepage').select('*');
    
    // Apply section filter if provided
    if (section && section !== 'all') {
      query = query.eq('section', section);
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
      console.error('Error fetching Homepage items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Homepage API:', error);
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
    const { 
      title, 
      subtitle, 
      description, 
      icon_svg, 
      section, 
      display_order, 
      price,
      original_price,
      discount_percentage,
      rating,
      review_count,
      company_name,
      badge_text,
      badge_color,
      features,
      button_text,
      button_link,
      is_published 
    } = body;

    // Validate required fields
    if (!title || !section) {
      return NextResponse.json({ error: 'Title and section are required' }, { status: 400 });
    }

    // Insert new item
    const { data, error } = await supabase
      .from('homepage')
      .insert({
        title,
        subtitle: subtitle || null,
        description: description || null,
        icon_svg: icon_svg || null,
        section: section || 'hero',
        display_order: display_order || 0,
        price: price || null,
        original_price: original_price || null,
        discount_percentage: discount_percentage || null,
        rating: rating || null,
        review_count: review_count || null,
        company_name: company_name || null,
        badge_text: badge_text || null,
        badge_color: badge_color || null,
        features: features || null,
        button_text: button_text || null,
        button_link: button_link || null,
        is_published: is_published !== undefined ? is_published : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating Homepage item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in Homepage API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
