import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');
  if (token) {
    return NextResponse.redirect(new URL('/home', request.url));
  } else {
    return new NextResponse(
      `
      <!DOCTYPE html>
        <html>
          <head>
            <title>Autenticando...</title>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #1a1b2f; /* dark background */
                color: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: #2a2b3d; /* darker card */
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              }
              .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #444;
                border-top: 4px solid #00bfff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
              }
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="spinner"></div>
              <h2>Autenticando...</h2>
              <p>Redirecionando em instantes.</p>
            </div>
            <script>
              console.log('Aguardando cookies serem processados...');
              setTimeout(() => {
                window.location.href = '/home';
              }, 1500);
            </script>
          </body>
        </html>
        `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
