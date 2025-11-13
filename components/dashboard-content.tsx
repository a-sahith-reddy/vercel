"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, LogOut, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AIGuideDialog } from "./ai-guide-dialog"
import { SubjectsList } from "./subjects-list"
import { ProgressDashboard } from "./progress-dashboard"

export function DashboardContent({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null)
  const [showGuideDialog, setShowGuideDialog] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">StudyAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Manage your subjects, generate AI study guides, and track your progress
            </p>
          </div>
          <Button onClick={() => setShowGuideDialog(true)} className="gap-2">
            <Zap className="w-4 h-4" />
            Generate Study Guide
          </Button>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            <ProgressDashboard userId={userId} />
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <SubjectsList userId={userId} />
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Guide Dialog */}
      <AIGuideDialog open={showGuideDialog} onOpenChange={setShowGuideDialog} userId={userId} />
    </div>
  )
}
