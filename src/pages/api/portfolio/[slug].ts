import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ 
      error: 'Slug required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const portfolios = await getCollection('portfolios');
    const portfolio = portfolios.find(p => p.slug === slug);

    if (!portfolio) {
      return new Response(JSON.stringify({ 
        error: 'Portfolio not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Render the MDX content to HTML
    const { Content, remarkPluginFrontmatter } = await portfolio.render();
    
    // We can't directly serialize the Content component, so we'll render it
    // For now, return the raw body and frontmatter
    return new Response(JSON.stringify({ 
      slug: portfolio.slug,
      frontmatter: portfolio.data,
      body: portfolio.body, // Raw MDX/markdown content
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const prerender = false;

