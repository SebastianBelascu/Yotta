import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error in tools API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    // Prepare the data for insertion
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
    };

    const { data: tool, error } = await supabase
      .from('tools')
      .insert([toolData])
      .select()
      .single();

    if (error) {
      console.error('Error creating tool:', error);
      return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
    }

    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error('Error in tools POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
