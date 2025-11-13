"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-background/90">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold">StudyAI</span>
          </Link>
          <p className="text-muted-foreground">Welcome back to your learning platform</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your study guides</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-5">
                {/* Email Input */}
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all focus:ring-2"
                  />
                </div>

                {/* Password Input */}
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300 delay-100">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="transition-all focus:ring-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 flex gap-2 items-start animate-in fade-in duration-300">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-2 transition-all duration-300"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-primary font-semibold hover:underline">
                  Sign up here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <p className="text-center text-xs text-muted-foreground mt-6">Your login is secure and encrypted.</p>
      </div>
    </div>
  )
}
