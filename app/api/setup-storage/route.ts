import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function POST() {
  try {
    const bucketName = 'blog-images';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseService.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabaseService.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      
      return NextResponse.json({ message: 'Bucket created successfully' });
    } else {
      // Update bucket to ensure it's public
      const { error: updateError } = await supabaseService.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      
      if (updateError) {
        console.error('Error updating bucket:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      
      return NextResponse.json({ message: 'Bucket updated successfully' });
    }
  } catch (error: any) {
    console.error('Setup storage error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
