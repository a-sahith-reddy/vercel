"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, BookOpen, BarChart3, Zap, ArrowRight, Lightbulb, Target } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/90">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">StudyAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="gap-2 transition-all hover:shadow-lg">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Learn Smarter with AI-Powered Study Guides
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Create personalized study guides, practice interactive quizzes, and track your learning progress with
            intelligent AI assistance.
          </p>
          <div className="flex gap-4 justify-center mb-16 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 transition-all hover:shadow-lg">
                <Sparkles className="w-4 h-4" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="transition-all hover:bg-accent bg-transparent">
                Login to Your Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 border border-primary/20 backdrop-blur-sm">
            <div className="text-center text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your personalized study dashboard awaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-4 text-center">Powerful Features</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Everything you need for effective learning in one platform
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "AI Study Guide Generator",
              description:
                "Generate comprehensive study guides instantly by selecting a topic and subject. Our AI creates tailored learning materials for you.",
              delay: "duration-300",
            },
            {
              icon: BookOpen,
              title: "Study Materials & Quizzes",
              description:
                "Access organized study materials and interactive quizzes for each subject. Test your knowledge and improve retention.",
              delay: "duration-500",
            },
            {
              icon: BarChart3,
              title: "Progress Dashboard",
              description:
                "Track your learning progress with personalized analytics, quiz scores, and study time insights.",
              delay: "duration-700",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDuration: feature.delay }}
            >
              <CardHeader>
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose StudyAI?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Target,
              title: "Personalized Learning",
              description: "AI adapts to your learning pace and style",
            },
            {
              icon: Lightbulb,
              title: "Smart Insights",
              description: "Get detailed analytics on your progress and areas to improve",
            },
            {
              icon: Sparkles,
              title: "Advanced AI",
              description: "Powered by cutting-edge artificial intelligence technology",
            },
            {
              icon: BarChart3,
              title: "Track Progress",
              description: "Visualize your learning journey with comprehensive metrics",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
            >
              <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of students using StudyAI to learn smarter and achieve their goals.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Start Learning Today
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background/50">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 StudyAI. All rights reserved. Your learning, powered by AI.</p>
        </div>
      </footer>
    </main>
  )
}
