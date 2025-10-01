"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Student } from "@/lib/types"

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    const loadStudent = async () => {
      const studentId = sessionStorage.getItem("newStudentId")
      if (!studentId) {
        router.push("/register")
        return
      }

      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("students").select().eq("id", studentId).single()

      if (error || !data) {
        router.push("/register")
        return
      }

      setStudent(data)
      sessionStorage.removeItem("newStudentId")
    }

    loadStudent()
  }, [router])

  if (!student) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/30 rounded-3xl p-8 shadow-2xl bg-card">
          <div className="flex flex-col items-center space-y-6">
            {/* Success icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <CheckCircle2 className="relative w-20 h-20 text-primary" />
            </div>

            {/* Success message */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-primary">Registration Successful!</h2>
              <p className="text-sm text-muted-foreground text-pretty">
                Your face has been registered. You can now use facial recognition to mark attendance.
              </p>
            </div>

            {/* Student info */}
            <div className="w-full bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">Your Details</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">Name:</span> {student.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Admission:</span> {student.admission_number}
                </p>
                <p>
                  <span className="font-medium text-foreground">School:</span> {student.school}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => router.push("/attendance")}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-14"
            >
              Go to Attendance
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
