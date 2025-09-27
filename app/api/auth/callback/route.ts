import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
const BACKEND_URL = process.env.BACKEND_URL!;
const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResp.ok) {
      const errorText = await tokenResp.text();
      return NextResponse.json(
        { error: 'Erro ao trocar code com Google', details: errorText },
        { status: 500 }
      );
    }

    const tokens = await tokenResp.json();

    const userResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userResp.ok) {
      const errorText = await userResp.text();
      return NextResponse.json(
        { error: 'Erro ao buscar userinfo', details: errorText },
        { status: 500 }
      );
    }

    const user = await userResp.json();

    const authPayload = {
      providerID: user.id,
      email: user.email,
      username: user.name,
      picture: user.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };

    const backendResp = await fetch(`${BACKEND_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload),
    });

    if (!backendResp.ok) {
      const errorText = await backendResp.text();
      return NextResponse.json(
        { error: 'Erro ao autenticar no backend', details: errorText },
        { status: backendResp.status }
      );
    }

    const setCookieHeaders = backendResp.headers.getSetCookie();

    const response = NextResponse.redirect(REDIRECT_URL);

    setCookieHeaders.forEach((cookieHeader) => {
      response.headers.append('Set-Cookie', cookieHeader);
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno no callback', details: String(err) },
      { status: 500 }
    );
  }
}
