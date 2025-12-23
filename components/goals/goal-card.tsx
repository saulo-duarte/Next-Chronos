"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar, Check } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Goal, GoalStatus } from "@/types/Goal"
import { cn } from "@/lib/utils"

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (goal: Goal) => void
  onStatusChange: (goalId: string, status: GoalStatus) => void
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onStatusChange,
}: GoalCardProps) {
  const isCompleted = goal.status === GoalStatus.COMPLETED

  const toggleStatus = () => {
    const newStatus = isCompleted ? GoalStatus.PENDING : GoalStatus.COMPLETED
    onStatusChange(goal.id, newStatus)
  }

  const dateLabel = goal.created_at
    ? format(new Date(goal.created_at), "dd 'de' MMM", { locale: ptBR })
    : "—"

  return (
    <div className="group flex items-center gap-4 w-full rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
      <button
        onClick={toggleStatus}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          isCompleted 
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "font-semibold leading-tight text-base truncate",
            isCompleted && "text-muted-foreground line-through decoration-1"
          )}>
            {goal.title}
          </h3>
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            <Calendar className="h-2.5 w-2.5" />
            {goal.year}
          </span>
        </div>

        {goal.description && (
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {goal.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="hidden sm:block text-[11px] text-muted-foreground capitalize">
          {dateLabel}
        </span>
        
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(goal)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}