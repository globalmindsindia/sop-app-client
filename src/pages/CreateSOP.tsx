import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UniversityStep from '@/components/steps/UniversityStep';
import AcademicsStep from '@/components/steps/AcademicsStep';
import WorkExperienceStep from '@/components/steps/WorkExperienceStep';
import ExtracurricularStep from '@/components/steps/ExtracurricularStep';
import SOPPreview from '@/components/SOPPreview';
import { FormData } from '@/types/formData';


const CreateSOP = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [validationStates, setValidationStates] = useState({
    0: false, // University step requires validation
    1: false, // Academics step requires validation  
    2: false, // Work experience now mandatory
    3: false, // Extracurricular now mandatory
    4: true   // Preview is always valid
  });
  
  const [formData, setFormData] = useState<FormData>({
    // University Step
    university: '',
    country: '',
    program: '',
    longTermGoal: 'custom',
    customGoal: '',
    universityQualities: [],
    personalName: '',
    email: '',
    // Academics Step
    highestDegree: '',
    major: '',
    gpa: '',
    academicUniversity: '',
    relevantCourses: '',
    projects: [{ title: '', description: '' }],
    academicAchievements: '',
    // Work Experience Step
    workExperiences: [{ company: '', role: '', description: '', projects: '' }],
    // Extracurricular Step
    organizations: '',
    communityService: '',
    hobbies: '',
    awards: ''
  });

  const steps = [
    { title: 'Academic Profile', component: AcademicsStep },
    { title: 'Professional Background', component: WorkExperienceStep },
    { title: 'Personal Development', component: ExtracurricularStep },
    { title: 'Institution Selection', component: UniversityStep },
    { title: 'Final Review', component: SOPPreview }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleValidationChange = (stepIndex: number, isValid: boolean) => {
    setValidationStates(prev => ({
      ...prev,
      [stepIndex]: isValid
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && validationStates[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isCurrentStepValid = validationStates[currentStep];

  const handlePayment = () => {
  const options = {
    key: "rzp_test_YOUR_KEY_HERE", // 🔁 Replace with your Razorpay key
    amount: 9900, // Amount in paise (₹99.00)
    currency: "INR",
    name: "SOP Generator",
    description: "Download SOP after payment",
    handler: function (response: any) {
  alert("Payment Successful! Your SOP will now download.");
  downloadSOP(); 
   },
    prefill: {
      name: formData.personalName || "Student",
      email: formData.email || "student@example.com",
    },
    theme: {
      color: "#1E40AF",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

const downloadSOP = () => {
  const sopText = `
    Name: ${formData.personalName}
    Email: ${formData.email}
    Program: ${formData.program}
    University: ${formData.university}
    Long Term Goal: ${formData.customGoal || formData.longTermGoal}
    Academics: ${formData.highestDegree} in ${formData.major} from ${formData.academicUniversity}
    GPA: ${formData.gpa}
    Projects: ${formData.projects.map(p => `• ${p.title}: ${p.description}`).join('\n')}
    Work Experience: ${formData.workExperiences.map(w => `• ${w.role} at ${w.company}: ${w.description}`).join('\n')}
    Extracurricular: ${formData.organizations}, ${formData.communityService}, ${formData.hobbies}
    Awards: ${formData.awards}
  `;

  const blob = new Blob([sopText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "My_SOP.txt";
  a.click();
  URL.revokeObjectURL(url);
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 ">
          <div className="flex items-center justify-between ">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 "
            >
              <ArrowLeft className="w-4 h-4 mr-2 " />
              Return Home
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Statement of Purpose Builder</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

     

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block
                  ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-4 hidden sm:block
                    ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full bg-gray-200 [&>div]:bg-blue-600"/>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent 
              data={formData}
              onUpdate={updateFormData}
              onValidationChange={(isValid: boolean) => handleValidationChange(currentStep, isValid)}
            />
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <div className="flex flex-col items-end">
                  <Button 
                    onClick={handleNext}
                    disabled={!isCurrentStepValid}
                    className={`gradient-primary text-white flex items-center ${
                      !isCurrentStepValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {currentStep === 3 ? 'Finish' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {!isCurrentStepValid && (
                    <p className="text-red-500 text-xs mt-1">Please complete all required fields</p>
                  )}
                </div>
              ) : (
                <Button 
                    className="gradient-primary text-white"
                    onClick={handlePayment}
                    >
                    Full Preview
                    </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSOP;
