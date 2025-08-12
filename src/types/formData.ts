
export interface FormData {
  // University Step
  university: string;
  country: string;
  program: string;
  longTermGoal: string;
  customGoal: string;
  universityQualities: string[];
  personalName: string;
  email: string;
  // Academics Step
  highestDegree: string;
  major: string;
  gpa: string;
  academicUniversity: string;
  relevantCourses: string;
  projects: Array<{ title: string; description: string }>;
  academicAchievements: string;
  // Work Experience Step
  workExperiences: Array<{ company: string; role: string; description: string; projects: string }>;
  // Extracurricular Step
  organizations: string;
  communityService: string;
  hobbies: string;
  awards: string;
}

export interface StepProps {
  data: FormData;
  onUpdate: (stepData: Partial<FormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}
