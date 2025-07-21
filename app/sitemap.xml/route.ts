import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yotta.com';
    
    // Static pages
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'daily' },
      { url: '/services', priority: 0.9, changefreq: 'daily' },
      { url: '/tools', priority: 0.9, changefreq: 'daily' },
      { url: '/insights', priority: 0.8, changefreq: 'weekly' },
      { url: '/categories', priority: 0.8, changefreq: 'weekly' },
      { url: '/about', priority: 0.7, changefreq: 'monthly' },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' },
      { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    ];

    // Dynamic pages - Services
    const { data: services } = await supabase
      .from('services')
      .select('id, updated_at')
      .eq('published', true);

    // Dynamic pages - Tools
    const { data: tools } = await supabase
      .from('tools')
      .select('id, updated_at')
      .eq('published', true);

    // Dynamic pages - Blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${services?.map(service => `
  <url>
    <loc>${baseUrl}/services/${service.id}</loc>
    <lastmod>${service.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}
  ${tools?.map(tool => `
  <url>
    <loc>${baseUrl}/tools/${tool.id}</loc>
    <lastmod>${tool.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}
  ${posts?.map(post => `
  <url>
    <loc>${baseUrl}/insights/${post.slug}</loc>
    <lastmod>${post.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') || ''}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
