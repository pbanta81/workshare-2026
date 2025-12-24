import type { APIRoute } from 'astro';

// Hash function using Web Crypto API (works in Edge/Serverless)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Password required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash the submitted password
    const submittedHash = await hashPassword(password.trim());

    // Check against environment variables
    // Format: PORTFOLIO_1_HASH, PORTFOLIO_1_URL (optional), etc.
    let matchedPortfolio: { id: number; url?: string } | null = null;

    // Check up to 10 portfolio passwords
    // Use process.env (Vercel) with fallback to import.meta.env (local dev)
    for (let i = 1; i <= 10; i++) {
      const storedHash = process.env[`PORTFOLIO_${i}_HASH`] || import.meta.env[`PORTFOLIO_${i}_HASH`];

      if (storedHash && storedHash === submittedHash) {
        const redirectUrl = process.env[`PORTFOLIO_${i}_URL`] || import.meta.env[`PORTFOLIO_${i}_URL`];
        matchedPortfolio = { 
          id: i, 
          url: redirectUrl || undefined 
        };
        break;
      }
    }

    if (matchedPortfolio) {
      return new Response(JSON.stringify({ 
        success: true, 
        portfolioId: matchedPortfolio.id,
        redirectUrl: matchedPortfolio.url
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid password' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Explicitly mark this as a server route (not prerendered)
export const prerender = false;

