import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { StepProps } from '@/types/formData';

const AcademicsStep: React.FC<StepProps> = ({ data, onUpdate, onValidationChange }) => {
  const [formData, setFormData] = useState({
    highestDegree: data.highestDegree || '',
    major: data.major || '',
    gpa: data.gpa || '',
    academicUniversity: data.academicUniversity || '',
    relevantCourses: data.relevantCourses || '',
    projects: data.projects || [{ title: '', description: '' }],
    academicAchievements: data.academicAchievements || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
     if (!formData.highestDegree.trim()) newErrors.highestDegree = 'Academic qualification is required';
     if (!formData.major.trim()) newErrors.major = 'Academic concentration is required';
     if (!formData.gpa.trim()) newErrors.gpa = 'Academic performance is required';
     if (!formData.academicUniversity.trim()) newErrors.academicUniversity = 'Academic institution is required';
   // if (!formData.relevantCourses.trim()) newErrors.relevantCourses = 'Relevant coursework is required';
   // if (!formData.academicAchievements.trim()) newErrors.academicAchievements = 'Academic accomplishments are required';
    
    // Validate projects
    formData.projects.forEach((project, index) => {
      if (!project.title.trim()) {
        // newErrors[`projectTitle-${index}`] = 'Project title is required';
      }
      if (!project.description.trim()) {
        // newErrors[`projectDescription-${index}`] = 'Project description is required';
      }
    });
    
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

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    const updated = { ...formData, projects: updatedProjects };
    setFormData(updated);
    onUpdate(updated);
  };

  const addProject = () => {
    const updated = { 
      ...formData, 
      projects: [...formData.projects, { title: '', description: '' }] 
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      const updatedProjects = formData.projects.filter((_, i) => i !== index);
      const updated = { ...formData, projects: updatedProjects };
      setFormData(updated);
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-#291aef-800">
            📚 <strong>Academic Portfolio:</strong> Share your educational journey and achievements. 
            All fields are required to provide a comprehensive view of your academic foundation.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="degree" className="text-sm font-medium text-gray-700">
            Academic Qualification *
          </Label>
          <Input
            id="degree"
            placeholder="E.g., Bachelor of Science"
            value={formData.highestDegree}
            onChange={(e) => handleInputChange('highestDegree', e.target.value)}
            className={`mt-1 ${errors.highestDegree ? 'border-black-500' : ''}`}
          />
          {errors.highestDegree && <p className="text-red-500 text-xs mt-1">{errors.highestDegree}</p>}
        </div>

        <div>
          <Label htmlFor="major" className="text-sm font-medium text-gray-700">
            Academic Specialization *
          </Label>
          <Input
            id="major"
            placeholder="E.g., Electrical Engineering"
            value={formData.major}
            onChange={(e) => handleInputChange('major', e.target.value)}
            className={`mt-1 ${errors.major ? 'border-black-500' : ''}`}
          />
          {errors.major && <p className="text-red-500 text-xs mt-1">{errors.major}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="university" className="text-sm font-medium text-gray-700">
            Academic Institution Name *
          </Label>
          <Input
            id="university"
            placeholder="E.g., Massachusetts Institute of Technology"
            value={formData.academicUniversity}
            onChange={(e) => handleInputChange('academicUniversity', e.target.value)}
            className={`mt-1 ${errors.academicUniversity ? 'border-black-500' : ''}`}
          />
          {errors.academicUniversity && <p className="text-red-500 text-xs mt-1">{errors.academicUniversity}</p>}
        </div>

        <div>
          <Label htmlFor="gpa" className="text-sm font-medium text-gray-700">
            Academic Grade (CGPA/Percentage) *
          </Label>
          <Input
            id="gpa"
            placeholder="3.8"
            value={formData.gpa}
            onChange={(e) => handleInputChange('gpa', e.target.value)}
            className={`mt-1 ${errors.gpa ? 'border-black-500' : ''}`}
          />
          {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="courses" className="text-sm font-medium text-gray-700">
          Programming Languages (Academic) *
        </Label>
        <Textarea
          id="courses"
          placeholder="Highlight courses that directly relate to your intended field of study"
          value={formData.relevantCourses}
          onChange={(e) => handleInputChange('relevantCourses', e.target.value)}
          className={`mt-1 ${errors.relevantCourses ? 'border-red-500' : ''}`}
          rows={3}
        />
        {errors.relevantCourses && <p className="text-red-500 text-xs mt-1">{errors.relevantCourses}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium text-gray-700">Academic Projects & Research </Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={addProject}
            
            className="flex items-center text-black "
          >
            <div className="bg-white shadow-sm border-b"></div>
            <Plus className="w-4 h-4" />
            Include Project
          </Button>
        </div>

        {formData.projects.map((project, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-gray-700">Project {index + 1}</h4>
                {formData.projects.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="E.g., AI-powered sentiment analysis system for social media platforms"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    className={errors[`projectTitle-${index}`] ? 'border-red-500' : ''}
                  />
                  {errors[`projectTitle-${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`projectTitle-${index}`]}</p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Provide comprehensive details about the project scope, methodology, and outcomes..."
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    className={errors[`projectDescription-${index}`] ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {errors[`projectDescription-${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`projectDescription-${index}`]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">
          Academic Achievements 
        </Label>
        <Textarea
          id="achievements"
          placeholder="E.g., Magna Cum Laude distinction, departmental honors, research publications"
          value={formData.academicAchievements}
          onChange={(e) => handleInputChange('academicAchievements', e.target.value)}
          className={`mt-1 ${errors.academicAchievements ? 'border-red-500' : ''}`}
          rows={3}
        />
        {errors.academicAchievements && <p className="text-red-500 text-xs mt-1">{errors.academicAchievements}</p>}
      </div>
    </div>
  );
};

export default AcademicsStep;
