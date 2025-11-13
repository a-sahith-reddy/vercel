import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"
import { initializeUserDefaults } from "@/lib/initialize-user"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  await initializeUserDefaults(supabase, user.id)

  return <DashboardContent userId={user.id} />
}
