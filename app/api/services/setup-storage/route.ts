import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  try {
    const bucketName = 'services-media';
    
    // Check if bucket exists
    const { data: buckets } = await supabaseService.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabaseService.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return NextResponse.json(
          { error: `Failed to create bucket: ${error.message}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: `Bucket '${bucketName}' created successfully` });
    } else {
      // Update bucket to ensure it's public
      const { error } = await supabaseService.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error updating bucket:', error);
        return NextResponse.json(
          { error: `Failed to update bucket: ${error.message}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: `Bucket '${bucketName}' already exists and is set to public` });
    }
  } catch (error: any) {
    console.error('Error in setup storage API route:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
