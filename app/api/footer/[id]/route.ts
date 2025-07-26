import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('footer')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching footer item:', error);
      return NextResponse.json({ error: 'Footer item not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in footer GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('footer')
      .update({
        section: body.section,
        title: body.title,
        content: body.content,
        link_url: body.link_url,
        icon_name: body.icon_name,
        display_order: body.display_order,
        is_active: body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating footer item:', error);
      return NextResponse.json({ error: 'Failed to update footer item' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in footer PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('footer')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting footer item:', error);
      return NextResponse.json({ error: 'Failed to delete footer item' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Footer item deleted successfully' });
  } catch (error) {
    console.error('Error in footer DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
