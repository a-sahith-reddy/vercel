"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

type VerificationStatus = "loading" | "success" | "error"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [email, setEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const supabase = createClient()

        const error = searchParams.get("error")
        if (error) {
          setStatus("error")
          setErrorMessage(
            error === "access_denied" ? "Email verification was denied" : "An error occurred during verification",
          )
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setEmail(user.email || "")
          setStatus("success")
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("Failed to verify your email. Please try again.")
      }
    }

    handleVerification()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-background/90">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
                <CardDescription>Please wait while we confirm your email address...</CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-in fade-in zoom-in duration-500" />
                <CardTitle className="text-2xl">Email Verified Successfully!</CardTitle>
                <CardDescription>Your account is now active and ready to use</CardDescription>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Verification Failed</CardTitle>
                <CardDescription>{errorMessage}</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {status === "success" && (
              <>
                <div className="bg-accent/50 rounded-lg p-4 text-left">
                  <p className="text-sm text-muted-foreground mb-1">Verified Email</p>
                  <p className="font-semibold text-lg break-all">{email}</p>
                </div>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard in 2 seconds...</p>
              </>
            )}

            {status === "error" && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  There was an issue verifying your email. Please try the following:
                </p>
                <ul className="text-sm text-left text-muted-foreground space-y-2 mb-6">
                  <li>• Check your internet connection</li>
                  <li>• Try signing up again</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </>
            )}

            {status !== "loading" && (
              <div className="flex gap-2">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full" variant={status === "success" ? "default" : "outline"}>
                    Go to Dashboard
                  </Button>
                </Link>
                {status === "error" && (
                  <Link href="/sign-up" className="flex-1">
                    <Button className="w-full bg-transparent" variant="outline">
                      Sign Up Again
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
