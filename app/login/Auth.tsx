import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { FaGoogle, FaBookOpen, FaClock, FaChartLine } from 'react-icons/fa';

export function Auth() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl"></div>
            <div className="relative p-4">
              <Image
                src="/icons/App Logo.png"
                alt="Chronos Logo"
                width={72}
                height={72}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Chronos</h1>
            <p className="text-lg text-muted-foreground font-medium">Organização e Estudos</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-semibold text-card-foreground">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Faça login para continuar sua jornada de estudos
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <a href={`${baseUrl}/users/register`} aria-label="Entrar com Google" className="block">
              <Button
                variant="default"
                size="lg"
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FaGoogle className="text-xl mr-3" />
                Continuar com Google
              </Button>
            </a>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-4 font-medium">
                O que você pode fazer no Chronos:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaBookOpen className="text-primary text-sm" />
                  </div>
                  <span className="text-muted-foreground">Organize seus materiais de estudo</span>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaClock className="text-primary text-sm" />
                  </div>
                  <span className="text-muted-foreground">
                    Gerencie seu tempo de forma eficiente
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-primary text-sm" />
                  </div>
                  <span className="text-muted-foreground">Acompanhe seu progresso</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Ao continuar, você concorda com nossos</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-4">
              Termos de Uso
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-4">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
