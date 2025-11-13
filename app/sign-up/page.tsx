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
import { CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push(`/sign-up-success?email=${encodeURIComponent(email)}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordsMatch = password && repeatPassword && password === repeatPassword
  const passwordStrong = password.length >= 8
  const isFormValid = email && passwordsMatch && passwordStrong

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-background/90">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold">StudyAI</span>
          </Link>
          <p className="text-muted-foreground">Start your AI-powered learning journey</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up to get started with personalized study guides</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
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
                  {email && (
                    <p className="text-xs text-muted-foreground">A verification link will be sent to this email</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300 delay-100">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
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
                  {password && (
                    <div className="flex items-center gap-2">
                      {passwordStrong ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-xs ${passwordStrong ? "text-green-600" : "text-yellow-600"}`}>
                        {passwordStrong ? "Strong password" : "At least 8 characters required"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300 delay-200">
                  <Label htmlFor="repeat-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="transition-all focus:ring-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {repeatPassword && (
                    <div className="flex items-center gap-2">
                      {passwordsMatch ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                      </span>
                    </div>
                  )}
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
                  disabled={isLoading || !isFormValid}
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is secure and encrypted. We never share your information.
        </p>
      </div>
    </div>
  )
}
