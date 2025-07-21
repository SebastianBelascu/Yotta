import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = 'services-media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // First ensure the bucket exists and is public
    await ensureBucketExists(bucketName);
    
    // Upload the file
    const { data, error } = await supabaseService.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return NextResponse.json(
        { error: `Failed to upload image: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseService.storage
      .from(bucketName)
      .getPublicUrl(data?.path || '');
    
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// Helper function to ensure the bucket exists and is public
async function ensureBucketExists(bucketName: string) {
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
      throw new Error(`Failed to create bucket: ${error.message}`);
    }
  } else {
    // Update bucket to ensure it's public
    const { error } = await supabaseService.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      console.error('Error updating bucket:', error);
      throw new Error(`Failed to update bucket: ${error.message}`);
    }
  }
}
