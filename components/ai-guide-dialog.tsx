"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AIGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

interface StudyGuide {
  overview: {
    introduction: string
    learningObjectives: string[]
    summary: string
  }
  suggestedSubjects: {
    name: string
    description: string
  }[]
  modules: {
    title: string
    objective: string
    contentSummary: string
    keyConcepts: string[]
    practiceActivities: string[]
    resources: {
      title: string
      type: string
      reference: string
    }[]
  }[]
  quickNotes: string[]
  quiz: {
    question: string
    options: string[]
    answer: string
    explanation: string
  }[]
  suggestedMaterials: {
    title: string
    description: string
    link?: string
  }[]
  studyTips: string[]
  notesSummary?: string
}

export function AIGuideDialog({ open, onOpenChange, userId }: AIGuideDialogProps) {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [level, setLevel] = useState("intermediate")
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [guide, setGuide] = useState<StudyGuide | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateGuide = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !subject) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject, level, notes }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Failed to generate study guide. Try again later.")
        return
      }
      setGuide(data.guide as StudyGuide)
    } catch (error) {
      console.error("Error generating guide:", error)
      setError("We ran into an issue generating your guide. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTopic("")
    setSubject("")
    setLevel("intermediate")
    setNotes("")
    setError(null)
    setGuide(null)
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate AI Study Guide</DialogTitle>
          <DialogDescription>Provide a topic and subject to generate a personalized study guide</DialogDescription>
        </DialogHeader>

        {!guide ? (
          <form onSubmit={handleGenerateGuide} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Photosynthesis, Quadratic Equations"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" placeholder="e.g., Biology, Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                Learner Notes <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Paste notes or key points you want summarized. The AI will weave them into the guide."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Study Guide"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Learning Blueprint
                </CardTitle>
                <CardDescription>{guide.overview.introduction}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Learning Objectives</h4>
                  <ul className="mt-2 grid gap-2 text-sm">
                    {guide.overview.learningObjectives.map((objective) => (
                      <li key={objective} className="rounded-md bg-muted px-3 py-2">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                {guide.notesSummary ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Notes Summary</h4>
                    <p className="mt-2 text-sm leading-relaxed text-primary">{guide.notesSummary}</p>
                  </div>
                ) : null}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Overview Summary</h4>
                  <p className="mt-2 text-sm leading-relaxed">{guide.overview.summary}</p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Suggested Subject Focus</h3>
                <Badge variant="secondary">AI Recommended</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {guide.suggestedSubjects.map((subject) => (
                  <Card key={subject.name} className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{subject.description}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Modular Learning Path</h3>
              <div className="grid gap-4">
                {guide.modules.map((module) => (
                  <Card key={module.title}>
                    <CardHeader>
                      <CardTitle className="text-base">{module.title}</CardTitle>
                      <CardDescription>{module.objective}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Focus</h4>
                        <p className="mt-2 leading-relaxed">{module.contentSummary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Key Concepts</h4>
                        <ul className="mt-2 grid gap-2">
                          {module.keyConcepts.map((concept) => (
                            <li key={concept} className="rounded-md bg-muted px-3 py-2">
                              {concept}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Practice</h4>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {module.practiceActivities.map((activity) => (
                            <li key={activity}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Resources</h4>
                        <ul className="mt-2 space-y-2">
                          {module.resources.map((resource) => (
                            <li key={`${module.title}-${resource.title}`} className="flex flex-col rounded-md border border-border/50 bg-muted/30 px-3 py-2">
                              <span className="text-sm font-semibold">{resource.title}</span>
                              <span className="text-xs uppercase text-muted-foreground">{resource.type}</span>
                              <span className="text-sm text-muted-foreground">{resource.reference}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Notes</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {guide.quickNotes.map((note) => (
                  <div key={note} className="rounded-lg border border-border/50 bg-muted px-4 py-3 text-sm leading-relaxed">
                    {note}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">AI Practice Quiz</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {guide.quiz.map((item, index) => (
                  <AccordionItem key={`quiz-${index}`} value={`quiz-${index}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 text-left">
                      <span className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1">
                          Q{index + 1}
                        </Badge>
                        <span>{item.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-3">
                      <ul className="space-y-2 text-sm">
                        {item.options.map((option, optIndex) => (
                          <li key={option} className="flex gap-2 rounded-md border border-border/60 px-3 py-2">
                            <Badge variant={option === item.answer ? "secondary" : "outline"}>{String.fromCharCode(65 + optIndex)}</Badge>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-300">
                        <span className="font-semibold">Answer:</span> {item.answer}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Extended Materials</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {guide.suggestedMaterials.map((material) => (
                  <Card key={material.title} className="border border-border/60">
                    <CardHeader>
                      <CardTitle className="text-base">{material.title}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    {material.link ? (
                      <CardContent>
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Visit resource
                        </a>
                      </CardContent>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Study Tips</h3>
              <ul className="space-y-2 text-sm">
                {guide.studyTips.map((tip) => (
                  <li key={tip} className="rounded-md border border-border/50 bg-muted/40 px-3 py-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  const element = document.createElement("a")
                  element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guide, null, 2)))
                  element.setAttribute("download", `study-guide-${Date.now()}.txt`)
                  element.style.display = "none"
                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                }}
                className="flex-1"
              >
                Download Guide
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                Generate Another
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
