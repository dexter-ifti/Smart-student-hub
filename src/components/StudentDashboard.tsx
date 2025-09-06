import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Bell, 
  Upload, 
  FileText, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Trophy, 
  Star,
  Calendar,
  Target,
  Zap,
  Medal,
  Users,
  Briefcase
} from 'lucide-react';
import { Screen } from '../App';

interface StudentDashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const academicData = {
    currentGPA: 3.7,
    targetGPA: 4.0,
    completedCredits: 85,
    totalCredits: 120,
    semesterProgress: 75
  };

  const achievements = [
    { name: 'Academic Excellence', icon: Trophy, color: 'bg-yellow-500', earned: true },
    { name: 'Sports Champion', icon: Medal, color: 'bg-blue-500', earned: true },
    { name: 'Community Service', icon: Users, color: 'bg-green-500', earned: true },
    { name: 'Leadership', icon: Star, color: 'bg-purple-500', earned: false },
    { name: 'Research Scholar', icon: BookOpen, color: 'bg-red-500', earned: true },
    { name: 'Innovation Award', icon: Zap, color: 'bg-orange-500', earned: false }
  ];

  const recentActivities = [
    { title: 'Submitted Research Paper', type: 'Academic', date: '2 days ago', status: 'pending' },
    { title: 'Volunteered at Food Drive', type: 'Service', date: '1 week ago', status: 'verified' },
    { title: 'Won Hackathon Competition', type: 'Achievement', date: '2 weeks ago', status: 'verified' },
    { title: 'Internship Certificate', type: 'Professional', date: '1 month ago', status: 'verified' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">Smart Student Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </Button>
              
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              
              <div className="text-sm">
                <p className="font-medium text-gray-700">John Smith</p>
                <p className="text-gray-500">Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, John! 👋
          </h2>
          <p className="text-gray-600">
            Ready to build your future? Here's your progress overview.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => onNavigate('certificates')}
            className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="h-6 w-6" />
            <span>Upload Certificate</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('portfolio')}
            className="h-20 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 flex flex-col items-center justify-center space-y-2"
          >
            <FileText className="h-6 w-6" />
            <span>Generate Portfolio</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 border-2 border-purple-200 hover:bg-purple-50 flex flex-col items-center justify-center space-y-2"
          >
            <Calendar className="h-6 w-6 text-purple-600" />
            <span className="text-purple-600">View Calendar</span>
          </Button>

          <Button 
            variant="outline"
            className="h-20 border-2 border-orange-200 hover:bg-orange-50 flex flex-col items-center justify-center space-y-2"
          >
            <Target className="h-6 w-6 text-orange-600" />
            <span className="text-orange-600">Set Goals</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Progress */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Academic Progress
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Keep up the great work!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold">{academicData.currentGPA}</p>
                    <p className="text-sm text-blue-100">Current GPA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl">{academicData.completedCredits}/{academicData.totalCredits}</p>
                    <p className="text-sm text-blue-100">Credits Completed</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Semester Progress</span>
                    <span>{academicData.semesterProgress}%</span>
                  </div>
                  <Progress value={academicData.semesterProgress} className="bg-blue-400/30" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Degree Progress</span>
                    <span>{Math.round((academicData.completedCredits / academicData.totalCredits) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(academicData.completedCredits / academicData.totalCredits) * 100} 
                    className="bg-purple-400/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-blue-600" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Your latest submissions and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.type} • {activity.date}</p>
                      </div>
                      <Badge 
                        variant={activity.status === 'verified' ? 'default' : 'secondary'}
                        className={
                          activity.status === 'verified' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }
                      >
                        {activity.status === 'verified' ? '✅ Verified' : '⏳ Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Achievements & Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {achievements.filter(a => a.earned).length} of {achievements.length} earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ${
                          achievement.earned 
                            ? 'bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg' 
                            : 'bg-gray-100 opacity-60'
                        }`}
                      >
                        <div className={`w-10 h-10 ${achievement.color} rounded-full mx-auto mb-2 flex items-center justify-center ${
                          !achievement.earned && 'grayscale'
                        }`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                        {achievement.earned && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Internships & Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-green-600" />
                  Professional Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">Summer Internship</h4>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <p className="text-sm text-green-700">Tech Solutions Inc.</p>
                  <Progress value={60} className="mt-2" />
                  <p className="text-xs text-green-600 mt-1">60% Complete</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Research Project</h4>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <p className="text-sm text-blue-700">AI in Healthcare</p>
                  <Progress value={85} className="mt-2" />
                  <p className="text-xs text-blue-600 mt-1">Final Review</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
            <CardContent className="py-8">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <blockquote className="text-xl font-medium text-purple-800 mb-2">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </blockquote>
              <p className="text-purple-600">— Winston Churchill</p>
              <p className="text-sm text-purple-500 mt-4">Keep building your future 🚀</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}