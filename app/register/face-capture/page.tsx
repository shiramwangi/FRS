"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FaceScanner } from "@/components/face-scanner"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { RegistrationData } from "@/lib/types"

export default function FaceCapturePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("registrationData")
    if (!data) {
      toast({
        title: "No registration data",
        description: "Please complete the registration form first",
        variant: "destructive",
      })
      router.push("/register")
      return
    }
    setRegistrationData(JSON.parse(data))
  }, [router, toast])

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData)

    if (!registrationData) return

    try {
      const supabase = getSupabaseBrowserClient()

      const { data: student, error: studentError } = await supabase
        .from("students")
        .insert({
          name: registrationData.name,
          admission_number: registrationData.admissionNumber,
          school: registrationData.school,
          face_encoding: imageData,
        })
        .select()
        .single()

      if (studentError) throw studentError

      for (const courseString of registrationData.courses) {
        // Parse "CODE - Name" format
        const [code, ...nameParts] = courseString.split(" - ")
        const courseName = nameParts.join(" - ")

        const { data: existingCourse } = await supabase.from("courses").select().eq("code", code.trim()).single()

        let courseId: string

        if (existingCourse) {
          courseId = existingCourse.id
        } else {
          const { data: newCourse, error: courseError } = await supabase
            .from("courses")
            .insert({
              name: courseName.trim(),
              code: code.trim(),
            })
            .select()
            .single()

          if (courseError) throw courseError
          courseId = newCourse.id
        }

        await supabase.from("student_courses").insert({
          student_id: student.id,
          course_id: courseId,
        })
      }

      sessionStorage.removeItem("registrationData")
      sessionStorage.setItem("newStudentId", student.id)
      router.push("/register/success")
    } catch (error) {
      console.error("[v0] Registration error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
      setIsScanning(false)
      setCapturedImage(null)
    }
  }

  const handleStartScan = () => {
    setIsScanning(true)
  }

  if (!registrationData) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
      <div className="w-full max-w-md">
        {!isScanning && !capturedImage && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Face Registration
              </h2>
              <p className="text-sm text-muted-foreground text-pretty">
                We need to capture your face to complete registration. This will be used for attendance marking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-purple-950/30 dark:to-cyan-950/30 rounded-xl p-4 space-y-2 border border-primary/20">
              <p className="text-sm font-medium">Tips for best results:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure good lighting</li>
                <li>Look directly at the camera</li>
                <li>Remove glasses if possible</li>
                <li>Keep a neutral expression</li>
              </ul>
            </div>

            <Button
              onClick={handleStartScan}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-xl h-14 shadow-lg"
            >
              Start Face Scan
            </Button>
          </div>
        )}

        {(isScanning || capturedImage) && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Scanning Your Face
              </h2>
              <p className="text-sm text-muted-foreground">Please look at the camera and stay still</p>
            </div>

            <FaceScanner onCapture={handleCapture} isScanning={isScanning} />
          </div>
        )}
      </div>
    </div>
  )
}
