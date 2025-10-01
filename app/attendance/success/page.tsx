"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import type { Student, Course } from "@/lib/types"

export default function AttendanceSuccessPage() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const studentData = sessionStorage.getItem("attendanceStudent")
    const courseData = sessionStorage.getItem("attendanceCourse")

    if (!studentData || !courseData) {
      router.push("/attendance")
      return
    }

    setStudent(JSON.parse(studentData))
    setCourse(JSON.parse(courseData))

    const now = new Date()
    setCurrentTime(
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    )

    sessionStorage.removeItem("attendanceStudent")
    sessionStorage.removeItem("attendanceCourse")
    sessionStorage.removeItem("selectedCourseId")
  }, [router])

  if (!student || !course) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/30 rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-card via-purple-50/30 to-cyan-50/20 dark:from-card dark:via-purple-950/20 dark:to-cyan-950/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-300/5 to-cyan-300/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-cyan-400/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full p-8 border-2 border-purple-400/30">
                <CheckCircle2 className="w-16 h-16 text-purple-500 dark:text-purple-400" strokeWidth={2.5} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Successful!
              </h2>
              <p className="text-base text-muted-foreground font-medium">ID Confirmed. You may Enter.</p>
            </div>

            {/* Student photo */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-950 dark:to-cyan-950 overflow-hidden border-4 border-purple-400/30 shadow-xl">
              {student.face_encoding ? (
                <img
                  src={student.face_encoding || "/placeholder.svg"}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                  {student.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Student name with gradient */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {student.name}
            </h3>

            <div className="w-full grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-purple-950/30 dark:to-cyan-950/30 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Student ID:</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{student.admission_number}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Enter:</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{currentTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Course:</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{course.code}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Exit:</p>
                <p className="text-sm font-bold text-muted-foreground">--:-- PM</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 pt-4">
              <Button
                onClick={() => router.push("/attendance")}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-xl h-12 shadow-lg"
              >
                Mark Another Attendance
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="lg"
                className="w-full rounded-xl h-12 bg-transparent border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              >
                Back to Home
              </Button>
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground text-center pt-4">
              Copyright © 2021 OneClick IT Consultancy. All Rights Reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
