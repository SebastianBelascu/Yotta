'use client';

import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface SEOHelperProps {
  title: string;
  content: string;
  slug: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export default function SEOHelper({ 
  title, 
  content, 
  slug, 
  metaDescription = '', 
  focusKeyword = '' 
}: SEOHelperProps) {
  // Remove HTML tags from content for analysis
  const plainContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
  
  // SEO Analysis
  const seoAnalysis = useMemo(() => {
    // Ensure metaDescription is a string
    const metaDesc = metaDescription || '';
    
    const analysis = {
      title: {
        length: title.length,
        optimal: title.length >= 30 && title.length <= 60,
        status: title.length >= 30 && title.length <= 60 ? 'good' : 
                title.length < 30 ? 'warning' : 'error'
      },
      content: {
        wordCount: plainContent.split(/\s+/).filter(word => word.length > 0).length,
        optimal: plainContent.split(/\s+/).filter(word => word.length > 0).length >= 300,
        status: plainContent.split(/\s+/).filter(word => word.length > 0).length >= 300 ? 'good' : 'warning'
      },
      slug: {
        length: slug.length,
        optimal: slug.length >= 3 && slug.length <= 50 && /^[a-z0-9-]+$/.test(slug),
        status: slug.length >= 3 && slug.length <= 50 && /^[a-z0-9-]+$/.test(slug) ? 'good' : 'warning'
      },
      metaDescription: {
        length: metaDesc.length,
        optimal: metaDesc.length >= 120 && metaDesc.length <= 160,
        status: metaDesc.length >= 120 && metaDesc.length <= 160 ? 'good' : 
                metaDesc.length < 120 ? 'warning' : 'error'
      },
      focusKeyword: {
        inTitle: focusKeyword ? title.toLowerCase().includes(focusKeyword.toLowerCase()) : false,
        inContent: focusKeyword ? plainContent.toLowerCase().includes(focusKeyword.toLowerCase()) : false,
        inSlug: focusKeyword ? slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, '-')) : false,
        density: focusKeyword ? 
          (plainContent.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) / 
          plainContent.split(/\s+/).length * 100 : 0
      }
    };

    return analysis;
  }, [title, plainContent, slug, metaDescription, focusKeyword]);

  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // SEO score calculation
  const calculateSEOScore = () => {
    let score = 0;
    let maxScore = 0;

    // Title (20 points)
    maxScore += 20;
    if (seoAnalysis.title.optimal) score += 20;
    else if (seoAnalysis.title.status === 'warning') score += 10;

    // Content length (20 points)
    maxScore += 20;
    if (seoAnalysis.content.optimal) score += 20;
    else if (seoAnalysis.content.wordCount >= 150) score += 10;

    // Slug (15 points)
    maxScore += 15;
    if (seoAnalysis.slug.optimal) score += 15;
    else if (slug.length > 0) score += 5;

    // Meta description (15 points)
    maxScore += 15;
    if (seoAnalysis.metaDescription.optimal) score += 15;
    else if (metaDescription.length > 0) score += 5;

    // Focus keyword usage (30 points)
    if (focusKeyword) {
      maxScore += 30;
      if (seoAnalysis.focusKeyword.inTitle) score += 10;
      if (seoAnalysis.focusKeyword.inContent) score += 10;
      if (seoAnalysis.focusKeyword.inSlug) score += 5;
      if (seoAnalysis.focusKeyword.density >= 0.5 && seoAnalysis.focusKeyword.density <= 2.5) score += 5;
    }

    return Math.round((score / maxScore) * 100);
  };

  const seoScore = calculateSEOScore();

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">SEO Score:</span>
          <span className={`font-bold ${
            seoScore >= 80 ? 'text-green-600' : 
            seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {seoScore}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Title Analysis */}
        <div className="flex items-start gap-3">
          <StatusIcon status={seoAnalysis.title.status} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Title Length</span>
              <span className="text-sm text-gray-600">{seoAnalysis.title.length}/60</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {seoAnalysis.title.optimal ? 
                'Perfect title length for SEO' : 
                seoAnalysis.title.length < 30 ? 
                  'Title is too short. Aim for 30-60 characters.' :
                  'Title is too long. Keep it under 60 characters.'
              }
            </p>
          </div>
        </div>

        {/* Content Analysis */}
        <div className="flex items-start gap-3">
          <StatusIcon status={seoAnalysis.content.status} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Content Length</span>
              <span className="text-sm text-gray-600">{seoAnalysis.content.wordCount} words</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {seoAnalysis.content.optimal ? 
                'Good content length for SEO' : 
                'Consider adding more content. Aim for at least 300 words.'
              }
            </p>
          </div>
        </div>

        {/* Slug Analysis */}
        <div className="flex items-start gap-3">
          <StatusIcon status={seoAnalysis.slug.status} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">URL Slug</span>
              <span className="text-sm text-gray-600">{seoAnalysis.slug.length} chars</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {seoAnalysis.slug.optimal ? 
                'SEO-friendly URL slug' : 
                'Use lowercase letters, numbers, and hyphens only. Keep it concise.'
              }
            </p>
          </div>
        </div>

        {/* Meta Description Analysis */}
        <div className="flex items-start gap-3">
          <StatusIcon status={seoAnalysis.metaDescription.status} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Meta Description</span>
              <span className="text-sm text-gray-600">{seoAnalysis.metaDescription.length}/160</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {seoAnalysis.metaDescription.optimal ? 
                'Perfect meta description length' : 
                seoAnalysis.metaDescription.length < 120 ? 
                  'Meta description is too short. Aim for 120-160 characters.' :
                  'Meta description is too long. Keep it under 160 characters.'
              }
            </p>
          </div>
        </div>

        {/* Focus Keyword Analysis */}
        {focusKeyword && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Focus Keyword: "{focusKeyword}"</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={seoAnalysis.focusKeyword.inTitle ? 'good' : 'warning'} />
                <span className="text-sm text-gray-600">
                  {seoAnalysis.focusKeyword.inTitle ? 'Found in title' : 'Not found in title'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={seoAnalysis.focusKeyword.inContent ? 'good' : 'warning'} />
                <span className="text-sm text-gray-600">
                  {seoAnalysis.focusKeyword.inContent ? 'Found in content' : 'Not found in content'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={seoAnalysis.focusKeyword.inSlug ? 'good' : 'warning'} />
                <span className="text-sm text-gray-600">
                  {seoAnalysis.focusKeyword.inSlug ? 'Found in URL slug' : 'Not found in URL slug'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={
                  seoAnalysis.focusKeyword.density >= 0.5 && seoAnalysis.focusKeyword.density <= 2.5 ? 
                  'good' : 'warning'
                } />
                <span className="text-sm text-gray-600">
                  Keyword density: {seoAnalysis.focusKeyword.density.toFixed(1)}% 
                  {seoAnalysis.focusKeyword.density >= 0.5 && seoAnalysis.focusKeyword.density <= 2.5 ? 
                    ' (optimal)' : ' (aim for 0.5-2.5%)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Tips */}
      <div className="border-t pt-3">
        <h4 className="font-medium text-gray-900 mb-2">SEO Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use headings (H1, H2, H3) to structure your content</li>
          <li>• Include internal and external links where relevant</li>
          <li>• Add alt text to images for better accessibility</li>
          <li>• Write for humans first, search engines second</li>
          <li>• Use your focus keyword naturally throughout the content</li>
        </ul>
      </div>
    </div>
  );
}
