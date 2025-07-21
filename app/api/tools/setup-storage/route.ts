import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  try {
    const bucketName = 'tools-media';
    console.log('Starting storage setup process for bucket:', bucketName);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseService.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({ 
        error: 'Failed to check storage', 
        details: listError.message 
      }, { status: 500 });
    }

    console.log('Buckets found:', buckets?.map(b => b.name) || []);
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      console.log(`Creating ${bucketName} bucket...`);
      const { error: createError } = await supabaseService.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return NextResponse.json(
          { error: `Failed to create bucket: ${createError.message}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: `Bucket '${bucketName}' created successfully` });
    } else {
      // Update bucket to ensure it's public with correct settings
      console.log(`Bucket ${bucketName} already exists, updating settings...`);
      const { error: updateError } = await supabaseService.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (updateError) {
        console.error('Error updating bucket:', updateError);
        return NextResponse.json(
          { error: `Failed to update bucket: ${updateError.message}` },
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
