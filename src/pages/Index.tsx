
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Star, Users, FileText, Download, Clock, PenTool, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarRating from '@/components/SOPRatingDisplay'; // Adjust the path as per your structure

const Index = () => {
  const navigate = useNavigate();

  const features = [
    
    "Standard Format", 
    "Quality Assured",
    "Download as PDF"
  ];

  const testimonials = [
    {
      name: "Akash Singh",
      degree: "Masters in Applied Data Science",
      country: "USA",
      text: "I love the way this tool takes your information and generates a personalized SOP. It made the process so much easier and helped me create an essay that really stood out."
    },
    {
      name: "Prakriti Arora", 
      degree: "Masters in Public Policy",
      country: "UK",
      text: "I'm so grateful for this tool. It saved me so much time and effort in the SOP writing process. I was able to create a really polished SOP in just 30 minutes."
    },
    {
      name: "Kunal Tiwari",
      degree: "Masters in Computer Science", 
      country: "Canada",
      text: "Totally worth the cost. I just inputted my information and let it do the rest, and the result was a polished, professional SOP."
    }
  ];

  const sopFormat = [
    {
      title: "1. Introduction",
      description: "Engage readers with a captivating opening that clearly states your purpose and long-term goals.",
      icon: BookOpen
    },
    {
      title: "2. Academic History", 
      description: "Showcase your educational journey, major, achievements, and relevant projects to demonstrate your academic readiness.",
      icon: Award
    },
    {
      title: "3. Work Experience",
      description: "Highlight your professional growth, roles, responsibilities, and projects to underline your practical knowledge and skills.",
      icon: Users
    },
    {
      title: "4. Extra-curricular Activities and Achievements",
      description: "Share your involvements, such as organizations, awards, community service, and hobbies, to showcase your well-roundedness and unique contributions.",
      icon: Star
    },
    {
      title: "5. University Fit",
      description: "Illustrate why the program and university perfectly align with your academic interests, career goals, and personal values.",
      icon: CheckCircle
    },
    {
      title: "6. Conclusion",
      description: "Summarize your interest, highlight the value you bring, and explain how the program will contribute to your long-term aspirations.",
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left side - Content with blue gradient background */}
          <div className="relative bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 px-8 py-16 flex flex-col justify-center">
            {/* Abstract background shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
              <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 right-10 w-20 h-20 bg-white/20 rounded-full blur-md"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </div>


            <div className="relative z-10 max-w-lg space-y-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <img
                    src="/public/final-logo-03.jpg"
                    alt="Global Minds Logo"
                    className="w-80 h-100 object-contain"
                  />  
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-white/90 text-lg mb-4">Professional Statement of Purpose Writing</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                 Craft Your Perfect Statement of Purpose
                </h1>
                <div className="w-12 h-1 bg-white mb-6"></div>
                <p className="text-white/80 leading-relaxed">
                  Transform your academic and professional journey into a compelling narrative that opens doors to your dream university.
                </p>
              </div>

   <div className="bg-light blue-900/60 rounded-xl px-4 py-3 w-fit mx-auto">
  <div className="flex flex-col items-center text-center">
    <div className="flex gap-1 mb-1">
      {[...Array(5)].map((_, i) => (
        
        <span key={i} className="text-white text-1xl">⭐</span>
      ))}
    </div>
    
    <p className="text-white/80 text-sm">Rated by 2000+ students</p>
    
  </div>
 
</div>


              
              {/* Features moved to left side */}
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                    {feature}
                  </Badge>
                ))}
              </div>

             
            </div>
          </div>

          {/* Right side - Graphics Design */}
          <div className="bg-gradient-to-br from-gray-50 to-white px-8 py-16 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Decorative geometric shapes */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-24 h-24 bg-blue-100 rotate-45 rounded-lg"></div>
              <div className="absolute top-40 right-16 w-16 h-16 bg-blue-200 rounded-full"></div>
              <div className="absolute bottom-40 left-12 w-32 h-32 bg-gradient-to-r from-blue-100 to-blue-200 rotate-12 rounded-xl"></div>
              <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-300 rotate-45"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-blue-500 rotate-45"></div>
             

            </div>

            {/* Central illustration */}
            <div className="relative z-10 text-center space-y-8">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-blue-200 rounded mx-auto"></div>
                      <div className="w-24 h-2 bg-blue-300 rounded mx-auto"></div>
                      <div className="w-28 h-2 bg-blue-200 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Create Your Perfect SOP</h3>
                <p className="text-gray-600 max-w-md">
                  Our platform helps you craft authentic and personalized statements of purpose that resonate with admissions committees.
                </p>

                 {/* Start Writing My SOP Button moved to left side */}
              <Button 
                size="lg" 
                className="w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/create')}
              >
                <PenTool className="w-5 h-5 mr-2" />
                Start Writing My SOP
              </Button>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-16 right-8 animate-float">
              <Award className="w-8 h-8 text-blue-500" />
            </div>
            <div className="absolute bottom-32 left-8 animate-float" style={{ animationDelay: '2s' }}>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute top-1/2 right-4 animate-float" style={{ animationDelay: '4s' }}>
              <Star className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </section>

      {/* SOP Format Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Professional SOP Structure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI follows the industry-standard format used by top universities worldwide, ensuring your SOP meets all academic requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sopFormat.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mb-6 mx-auto">
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 text-center">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{section.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/create')}
            >
              <PenTool className="w-5 h-5 mr-2" />
              Create My Professional SOP
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">Success Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-center">"{testimonial.text}"</p>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.degree}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Ready to Write Your Success Story?</h3>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students who have secured their dream university admissions with our AI-powered SOP generator.</p>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-blue-600 border-white hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg"
            onClick={() => navigate('/create')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
