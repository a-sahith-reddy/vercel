"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Mail, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SignUpSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-background/90">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pt-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-in zoom-in bounce duration-500" />
            <CardTitle className="text-3xl">Check Your Email</CardTitle>
            <CardDescription className="text-base mt-2">We&apos;ve sent you a verification link</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {email && (
              <div className="bg-accent/50 rounded-lg p-4 border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email sent to</p>
                </div>
                <p className="font-semibold text-lg break-all mb-3">{email}</p>
                <button onClick={handleCopyEmail} className="text-xs text-primary hover:underline transition-all">
                  {copied ? "✓ Copied!" : "Copy email"}
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">What to do next:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    1
                  </span>
                  <span>Check your inbox and spam folder</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    2
                  </span>
                  <span>Click the verification link in the email</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    3
                  </span>
                  <span>You&apos;ll be redirected to start learning</span>
                </li>
              </ol>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                The verification link will expire in 24 hours. If you don&apos;t receive an email, check your spam
                folder or try signing up again.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full gap-2">
                  Home
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-center text-xs text-muted-foreground">
              Need help? Contact our support team at support@studyai.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
