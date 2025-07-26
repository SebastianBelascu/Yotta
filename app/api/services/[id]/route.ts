import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error in service GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    // Auto-assign vendor based on email_for_leads if it changed
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
    
    // Update service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (serviceError) {
      console.error('Error updating service:', serviceError);
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error in service PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error in service DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
