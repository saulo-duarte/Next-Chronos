import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

export async function GET() {
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
