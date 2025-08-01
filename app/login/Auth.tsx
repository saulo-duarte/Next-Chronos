import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function Auth() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm border rounded-lg shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Image src="/icons/App Logo.png" alt="Chronos Logo" width={48} height={48} />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Chronos</CardTitle>
        </CardHeader>
        <CardContent>
          <a href={`${baseUrl}/api/v1/oauth2/authorize/google`}>
            <Button variant="outline" className="w-full">
              Entrar com Google
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
