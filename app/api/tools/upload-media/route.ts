import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

// Helper function to ensure the bucket exists
async function ensureBucketExists() {
  try {
    const bucketName = 'tools-media';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseService.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return { success: false, error: `Failed to list buckets: ${listError.message}` };
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabaseService.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return { success: false, error: `Failed to create bucket: ${createError.message}` };
      }
      
      console.log(`Bucket '${bucketName}' created successfully`);
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error ensuring bucket exists:', error);
    return { success: false, error: `Failed to setup storage bucket: ${error.message}` };
  }
}

export async function POST(request: NextRequest) {
  try {
    // First ensure the bucket exists
    const bucketSetup = await ensureBucketExists();
    if (!bucketSetup.success) {
      return NextResponse.json({ error: bucketSetup.error }, { status: 500 });
    }
    
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'banner'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['logo', 'banner'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "logo" or "banner"' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${timestamp}_${randomString}.${fileExtension}`;
    
    console.log(`Uploading ${type} file: ${fileName}`);
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage using service role client
    const { data, error } = await supabaseService.storage
      .from('tools-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ 
        error: 'Failed to upload file', 
        details: error.message 
      }, { status: 500 });
    }

    console.log('File uploaded successfully:', data);

    // Get public URL
    const { data: { publicUrl } } = supabaseService.storage
      .from('tools-media')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      url: publicUrl,
      fileName: fileName,
      type: type
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
