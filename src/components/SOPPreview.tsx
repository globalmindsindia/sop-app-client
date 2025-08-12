import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Eye, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const SOPPreview = ({ data }) => {
  const generateSOPContent = () => {
    let content = '';

    if (data.personalName && data.program) {
      content += `## Statement of Purpose\n\n`;
      content += `"Innovation distinguishes between a leader and a follower," as Steve Jobs once remarked, and this philosophy has guided my academic journey in pursuing excellence in my chosen field. From my earliest encounters with complex problem-solving to my current pursuit of advanced knowledge, I have consistently demonstrated a passion for understanding the fundamental principles that drive technological advancement.\n\n`;
    }

    if (data.highestDegree && data.major) {
      content += `### Educational Foundation\n\n`;
      content += `Through my ${data.highestDegree} in ${data.major}`;
      if (data.university) content += ` from ${data.university}`;
      if (data.gpa) content += `, where I maintained a ${data.gpa} academic standing`;
      content += `, I have developed a comprehensive understanding of core principles and advanced concepts in my field of study.\n\n`;

      if (data.relevantCourses) {
        content += `My coursework has provided me with extensive knowledge in ${data.relevantCourses}, forming a solid foundation for graduate-level research and application.\n\n`;
      }
    }

    if (data.projects && data.projects.length > 0) {
      const validProjects = data.projects.filter(p => p.title || p.description);
      if (validProjects.length > 0) {
        content += `### Research & Development Experience\n\n`;
        validProjects.forEach(project => {
          if (project.title) content += `**${project.title}**: `;
          if (project.description) content += `${project.description}\n\n`;
        });
      }
    }

    if (data.workExperiences && data.workExperiences.length > 0) {
      const validExperiences = data.workExperiences.filter(exp => exp.company || exp.role);
      if (validExperiences.length > 0) {
        content += `### Industry Experience\n\n`;
        validExperiences.forEach(exp => {
          if (exp.role && exp.company) {
            content += `In my capacity as ${exp.role} at ${exp.company}`;
            if (exp.description) content += `, ${exp.description}`;
            content += `, I have gained valuable insights that reinforce my commitment to pursuing advanced studies at your distinguished institution.\n\n`;

            if (exp.projects) {
              content += `Notable accomplishments include: ${exp.projects}\n\n`;
            }
          }
        });
      }
    }

    if (data.university && data.program) {
      content += `### Academic Alignment with ${data.university}\n\n`;
      content += `The ${data.program} program at ${data.university} offers an exceptional platform for realizing my professional aspirations in leadership and innovation. The institution's distinguished faculty, cutting-edge research facilities, and collaborative industry partnerships create an ideal environment for academic growth and professional development.\n\n`;
    }

    if (data.longTermGoal || data.customGoal) {
      content += `### Professional Vision\n\n`;
      const goal = data.customGoal || data.longTermGoal;
      content += `My ultimate objective is to ${goal}. This graduate program will equip me with the specialized knowledge and practical expertise essential for transforming this vision into reality.\n\n`;
    }

    if (data.organizations || data.communityService || data.hobbies || data.awards) {
      content += `### Holistic Development\n\n`;
      if (data.organizations) content += `Professional Affiliations: ${data.organizations}\n\n`;
      if (data.communityService) content += `Social Impact: ${data.communityService}\n\n`;
      if (data.hobbies) content += `Personal Pursuits: ${data.hobbies}\n\n`;
      if (data.awards) content += `Recognition & Honors: ${data.awards}\n\n`;
    }

    content += `### Forward Vision\n\n`;
    content += `My comprehensive academic preparation, hands-on professional experience, and unwavering dedication to innovation position me as an ideal candidate for this program. I am enthusiastic about joining the distinguished academic community at ${data.university || 'your prestigious institution'} and confident that this educational journey will be pivotal in achieving my professional milestones.\n\n`;

    return content;
  };

  const [showCostModal, setShowCostModal] = useState(false);
  const sopContent = generateSOPContent();
  const wordCount = sopContent.split(' ').length;

  const downloadSOP = () => {
    try {
      const doc = new jsPDF();
      doc.setProperties({
        title: `SOP_${data.personalName || 'Student'}_${data.university || 'University'}`,
        subject: 'Statement of Purpose',
        author: data.personalName || 'Student'
      });
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(sopContent, 180);
      doc.text(lines, 15, 20);
      doc.setFontSize(16);
      doc.text('STATEMENT OF PURPOSE', 105, 15, { align: 'center' });
      doc.save(`SOP_${data.personalName || 'Student'}_${data.university || 'University'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Extract 2 lines
  const sopSentences = sopContent.split(/(?<=\.\s)/); // split after full stops
  const visibleLines = sopSentences.slice(0, 2).join('');
  const blurredLines = sopSentences.slice(2).join('');

  return (
    <>
      {showCostModal && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">Download Statement of Purpose</h2>
          <p className="text-gray-700 text-center max-w-md text-lg mb-6">
            Your customized SOP is ready to download. To proceed, please note that this download will cost <strong>₹99</strong>.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => {
                downloadSOP();
                setShowCostModal(false);
              }}
              className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yes, Proceed to Download
            </button>
            <button
              onClick={() => setShowCostModal(false)}
              className="w-full py-3 text-lg bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Your Statement of Purpose
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total words: <strong>{wordCount}</strong></span>
                <span>Document type: Professional</span>
                <span>Status: <span className="text-green-600 font-medium">Complete</span></span>
              </div>
              <Button 
                onClick={() => setShowCostModal(true)}
                className="gradient-primary text-white"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SOP
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              <div>{visibleLines}</div>
              <div className="blur-sm text-gray-600 pointer-events-none select-none">
                {blurredLines}
              </div>
            </div>
          </CardContent>
        </Card>

        {sopContent && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">SOP generated successfully!</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Your customized statement of purpose has been crafted. Download it in your preferred format.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SOPPreview;
