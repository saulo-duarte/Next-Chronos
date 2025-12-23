"use client"

import { useMemo, useState } from "react"
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from "@/hooks/data/useGoalsQuery"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { toast } from "sonner"
import { Goal, GoalPayload, GoalStatus, UpdateGoalPayload } from "@/types/Goal"
import { GoalCard } from "./goal-card"
import { AchievementCelebration } from "./Achievement"
import { GoalFormDialog } from "./goal-dialog"

export function GoalsPage() {
  const { data, isLoading } = useGoals()
  const goals = data ?? []

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()
  const [celebratingGoal, setCelebratingGoal] = useState<Goal | null>(null)

  const goalsByYear = useMemo(() => {
    return goals.reduce<Record<number, Goal[]>>((acc, goal) => {
      acc[goal.year] ??= []
      acc[goal.year].push(goal)
      return acc
    }, {})
  }, [goals])

  const sortedYears = useMemo(
    () => Object.keys(goalsByYear).map(Number).sort((a, b) => b - a),
    [goalsByYear],
  )

  const stats = useMemo(() => {
    const completed = goals.filter((g) => g.status === GoalStatus.COMPLETED).length
    return {
      total: goals.length,
      completed,
      label: goals.length === 1 ? "meta" : "metas"
    }
  }, [goals])

  const handleSaveGoal = (payload: GoalPayload | UpdateGoalPayload) => {
    if (editingGoal) {
      updateGoal.mutate(
        { id: editingGoal.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Meta atualizada")
            setEditingGoal(undefined)
            setDialogOpen(false)
          },
          onError: () => toast.error("Erro ao atualizar"),
        }
      )
    } else {
      createGoal.mutate(payload as GoalPayload, {
        onSuccess: () => {
          toast.success("Meta criada")
          setDialogOpen(false)
        },
        onError: () => toast.error("Erro ao criar"),
      })
    }
  }

  const handleStatusChange = (goalId: string, status: GoalStatus) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const previousStatus = goal.status

    updateGoal.mutate(
      { id: goalId, status },
      {
        onSuccess: () => {
          if (status === GoalStatus.COMPLETED && previousStatus !== GoalStatus.COMPLETED) {
            setCelebratingGoal(goal)
          }
        },
        onError: () => toast.error("Erro ao atualizar status"),
      }
    )
  }

  const handleDeleteGoal = (goal: Goal) => {
    if (!confirm(`Deseja excluir a meta "${goal.title}"?`)) return

    deleteGoal.mutate(goal.id, {
      onSuccess: () => toast.success("Meta excluída"),
      onError: () => toast.error("Erro ao excluir"),
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center text-muted-foreground">
        <p className="animate-pulse">Carregando metas...</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} {stats.label} • {stats.completed} concluídas
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </header>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold italic">Sua lista está vazia</h2>
          <p className="mb-6 text-muted-foreground max-w-xs text-sm">
            Defina seus objetivos para os próximos anos e acompanhe seu progresso.
          </p>
          <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Criar primeira meta
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedYears.map((year) => (
            <section key={year} className="space-y-3">
              <div className="flex items-center gap-4 px-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{year}</h2>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <div className="flex flex-col gap-2">
                {goalsByYear[year].map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onStatusChange={handleStatusChange}
                    onEdit={(g) => {
                      setEditingGoal(g)
                      setDialogOpen(true)
                    }}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <GoalFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingGoal(undefined)
          setDialogOpen(open)
        }}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      <AchievementCelebration
        show={!!celebratingGoal}
        goalTitle={celebratingGoal?.title ?? ""}
        onComplete={() => setCelebratingGoal(null)}
      />
    </div>
  )
}