"use client"

import { useEffect, useState } from "react"
import { Trophy, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementCelebrationProps {
  show: boolean
  goalTitle: string
  onComplete: () => void
}

export function AchievementCelebration({ show, goalTitle, onComplete }: AchievementCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show && !isVisible) return null

  const confettiColors = ["bg-blue-400", "bg-blue-600", "bg-blue-900"]
  const confettiElements = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    size: Math.random() * 6 + 3,
  }))

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-blue-950/20 backdrop-blur-sm transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {confettiElements.map((confetti) => (
        <div
          key={confetti.id}
          className={cn("confetti absolute rounded-full opacity-70", confetti.color)}
          style={{
            left: `${confetti.left}%`,
            width: `${confetti.size}px`,
            height: `${confetti.size}px`,
            animationDelay: `${confetti.delay}s`,
          }}
        />
      ))}

      <div
        className={cn(
          "achievement-pop relative mx-4 max-w-sm w-full rounded-2xl bg-background/80 p-8 text-center shadow-2xl",
          isVisible && "animate-in zoom-in-95 fade-in duration-300",
        )}
      >
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-lg shadow-blue-500/40">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-2">Objetivo Alcançado!</h2>
        <p className="text-sm text-muted-foreground mb-6 font-medium">Parabéns</p>

        <div className="mb-6 rounded-xl bg-primary/10 p-4 border border-primary/20">
          <p className="font-semibold text-base text-primary text-pretty italic">
            "{goalTitle}"
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-primary">
          <Sparkles className="h-5 w-5 fill-primary/20" />
          <p className="text-sm font-semibold">Mais um passo dado!</p>
          <Sparkles className="h-5 w-5 fill-primary/20" />
        </div>
      </div>
    </div>
  )
}