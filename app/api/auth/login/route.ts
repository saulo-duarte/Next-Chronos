import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
const BACKEND_URL = process.env.BACKEND_URL!;
const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleUrl.searchParams.set('response_type', 'code');
    googleUrl.searchParams.set('access_type', 'offline');
    googleUrl.searchParams.set('prompt', 'consent');
    googleUrl.searchParams.set(
      'scope',
      ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar'].join(' ')
    );
    return NextResponse.redirect(googleUrl.toString());
  }

  try {
    const backendResp = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        redirectUri: GOOGLE_REDIRECT_URI,
      }),
    });

    if (!backendResp.ok) {
      const errorText = await backendResp.text();
      return NextResponse.json(
        { error: 'Erro ao autenticar no backend', details: errorText },
        { status: backendResp.status }
      );
    }

    return NextResponse.redirect(REDIRECT_URL);
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno no login', details: String(err) },
      { status: 500 }
    );
  }
}
