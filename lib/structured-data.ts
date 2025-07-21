// Structured Data (Schema.org) helpers for SEO

export interface Service {
  id: string;
  name: string;
  description: string;
  starting_price?: number;
  currency?: string;
  main_categories?: string[];
  region_served?: string[];
  logo_url?: string;
  banner_url?: string;
  vendor_id?: string;
  email_for_leads?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
}

// Organization Schema for homepage and about page
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Yotta",
    "description": "Discover, compare and get quotes on the best services, deals, and AI tools to start, scale and succeed in business across Singapore and Malaysia.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/contact`
    },
    "sameAs": [
      // Add social media URLs when available
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Singapore"
      },
      {
        "@type": "Country", 
        "name": "Malaysia"
      }
    ]
  };
}

// Service Schema for individual service pages
export function generateServiceSchema(service: Service, vendor?: Vendor) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/services/${service.id}`,
    "image": service.banner_url || service.logo_url,
    "category": service.main_categories?.join(", "),
    "areaServed": service.region_served?.map(region => ({
      "@type": "Place",
      "name": region
    }))
  };

  // Add pricing if available
  if (service.starting_price) {
    (baseSchema as any).offers = {
      "@type": "Offer",
      "price": service.starting_price,
      "priceCurrency": service.currency || "SGD",
      "availability": "https://schema.org/InStock"
    };
  }

  // Add provider if available
  if (vendor) {
    (baseSchema as any).provider = {
      "@type": "Organization",
      "name": vendor.name,
      "email": vendor.email
    };
  }

  return baseSchema;
}

// Product Schema for tools/products
export function generateProductSchema(tool: any) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": tool.name,
    "description": tool.description,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/tools/${tool.id}`,
    "image": tool.banner_url || tool.logo_url,
    "category": tool.categories?.join(", "),
    "brand": {
      "@type": "Brand",
      "name": tool.name
    }
  };

  // Add pricing if available
  if (tool.starting_price) {
    (baseSchema as any).offers = {
      "@type": "Offer",
      "price": tool.starting_price,
      "priceCurrency": tool.currency || "USD",
      "availability": "https://schema.org/InStock",
      "url": tool.affiliate_link
    };
  }

  // Add aggregateRating if we have rating data
  if (tool.rating && tool.review_count) {
    (baseSchema as any).aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "reviewCount": tool.review_count,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return baseSchema;
}

// Article Schema for blog posts/insights
export function generateArticleSchema(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description || article.excerpt,
    "image": article.featured_image,
    "author": {
      "@type": "Organization",
      "name": "Yotta"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yotta",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/images/logo.png`
      }
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/insights/${article.slug}`
    }
  };
}

// FAQ Schema for FAQ pages
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Website Schema for homepage
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yotta",
    "description": "Discover, compare and get quotes on the best services, deals, and AI tools to start, scale and succeed in business across Singapore and Malaysia.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://yotta.com"}/services/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}
