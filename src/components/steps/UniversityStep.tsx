import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { StepProps } from '@/types/formData';

const UniversityStep: React.FC<StepProps> = ({ data, onUpdate, onValidationChange }) => {
  const [formData, setFormData] = useState({
    university: data.university || '',
    country: data.country || '',
    program: data.program || '',
    longTermGoal: data.longTermGoal || 'custom',
    customGoal: data.customGoal || '',
    universityQualities: data.universityQualities || [],
    personalName: data.personalName || '',
    email: data.email || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const longTermGoals = [
    'Secure an executive role within a leading organization in my field.',
    'Pursue academic excellence and mentor future generations of professionals.',
    'Pioneer innovative solutions addressing critical global challenges.',
    'Shape policies and practices that create meaningful societal impact.',
    'Launch a successful consulting practice or innovative startup venture.',
    'Complete doctoral studies and become a recognized thought leader.',
    'Contribute breakthrough research to prestigious academic publications and conferences.'
  ];

  const universityQualityOptions = [
    'Distinguished faculty, accomplished alumni, and state-of-the-art research infrastructure',
    'Exceptional academic curriculum and program structure',
    'Diverse elective courses and specialization opportunities',
    'Industry partnership and cooperative education programs',
    'Prestigious institutional reputation and global recognition',
    'Merit-based financial aid and scholarship programs',
    'Comprehensive international student support services',
    'Career development and professional placement assistance',
    'Vibrant student organizations aligned with my academic interests'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.university.trim()) newErrors.university = 'University name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.program.trim()) newErrors.program = 'Program is required';
    if (!formData.personalName.trim()) newErrors.personalName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (formData.longTermGoal === 'custom' && !formData.customGoal.trim()) {
      newErrors.customGoal = 'Please describe your career goals';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleQualityToggle = (quality: string) => {
    const updated = formData.universityQualities.includes(quality)
      ? formData.universityQualities.filter(q => q !== quality)
      : [...formData.universityQualities, quality];
    
    const newData = { ...formData, universityQualities: updated };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            📝 <strong>Getting Started:</strong> Begin your journey by providing essential details about your academic goals. 
            Complete all required fields before advancing to the next section.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="university" className="text-sm font-medium text-gray-700">
            Desired Institute / University *
          </Label>
          <Input
            id="university"
            placeholder="E.g., Stanford University"
            value={formData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
            className={`mt-1 ${errors.university ? 'border-black-500' : ''}`}
          />
          {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
        </div>

        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            Desired Country *
          </Label>
          <Input
            id="country"
            placeholder="Select your destination country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={`mt-1 ${errors.country ? 'border-black-500' : ''}`}
          />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="program" className="text-sm font-medium text-gray-700">
          Academic Program *
        </Label>
        <Input
          id="program"
          placeholder="E.g., Master of Science in Data Science"
          value={formData.program}
          onChange={(e) => handleInputChange('program', e.target.value)}
          className={`mt-1 ${errors.program ? 'border-black-500' : ''}`}
        />
        {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-4 block">
          Define your career aspirations upon program completion *
        </Label>
        
        <RadioGroup
          value={formData.longTermGoal}
          onValueChange={(value) => handleInputChange('longTermGoal', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-sm text-gray-700">
              Preferred: Craft your personalized career vision below.
            </Label>
          </div>
          
          {formData.longTermGoal === 'custom' && (
            <div>
              <Textarea
                placeholder="Describe your unique professional aspirations..."
                value={formData.customGoal}
                onChange={(e) => handleInputChange('customGoal', e.target.value)}
                className={`mt-2 ${errors.customGoal ? 'border-black-500' : ''}`}
                rows={3}
              />
              {errors.customGoal && <p className="text-red-500 text-xs mt-1">{errors.customGoal}</p>}
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4 mb-2">Alternative: Choose from predefined options</p>
          
          {longTermGoals.map((goal, index) => (
            <div key={index} className="flex items-start space-x-2">
              <RadioGroupItem value={goal} id={`goal-${index}`} className="mt-1" />
              <Label htmlFor={`goal-${index}`} className="text-sm text-gray-700 leading-relaxed">
                {goal}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-4 block">
          What attracts you most to this particular institution?
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          Preferred: Articulate your specific motivations for selecting this university.
        </p>
        
        <Textarea
          placeholder="Express your unique reasons for choosing this institution..."
          className="mb-4"
          rows={3}
        />
        
        <p className="text-sm text-gray-600 mb-4">Alternative: Select up to 5 factors from the options below</p>
        
        <div className="grid md:grid-cols-2 gap-3">
          {universityQualityOptions.map((quality, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`quality-${index}`}
                checked={formData.universityQualities.includes(quality)}
                onCheckedChange={() => handleQualityToggle(quality)}
              />
              <Label htmlFor={`quality-${index}`} className="text-sm text-gray-700">
                {quality}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.personalName}
            onChange={(e) => handleInputChange('personalName', e.target.value)}
            className={`mt-1 ${errors.personalName ? 'border-black-500' : ''}`}
          />
          {errors.personalName && <p className="text-red-500 text-xs mt-1">{errors.personalName}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
             Contact Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 ${errors.email ? 'border-black-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default UniversityStep;
