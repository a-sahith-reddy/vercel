"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { BookOpen, Zap, TrendingUp } from "lucide-react"

interface ProgressData {
  totalSessions: number
  averageScore: number
  subjectsStudied: number
  totalMinutes: number
  weeklyData: any[]
  recentScores: any[]
}

export function ProgressDashboard({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [userId])

  const loadProgress = async () => {
    const supabase = createClient()

    // Get quiz attempts
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("score, attempted_at")
      .eq("user_id", userId)
      .order("attempted_at", { ascending: false })

    // Get study sessions
    const { data: sessions } = await supabase.from("study_sessions").select("*").eq("user_id", userId)

    // Get subjects count
    const { data: subjects } = await supabase.from("subjects").select("id").eq("user_id", userId)

    const totalSessions = sessions?.length || 0
    const totalMinutes = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0
    const averageScore =
      attempts && attempts.length > 0
        ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length).toFixed(1)
        : 0

    const today = new Date()
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      return date
    })

    const weeklyData = lastSevenDays.map((date) => {
      const dayLabel = date.toLocaleDateString(undefined, { weekday: "short" })
      const minutesForDay =
        sessions
          ?.filter((session) => {
            if (!session.completed_at) return false
            const completed = new Date(session.completed_at)
            return (
              completed.getFullYear() === date.getFullYear() &&
              completed.getMonth() === date.getMonth() &&
              completed.getDate() === date.getDate()
            )
          })
          .reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0

      const attemptsForDay =
        attempts?.filter((attempt) => {
          if (!attempt.attempted_at) return false
          const attempted = new Date(attempt.attempted_at)
          return (
            attempted.getFullYear() === date.getFullYear() &&
            attempted.getMonth() === date.getMonth() &&
            attempted.getDate() === date.getDate()
          )
        }) || []

      const scoreForDay = attemptsForDay.length
        ? attemptsForDay.reduce((sum, attempt) => sum + Number(attempt.score || 0), 0) / attemptsForDay.length
        : 0

      return {
        day: dayLabel,
        minutes: minutesForDay,
        score: Math.round(scoreForDay),
      }
    })

    setProgress({
      totalSessions,
      averageScore: Number(averageScore) || 0,
      subjectsStudied: subjects?.length || 0,
      totalMinutes,
      weeklyData,
      recentScores: attempts?.slice(0, 5) || [],
    })
    setLoading(false)
  }

  if (loading || !progress) {
    return <div className="text-center py-12">Loading progress...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Learning Progress</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{progress.totalSessions}</span>
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{progress.averageScore}%</span>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{progress.subjectsStudied}</span>
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.totalMinutes}m</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Time</CardTitle>
            <CardDescription>Minutes studied per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progress.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Quiz Scores</CardTitle>
            <CardDescription>Quiz performance trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
