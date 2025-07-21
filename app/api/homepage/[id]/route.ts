import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('homepage')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching Homepage item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Homepage API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;
    
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

    // Update item
    const { data, error } = await supabase
      .from('homepage')
      .update({
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
        is_published: is_published !== undefined ? is_published : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating Homepage item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Homepage API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete item
    const { error } = await supabase
      .from('homepage')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting Homepage item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error in Homepage API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
