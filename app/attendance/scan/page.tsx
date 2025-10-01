"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaceScanner } from "@/components/face-scanner"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Student, Course } from "@/lib/types"

export default function AttendanceScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    loadCourse()
  }, [])

  const loadCourse = async () => {
    const courseId = sessionStorage.getItem("selectedCourseId")
    if (!courseId) {
      toast({
        title: "No course selected",
        description: "Please select a course first",
        variant: "destructive",
      })
      router.push("/attendance")
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("courses").select().eq("id", courseId).single()

      if (error) throw error

      setCourse(data)
    } catch (error) {
      console.error("[v0] Error loading course:", error)
      router.push("/attendance")
    }
  }

  const handleCapture = async (imageData: string) => {
    if (!course) return

    try {
      const supabase = getSupabaseBrowserClient()

      // In a real implementation, you would:
      // 1. Send the captured image to a face recognition API
      // 2. Compare face embeddings with stored faces in the database
      // 3. Find the matching student
      // For now, we'll simulate this by finding any student (demo purposes)

      const { data: students, error: studentsError } = await supabase.from("students").select("*").limit(1)

      if (studentsError) throw studentsError

      if (!students || students.length === 0) {
        toast({
          title: "No match found",
          description: "Face not recognized. Please register first.",
          variant: "destructive",
        })
        setIsScanning(false)
        return
      }

      const matchedStudent = students[0] as Student

      // Check if student is enrolled in this course
      const { data: enrollment } = await supabase
        .from("student_courses")
        .select()
        .eq("student_id", matchedStudent.id)
        .eq("course_id", course.id)
        .single()

      if (!enrollment) {
        toast({
          title: "Not enrolled",
          description: "You are not enrolled in this course",
          variant: "destructive",
        })
        setIsScanning(false)
        return
      }

      // Check if already marked present today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: existingAttendance } = await supabase
        .from("attendance")
        .select()
        .eq("student_id", matchedStudent.id)
        .eq("course_id", course.id)
        .gte("marked_at", today.toISOString())
        .single()

      if (existingAttendance) {
        toast({
          title: "Already marked",
          description: "You have already marked attendance for this course today",
        })
        setIsScanning(false)
        return
      }

      // Mark attendance
      const { error: attendanceError } = await supabase.from("attendance").insert({
        student_id: matchedStudent.id,
        course_id: course.id,
        status: "present",
      })

      if (attendanceError) throw attendanceError

      // Store data for success page
      sessionStorage.setItem("attendanceStudent", JSON.stringify(matchedStudent))
      sessionStorage.setItem("attendanceCourse", JSON.stringify(course))

      // Navigate to success page
      router.push("/attendance/success")
    } catch (error) {
      console.error("[v0] Attendance marking error:", error)
      toast({
        title: "Error marking attendance",
        description: "Please try again",
        variant: "destructive",
      })
      setIsScanning(false)
    }
  }

  const handleStartScan = () => {
    setIsScanning(true)
  }

  if (!course) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isScanning && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Face Recognition</h2>
              <p className="text-sm text-muted-foreground">
                Marking attendance for <span className="font-medium text-foreground">{course.name}</span>
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">Instructions:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Position your face in the frame</li>
                <li>Look directly at the camera</li>
                <li>Stay still during scanning</li>
              </ul>
            </div>

            <button
              onClick={handleStartScan}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-14 transition-colors"
            >
              Start Face Scan
            </button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Scanning...</h2>
              <p className="text-sm text-muted-foreground">Identifying your face</p>
            </div>

            <FaceScanner onCapture={handleCapture} isScanning={isScanning} />
          </div>
        )}
      </div>
    </div>
  )
}
