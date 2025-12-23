"use client"

import { AppHeader } from "@/components/AppHeader";
import { GoalsPage as GoalsView } from "@/components/goals/goals-view";

export default function GoalsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Goals", href: "/goals" },
  ]
  return( <>
        <AppHeader breadcrumbs={breadcrumbs} />
        <GoalsView />
    </>)
}
