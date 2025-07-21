import { createClient } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching tool:', error);
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error in tool GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    // Prepare the data for update
    const toolData = {
      name: body.name,
      tagline: body.tagline || null,
      categories: body.categories || [],
      description: body.description || null,
      problem_solved: body.problem_solved || null,
      best_for: body.best_for || [],
      features: body.features || [],
      pros: body.pros || [],
      cons: body.cons || [],
      pricing_model: body.pricing_model || null,
      starting_price: body.starting_price ? parseFloat(body.starting_price) : null,
      currency: body.currency || 'USD',
      platforms_supported: body.platforms_supported || [],
      regions: body.regions || [],
      logo_url: body.logo_url || null,
      banner_url: body.banner_url || null,
      affiliate_link: body.affiliate_link || null,
      published: body.published || false,
      updated_at: new Date().toISOString(),
    };

    const { data: tool, error } = await supabase
      .from('tools')
      .update(toolData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tool:', error);
      return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error in tool PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tool:', error);
      return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error in tool DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
