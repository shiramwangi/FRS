"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { School, RegistrationData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const SCHOOLS: School[] = ["School of Computing Sciences", "Business", "Multimedia and Journalism", "Law"]

interface CourseWithCode {
  name: string
  code: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    admissionNumber: "",
    courses: [],
    school: "School of Computing Sciences",
  })
  const [currentCourse, setCurrentCourse] = useState("")
  const [currentCourseCode, setCurrentCourseCode] = useState("")

  const handleAddCourse = () => {
    if (currentCourse.trim() && currentCourseCode.trim()) {
      const courseWithCode = `${currentCourseCode.toUpperCase()} - ${currentCourse.trim()}`
      if (!formData.courses.includes(courseWithCode)) {
        setFormData((prev) => ({
          ...prev,
          courses: [...prev.courses, courseWithCode],
        }))
        setCurrentCourse("")
        setCurrentCourseCode("")
      }
    } else {
      toast({
        title: "Course details required",
        description: "Please enter both course code and name",
        variant: "destructive",
      })
    }
  }

  const handleRemoveCourse = (course: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c !== course),
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your name",
          variant: "destructive",
        })
        return
      }
      if (!formData.admissionNumber.trim()) {
        toast({
          title: "Admission number required",
          description: "Please enter your admission number",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (formData.courses.length === 0) {
        toast({
          title: "Courses required",
          description: "Please add at least one course",
          variant: "destructive",
        })
        return
      }
      setStep(3)
    } else if (step === 3) {
      sessionStorage.setItem("registrationData", JSON.stringify(formData))
      router.push("/register/face-capture")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/30 rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-card to-purple-50/30 dark:to-purple-950/20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-gradient-to-r from-purple-500 to-cyan-400"
                    : i < step
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-sm text-muted-foreground">Enter your basic information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adm">Admission Number</Label>
                  <Input
                    id="adm"
                    placeholder="ADM-12004"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, admissionNumber: e.target.value }))}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Courses */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Your Courses
                </h2>
                <p className="text-sm text-muted-foreground">Add the units you're taking this semester</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    placeholder="e.g., CS101"
                    value={currentCourseCode}
                    onChange={(e) => setCurrentCourseCode(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Unit Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="course"
                      placeholder="e.g., Data Structures"
                      value={currentCourse}
                      onChange={(e) => setCurrentCourse(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCourse()
                        }
                      }}
                      className="h-12 rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCourse}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {formData.courses.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Courses ({formData.courses.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.courses.map((course) => (
                        <Badge
                          key={course}
                          variant="secondary"
                          className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-950/50 dark:to-cyan-950/50"
                        >
                          {course}
                          <button
                            onClick={() => handleRemoveCourse(course)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: School Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Your School
                </h2>
                <p className="text-sm text-muted-foreground">Select your department</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School/Department</Label>
                  <Select
                    value={formData.school}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, school: value as School }))}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOLS.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-purple-950/30 dark:to-cyan-950/30 rounded-xl space-y-2 border border-primary/20">
                  <p className="text-sm font-medium">Registration Summary</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">Name:</span> {formData.name}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Adm:</span> {formData.admissionNumber}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Courses:</span> {formData.courses.length} units
                    </p>
                    <p>
                      <span className="font-medium text-foreground">School:</span> {formData.school}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl bg-transparent">
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
            >
              {step === 3 ? "Continue to Face Scan" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
