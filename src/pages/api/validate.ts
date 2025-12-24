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
    // Format: PORTFOLIO_1_HASH, PORTFOLIO_1_URL, PORTFOLIO_2_HASH, PORTFOLIO_2_URL, etc.
    let matchedUrl: string | null = null;

    // Check up to 10 portfolio passwords
    for (let i = 1; i <= 10; i++) {
      const storedHash = process.env[`PORTFOLIO_${i}_HASH`];
      const redirectUrl = process.env[`PORTFOLIO_${i}_URL`];

      if (storedHash && redirectUrl && storedHash === submittedHash) {
        matchedUrl = redirectUrl;
        break;
      }
    }

    if (matchedUrl) {
      return new Response(JSON.stringify({ 
        success: true, 
        redirectUrl: matchedUrl 
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

