"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Subject {
  id: string
  name: string
  description: string
  created_at: string
}

interface StudyMaterial {
  id: string
  title: string
  content: string
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

interface Quiz {
  id: string
  title: string
  quiz_questions: QuizQuestion[]
}

export function SubjectsList({ userId }: { userId: string }) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [open, setOpen] = useState(false)
  const [materialsOpen, setMaterialsOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    loadSubjects()
  }, [userId])

  const loadSubjects = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setSubjects(data)
    }
    setLoading(false)
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const supabase = createClient()
    const { error } = await supabase.from("subjects").insert({
      user_id: userId,
      name,
      description,
    })

    if (!error) {
      setName("")
      setDescription("")
      setOpen(false)
      loadSubjects()
    }
  }

  const handleDeleteSubject = async (id: string) => {
    const supabase = createClient()
    await supabase.from("subjects").delete().eq("id", id)
    loadSubjects()
  }

  const loadSubjectResources = async (subject: Subject) => {
    const supabase = createClient()
    setMaterialsLoading(true)
    setSelectedSubject(subject)

    const [{ data: materialsData }, { data: quizzesData }] = await Promise.all([
      supabase.from("study_materials").select("id, title, content").eq("subject_id", subject.id),
      supabase
        .from("quizzes")
        .select("id, title, quiz_questions ( id, question, options, correct_answer, explanation )")
        .eq("subject_id", subject.id),
    ])

    setMaterials(materialsData || [])
    setQuizzes(quizzesData || [])
    setMaterialsLoading(false)
    setMaterialsOpen(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading subjects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Subjects</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>Add a new subject to your study list</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Biology 101"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this subject..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Subject
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No subjects yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
                {subject.description && <CardDescription>{subject.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => loadSubjectResources(subject)}>
                    View Materials
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={materialsOpen} onOpenChange={setMaterialsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedSubject?.name || "Subject Resources"}</DialogTitle>
            <DialogDescription>
              {materialsLoading
                ? "Fetching study materials..."
                : selectedSubject?.description || "Curated materials, guided by AI, to help you get started."}
            </DialogDescription>
          </DialogHeader>

          {materialsLoading ? (
            <p className="py-8 text-center text-muted-foreground">Loading resources...</p>
          ) : (
            <div className="space-y-6">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Study Materials</h3>
                  <Badge variant="secondary">{materials.length} items</Badge>
                </div>
                {materials.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No materials yet. Generate an AI guide to populate resources.</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <Card key={material.id} className="border border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{material.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                          {material.content}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <Separator />

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Quizzes</h3>
                  <Badge variant="secondary">{quizzes.length} available</Badge>
                </div>
                {quizzes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No quizzes yet. Generate an AI study guide to unlock practice questions.</p>
                ) : (
                  <div className="space-y-3">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} className="border border-border/60">
                        <CardHeader>
                          <CardTitle className="text-base">{quiz.title}</CardTitle>
                          <CardDescription>Self-check questions with answers highlighted.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          {quiz.quiz_questions?.map((question) => (
                            <div key={question.id} className="space-y-2 rounded-lg border border-border/40 bg-muted/40 p-3">
                              <p className="font-semibold">{question.question}</p>
                              <ul className="space-y-1 text-muted-foreground">
                                {question.options?.map((option) => (
                                  <li
                                    key={option}
                                    className={`rounded-md border px-3 py-2 ${
                                      option === question.correct_answer
                                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                        : "border-border/60"
                                    }`}
                                  >
                                    {option}
                                  </li>
                                ))}
                              </ul>
                              {question.explanation ? (
                                <p className="text-xs text-muted-foreground">Why: {question.explanation}</p>
                              ) : null}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
