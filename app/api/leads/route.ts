import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  // Get query parameters for filtering
  const providerId = searchParams.get('provider_id');
  const serviceId = searchParams.get('service_id');
  const sent = searchParams.get('sent');
  
  try {
    let query = supabase
      .from('leads')
      .select(`
        *,
        services:service_id (
          id,
          name,
          main_categories
        ),
        vendors:provider_id (
          id,
          name,
          email
        )
      `);
    
    // Apply filters if provided
    if (providerId) {
      query = query.eq('provider_id', providerId);
    }
    
    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }
    
    if (sent !== null) {
      query = query.eq('sent', sent === 'true');
    }
    
    // Order by created_at descending (newest first)
    query = query.order('created_at', { ascending: false });
    
    const { data: leads, error } = await query;
    
    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const {
      service_id,
      provider_id,
      metadata
    } = body;
    
    // Validate required fields
    if (!service_id || !provider_id || !metadata) {
      return NextResponse.json(
        { error: 'Missing required fields: service_id, provider_id, metadata' },
        { status: 400 }
      );
    }
    
    // Validate metadata structure
    if (!metadata.email || !metadata.contact_person) {
      return NextResponse.json(
        { error: 'Metadata must include email and contact_person' },
        { status: 400 }
      );
    }
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        service_id,
        provider_id,
        metadata,
        sent: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error in leads POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
