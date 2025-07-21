import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching vendors:', error);
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }

    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Error in vendors API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { name, email } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert([{ name, email }])
      .select()
      .single();

    if (error) {
      console.error('Error creating vendor:', error);
      return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error in vendors API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
