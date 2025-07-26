import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const status = searchParams.get('status') || 'Published';
    
    const supabase = await createClient();
    
    // Build the query
    let query = supabase
      .from('blog_posts')
      .select('*');
    
    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply ordering
    query = query.order('published_at', { ascending: false });
    
    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }
    
    // Execute the query
    const { data: posts, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Unexpected error in blog API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
