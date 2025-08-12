
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const WorkExperienceStep = ({ data, onUpdate, onValidationChange }) => {
  const [formData, setFormData] = useState({
    workExperiences: data.workExperiences || [
      {
        company: '',
        role: '',
        description: '',
        projects: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validate each work experience entry
    formData.workExperiences.forEach((experience, index) => {
      if (!experience.company.trim()) {
        newErrors[`company-${index}`] = 'Company name is required';
      }
      if (!experience.role.trim()) {
        newErrors[`role-${index}`] = 'Professional role is required';
      }
      if (!experience.description.trim()) {
        newErrors[`description-${index}`] = 'Organization overview is required';
      }
      //if (!experience.projects.trim()) {
        //newErrors[`projects-${index}`] = 'Key accomplishments are required';
      //}
    });
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...formData.workExperiences];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    const updated = { ...formData, workExperiences: updatedExperiences };
    setFormData(updated);
    onUpdate(updated);
  };

  const addExperience = () => {
    const updated = {
      ...formData,
      workExperiences: [
        ...formData.workExperiences,
        { company: '', role: '', description: '', projects: '' }
      ]
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const removeExperience = (index) => {
    if (formData.workExperiences.length > 1) {
      const updatedExperiences = formData.workExperiences.filter((_, i) => i !== index);
      const updated = { ...formData, workExperiences: updatedExperiences };
      setFormData(updated);
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            💼 <strong>Professional Journey:</strong> Document your career progression and industry experience. 
            All fields are required to showcase your professional background effectively.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Professional Experience</h3>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={addExperience}
          className="flex items-center text-black"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {formData.workExperiences.map((experience, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-md font-medium text-gray-700">Professional Role {index + 1}</h4>
              {formData.workExperiences.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Organization / Company name *
                </Label>
                <Input
                  placeholder="E.g., Microsoft Corporation"
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className={`mt-1 ${errors[`company-${index}`] ? 'border-black-500' : ''}`}
                />
                {errors[`company-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`company-${index}`]}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Organizational Overview *
                </Label>
                <Textarea
                  placeholder="E.g., Global technology leader specializing in cloud computing and enterprise software solutions"
                  value={experience.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  className={`mt-1 ${errors[`description-${index}`] ? 'border-black-500' : ''}`}
                  rows={2}
                />
                {errors[`description-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`description-${index}`]}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Designation *
                </Label>
                <Input
                  placeholder="E.g., Senior Data Scientist"
                  value={experience.role}
                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  className={`mt-1 ${errors[`role-${index}`] ? 'border-black-500' : ''}`}
                />
                {errors[`role-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`role-${index}`]}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Accomplishments 
                </Label>
                <Textarea
                  placeholder="E.g., Developed machine learning algorithms that improved prediction accuracy by 25%..."
                  value={experience.projects}
                  onChange={(e) => handleExperienceChange(index, 'projects', e.target.value)}
                  className={`mt-1 ${errors[`projects-${index}`] ? 'border-black-500' : ''}`}
                  rows={4}
                />
                {errors[`projects-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`projects-${index}`]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            💡 <strong>Professional Impact:</strong> Emphasize measurable achievements and specific skills gained 
            that demonstrate your readiness for advanced academic study and research.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkExperienceStep;
