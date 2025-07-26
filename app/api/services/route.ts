import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error in services API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Auto-assign vendor based on email_for_leads
    if (body.email_for_leads) {
      // Check if vendor exists with this email
      let { data: existingVendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('email', body.email_for_leads)
        .single();
      
      if (existingVendor) {
        // Use existing vendor
        body.vendor_id = existingVendor.id;
        console.log('Using existing vendor:', existingVendor.id);
      } else {
        // Create new vendor using service name as business name
        console.log('Creating new vendor for email:', body.email_for_leads);
        const { data: newVendor, error: createVendorError } = await supabase
          .from('vendors')
          .insert({
            name: body.name || 'Service Provider',
            email: body.email_for_leads
          })
          .select('id')
          .single();
        
        if (createVendorError) {
          console.error('Error creating vendor:', createVendorError);
        } else if (newVendor) {
          body.vendor_id = newVendor.id;
          console.log('Created new vendor:', newVendor.id);
        }
      }
    }
    
    // Create service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .insert(body)
      .select()
      .single();
    
    if (serviceError) {
      console.error('Error creating service:', serviceError);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error in services POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
