import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Share2, 
  QrCode, 
  Globe,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Users,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  Sparkles,
  Eye,
  Settings
} from 'lucide-react';
import { Screen } from '../App';

interface PortfolioGenerationProps {
  onNavigate: (screen: Screen) => void;
}

export function PortfolioGeneration({ onNavigate }: PortfolioGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const studentData = {
    name: 'John Smith',
    email: 'john.smith@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    github: 'github.com/johnsmith',
    degree: 'Bachelor of Science in Computer Science',
    university: 'Stanford University',
    gpa: '3.7/4.0',
    graduationYear: '2025',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const achievements = [
    {
      title: 'AWS Cloud Practitioner Certification',
      date: '2024',
      type: 'Technical',
      description: 'Demonstrated foundational knowledge of AWS cloud services and architecture'
    },
    {
      title: 'Hackathon Winner - TechFest 2024',
      date: '2024',
      type: 'Achievement',
      description: '1st place in university-wide hackathon with AI-powered healthcare solution'
    },
    {
      title: 'Community Service Leadership Award',
      date: '2024',
      type: 'Leadership',
      description: 'Led 50+ volunteers in local food drive initiative, serving 500+ families'
    },
    {
      title: 'Dean\'s List',
      date: '2023-2024',
      type: 'Academic',
      description: 'Maintained GPA above 3.5 for consecutive semesters'
    }
  ];

  const experiences = [
    {
      title: 'Software Engineering Intern',
      company: 'Tech Solutions Inc.',
      duration: 'Summer 2024',
      description: 'Developed React applications and contributed to microservices architecture'
    },
    {
      title: 'Research Assistant',
      company: 'AI Research Lab',
      duration: '2023-2024',
      description: 'Conducted research on machine learning applications in healthcare'
    }
  ];

  const projects = [
    {
      title: 'HealthCare AI Assistant',
      technologies: 'React, Python, TensorFlow',
      description: 'AI-powered chatbot for preliminary medical diagnosis and health recommendations'
    },
    {
      title: 'Student Activity Tracker',
      technologies: 'React Native, Firebase',
      description: 'Mobile app for tracking and managing student extracurricular activities'
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 3000);
  };

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'john-smith-portfolio.pdf';
    link.click();
  };

  const handleShare = () => {
    // Simulate sharing link generation
    navigator.clipboard.writeText('https://studenthub.edu/portfolio/john-smith-2024');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Portfolio Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
                  Generate Portfolio
                </CardTitle>
                <CardDescription>
                  Create a professional portfolio from your activities and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isGenerated ? (
                  <>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">What's included:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Personal information & contact</li>
                          <li>• Academic achievements</li>
                          <li>• Verified certificates</li>
                          <li>• Project showcase</li>
                          <li>• Professional experience</li>
                          <li>• QR code for verification</li>
                        </ul>
                      </div>

                      <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Portfolio
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-medium text-green-800">Portfolio Generated!</h4>
                      <p className="text-sm text-green-700">Your portfolio is ready to share</p>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>

                      <Button 
                        onClick={handleShare}
                        variant="outline"
                        className="w-full"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Copy Shareable Link
                      </Button>

                      <Button 
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview in New Tab
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Quick Stats:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="font-medium text-blue-600">{achievements.length}</p>
                          <p className="text-gray-600">Achievements</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="font-medium text-green-600">{experiences.length}</p>
                          <p className="text-gray-600">Experiences</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsGenerated(false)}
                      variant="ghost"
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Regenerate Portfolio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Portfolio Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span>Portfolio Preview</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Live Preview
                    </Badge>
                    <QrCode className="h-5 w-5" />
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  This is how your portfolio will appear to viewers
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {/* Portfolio Content */}
                <div className="bg-white">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                    <div className="flex items-start space-x-6">
                      <Avatar className="w-24 h-24 border-4 border-white">
                        <AvatarImage src={studentData.profileImage} />
                        <AvatarFallback className="text-2xl">JS</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{studentData.name}</h1>
                        <p className="text-xl text-blue-100 mb-4">{studentData.degree}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {studentData.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {studentData.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {studentData.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Class of {studentData.graduationYear}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="bg-white/20 rounded-lg p-4 mb-4">
                          <QrCode className="h-16 w-16 mx-auto mb-2" />
                          <p className="text-xs">Scan to verify</p>
                        </div>
                        <p className="text-sm">GPA: {studentData.gpa}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="p-8 space-y-8">
                    {/* Professional Links */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-blue-600" />
                        Professional Links
                      </h2>
                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Achievements Timeline */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-yellow-600" />
                        Achievements & Certifications
                      </h2>
                      <div className="space-y-4">
                        {achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                                <Badge variant="secondary">{achievement.type}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{achievement.date}</p>
                              <p className="text-sm text-gray-700">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {experiences.map((experience, index) => (
                          <div key={index} className="border-l-2 border-blue-600 pl-4">
                            <h3 className="font-medium text-gray-800">{experience.title}</h3>
                            <p className="text-sm text-blue-600 font-medium">{experience.company}</p>
                            <p className="text-sm text-gray-500 mb-2">{experience.duration}</p>
                            <p className="text-sm text-gray-700">{experience.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                        Featured Projects
                      </h2>
                      <div className="grid gap-4">
                        {projects.map((project, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-medium text-gray-800 mb-1">{project.title}</h3>
                            <p className="text-sm text-blue-600 mb-2">{project.technologies}</p>
                            <p className="text-sm text-gray-700">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <QrCode className="h-4 w-4" />
                        <span>Generated by Smart Student Hub</span>
                        <span>•</span>
                        <span>Verified Portfolio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}