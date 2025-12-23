"use client"

import type React from "react"
import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Goal,
  GoalPayload,
  GoalStatus,
  UpdateGoalPayload,
} from "@/types/Goal"

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: GoalPayload | UpdateGoalPayload) => void
  goal?: Goal
}

export function GoalFormDialog({
  open,
  onOpenChange,
  onSave,
  goal,
}: GoalFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [year, setYear] = useState(
    new Date().getFullYear().toString(),
  )
  const [status, setStatus] = useState<GoalStatus>(
    GoalStatus.PENDING,
  )

  /* --------------------------------
   * Sync form when editing changes
   * -------------------------------- */
  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description ?? "")
      setYear(goal.year.toString())
      setStatus(goal.status)
    } else {
      setTitle("")
      setDescription("")
      setYear(new Date().getFullYear().toString())
      setStatus(GoalStatus.PENDING)
    }
  }, [goal])

  /* --------------------------------
   * Submit
   * -------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: GoalPayload | UpdateGoalPayload = {
      title,
      description,
      year: Number(year),
      status,
    }

    onSave(payload)
    handleClose()
  }

  /* --------------------------------
   * Close / Reset
   * -------------------------------- */
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Editar Meta" : "Nova Meta"}
          </DialogTitle>
          <DialogDescription>
            {goal
              ? "Atualize as informações da sua meta."
              : "Crie uma nova meta e comece a trabalhar nela hoje!"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Aprender Next.js"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva sua meta em detalhes..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
              />
            </div>

            {/* Year + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano *</Label>
                <Input
                  id="year"
                  type="number"
                  min="2024"
                  max="2030"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as GoalStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={GoalStatus.PENDING}
                    >
                      Pendente
                    </SelectItem>
                    <SelectItem
                      value={GoalStatus.IN_PROGRESS}
                    >
                      Em Progresso
                    </SelectItem>
                    <SelectItem
                      value={GoalStatus.COMPLETED}
                    >
                      Concluída
                    </SelectItem>
                    <SelectItem
                      value={GoalStatus.CANCELLED}
                    >
                      Cancelada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
            >
              {goal ? "Salvar" : "Criar Meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
