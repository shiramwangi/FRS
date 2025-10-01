"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/lib/types"

export default function AttendancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("courses").select("*").order("name")

      if (error) throw error

      setCourses(data || [])
    } catch (error) {
      console.error("[v0] Error loading courses:", error)
      toast({
        title: "Error loading courses",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!selectedCourse) {
      toast({
        title: "Course required",
        description: "Please select a course to mark attendance",
        variant: "destructive",
      })
      return
    }

    sessionStorage.setItem("selectedCourseId", selectedCourse)
    router.push("/attendance/scan")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/30 rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-card to-purple-50/30 dark:to-purple-950/20">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Mark Attendance
              </h2>
              <p className="text-sm text-muted-foreground">Select your course to continue</p>
            </div>

            {/* Course selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course/Class</Label>
                {loading ? (
                  <div className="h-12 bg-muted animate-pulse rounded-xl" />
                ) : (
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger id="course" className="h-12 rounded-xl">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No courses available</div>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Info box */}
              <div className="bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-purple-950/30 dark:to-cyan-950/30 rounded-xl p-4 space-y-2 border border-primary/20">
                <p className="text-sm font-medium">Next Step</p>
                <p className="text-sm text-muted-foreground">
                  After selecting your course, you'll scan your face to mark your attendance for this class.
                </p>
              </div>
            </div>

            {/* Continue button */}
            <Button
              onClick={handleContinue}
              disabled={!selectedCourse || loading}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-xl h-14 shadow-lg disabled:opacity-50"
            >
              Continue to Face Scan
            </Button>

            {/* Back to home */}
            <div className="text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
