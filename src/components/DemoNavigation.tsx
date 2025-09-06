import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  GraduationCap, 
  User, 
  BookOpen, 
  Shield, 
  Home,
  Award,
  FileImage,
  Eye,
  Settings,
  BarChart
} from 'lucide-react';
import { Screen, UserRole } from '../App';
import { DEMO_CREDENTIALS } from '../utils/supabase/client';

interface DemoNavigationProps {
  currentScreen: Screen;
  userRole: UserRole;
  onNavigate: (screen: Screen, role?: UserRole) => void;
}

export function DemoNavigation({ currentScreen, userRole, onNavigate }: DemoNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const demoCredentials = DEMO_CREDENTIALS.map(cred => ({
    ...cred,
    color: cred.role === 'student' ? 'from-blue-600 to-purple-600' :
           cred.role === 'faculty' ? 'from-green-600 to-teal-600' :
           'from-purple-600 to-pink-600',
    icon: cred.role === 'student' ? User :
          cred.role === 'faculty' ? BookOpen : Shield
  }));

  const studentScreens = [
    { screen: 'dashboard' as Screen, label: 'Dashboard', icon: Home },
    { screen: 'certificates' as Screen, label: 'Certificates', icon: Award },
    { screen: 'portfolio' as Screen, label: 'Portfolio', icon: FileImage }
  ];

  const facultyScreens = [
    { screen: 'faculty' as Screen, label: 'Faculty Dashboard', icon: Eye }
  ];

  const adminScreens = [
    { screen: 'admin' as Screen, label: 'Admin Dashboard', icon: BarChart }
  ];

  const getScreensForRole = (role: UserRole) => {
    switch (role) {
      case 'student': return studentScreens;
      case 'faculty': return facultyScreens;
      case 'admin': return adminScreens;
      default: return studentScreens;
    }
  };

  const getCurrentUser = () => {
    return demoCredentials.find(cred => cred.role === userRole);
  };

  const currentUser = getCurrentUser();

  return (
    <>
      {/* Demo Toggle Button - Always visible in top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          Demo Navigation
        </Button>
      </div>

      {/* Demo Navigation Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Navigation Panel */}
          <div className="fixed top-16 right-4 z-50 w-80">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Smart Student Hub Demo
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Switch between roles and screens to explore all features
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current User */}
                {currentUser && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Current User:</p>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${currentUser.color} text-white`}>
                      <div className="flex items-center space-x-2">
                        <currentUser.icon className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-sm">{currentUser.name}</p>
                          <p className="text-xs opacity-90">{currentUser.email}</p>
                          <Badge variant="secondary" className="mt-1 text-xs bg-white/20 text-white">
                            {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Demo Credentials */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Switch Role:</p>
                  <div className="space-y-2">
                    {demoCredentials.map((cred) => (
                      <Button
                        key={cred.role}
                        onClick={() => {
                          // Create mock session for role switching
                          const mockSession = {
                            access_token: 'demo-token-' + Date.now(),
                            user: {
                              id: 'demo-' + cred.role,
                              email: cred.email,
                              user_metadata: cred
                            }
                          };

                          // Store demo session
                          localStorage.setItem('supabase_session', JSON.stringify(mockSession));
                          localStorage.setItem('user_data', JSON.stringify({
                            id: mockSession.user.id,
                            email: cred.email,
                            name: cred.name,
                            role: cred.role,
                            department: cred.department,
                            student_id: cred.student_id,
                            profile_complete: true
                          }));

                          if (cred.role === 'student') {
                            onNavigate('dashboard', cred.role);
                          } else if (cred.role === 'faculty') {
                            onNavigate('faculty', cred.role);
                          } else {
                            onNavigate('admin', cred.role);
                          }
                        }}
                        variant={userRole === cred.role ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto p-3"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <cred.icon className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-sm">{cred.name}</p>
                            <p className="text-xs opacity-70">{cred.email}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Screen Navigation */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Navigate ({userRole.charAt(0).toUpperCase() + userRole.slice(1)} Screens):
                  </p>
                  <div className="space-y-1">
                    {getScreensForRole(userRole).map((screenInfo) => (
                      <Button
                        key={screenInfo.screen}
                        onClick={() => onNavigate(screenInfo.screen)}
                        variant={currentScreen === screenInfo.screen ? "default" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                      >
                        <screenInfo.icon className="w-4 h-4 mr-2" />
                        {screenInfo.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Demo Instructions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Demo Credentials:</p>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Email:</span> demo.[role]@university.edu
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Password:</span> demo123
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Or use the role switching buttons above for instant navigation
                    </p>
                  </div>
                </div>

                {/* Back to Login */}
                <Button
                  onClick={() => onNavigate('login')}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Back to Login Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}