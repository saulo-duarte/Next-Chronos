'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ClipboardList, LayoutDashboard, Link2, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingClient() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const features = [
    {
      label: 'Gerenciar Tarefas',
      icon: ClipboardList,
    },
    {
      label: 'Visualizações Inteligentes',
      icon: LayoutDashboard,
    },
    {
      label: 'Organizar Links',
      icon: Link2,
    },
    {
      label: 'Centralizar Arquivos',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden pb-16">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/20 via-background/10 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-background rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 w-[150%] h-[300px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-60"
          style={{
            transform: 'translate(-30%, -50%) rotate(-30deg)',
          }}
        />
      </div>

      <motion.header
        className="fixed top-0 left-0 right-0 z-999 flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm bg-background/30 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image src={'/Logo Chronos.png'} alt="Chronos Logo" width={48} height={48} />
          </div>
          <span className="text-white text-3xl font-bold">Chronos</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Funcionalidades
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Sobre
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white dark:hover:bg-background/40"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            onClick={() => router.push('/login?mode=register')}
          >
            Criar Conta
          </Button>{' '}
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mt-16 md:mt-4">
                Domine seu tempo.
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-400 leading-tight">
                Potencialize seu aprendizado
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-white/80 max-w-lg leading-relaxed"
            >
              Planeje, execute e evolua com visão{' '}
              <span className="font-semibold text-white">total sobre</span> seus projetos e estudos.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2"
            >
              {features.map(({ label, icon: Icon }) => (
                <motion.div
                  key={label}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-backgroud-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

                  <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-start justify-between h-30 hover:bg-white/15 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-white font-semibold text-lg">{label}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10" />

              <div className="relative p-8">
                <Image
                  src="/svg/Hero Image.svg"
                  alt="Chronos productivity illustration"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-2xl border border-white/20"
              />

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/20 backdrop-blur-md rounded-xl border border-white/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
