export type School = "School of Computing Sciences" | "Business" | "Multimedia and Journalism" | "Law"

export interface Student {
  id: string
  name: string
  admission_number: string
  school: School
  face_encoding: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  code: string
  created_at: string
}

export interface StudentCourse {
  id: string
  student_id: string
  course_id: string
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  course_id: string
  marked_at: string
  status: "present" | "absent"
}

export interface RegistrationData {
  name: string
  admissionNumber: string
  courses: string[]
  school: School
}
