
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { StepProps } from '@/types/formData';

const ExtracurricularStep: React.FC<StepProps> = ({ data, onUpdate, onValidationChange }) => {
  const [formData, setFormData] = useState({
    organizations: data.organizations || '',
    communityService: data.communityService || '',
    hobbies: data.hobbies || '',
    awards: data.awards || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.organizations.trim()) {
      newErrors.organizations = 'Professional associations information is required';
    }
    if (!formData.communityService.trim()) {
      newErrors.communityService = 'Social impact activities are required';
    }
    if (!formData.hobbies.trim()) {
      newErrors.hobbies = 'Personal interests are required';
    }
    //if (!formData.awards.trim()) {
     // newErrors.awards = 'Recognition and achievements are required';
    //}
    
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

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            🏆 <strong>Beyond the Classroom:</strong> Showcase your multifaceted personality through activities, 
            leadership roles, and personal interests. All fields are required to demonstrate your comprehensive profile.
          </p>
        </CardContent>
      </Card>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Student Clubs / Organizations *
        </Label>
        <Textarea
          placeholder="E.g., IEEE Student Chapter President, Robotics Club founding member"
          value={formData.organizations}
          onChange={(e) => handleInputChange('organizations', e.target.value)}
          className={errors.organizations ? 'border-black-500' : ''}
          rows={4}
        />
        {errors.organizations && (
          <p className="text-red-500 text-xs mt-1">{errors.organizations}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Social Impact and Volunteer Engagement *
        </Label>
        <Textarea
          placeholder="E.g., Coordinated STEM education workshops for underserved communities"
          value={formData.communityService}
          onChange={(e) => handleInputChange('communityService', e.target.value)}
          className={errors.communityService ? 'border-black-500' : ''}
          rows={4}
        />
        {errors.communityService && (
          <p className="text-red-500 text-xs mt-1">{errors.communityService}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Personal Interests *
        </Label>
        <Textarea
          placeholder="E.g., Documentary photography exploring urban architecture"
          value={formData.hobbies}
          onChange={(e) => handleInputChange('hobbies', e.target.value)}
          className={errors.hobbies ? 'border-black-500' : ''}
          rows={3}
        />
        {errors.hobbies && (
          <p className="text-red-500 text-xs mt-1">{errors.hobbies}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
        Social Achievements 
        </Label>
        <Textarea
          placeholder="E.g., National Merit Scholar, International Science Fair gold medalist"
          value={formData.awards}
          onChange={(e) => handleInputChange('awards', e.target.value)}
          className={errors.awards ? 'border-black-500' : ''}
          rows={4}
        />
        {errors.awards && (
          <p className="text-red-500 text-xs mt-1">{errors.awards}</p>
        )}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <p className="text-sm text-green-800">
            ✨ <strong>Holistic Excellence:</strong> These diverse experiences demonstrate your ability to excel 
            across multiple domains while maintaining academic excellence - a quality highly valued by admissions committees.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtracurricularStep;
