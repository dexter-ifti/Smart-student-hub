import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GraduationCap, Mail, Lock, User, BookOpen } from 'lucide-react';
import { Screen, UserRole } from '../App';
import { getSupabaseClient, isDemoCredentials } from '../utils/supabase/client';

interface LoginPageProps {
  onLogin: (screen: Screen, role?: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Get singleton Supabase client
  const supabase = getSupabaseClient();

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLogin = async (role: UserRole) => {
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if these are demo credentials
      const demoUser = isDemoCredentials(credentials.email, credentials.password);
      
      if (demoUser) {
        // Handle demo login without hitting Supabase
        if (demoUser.role !== role) {
          setError(`This demo account is for ${demoUser.role}s. Please select the correct role tab.`);
          setLoading(false);
          return;
        }

        // Create mock session for demo
        const mockSession = {
          access_token: 'demo-token-' + Date.now(),
          user: {
            id: 'demo-' + demoUser.role,
            email: demoUser.email,
            user_metadata: demoUser
          }
        };

        // Store demo session
        localStorage.setItem('supabase_session', JSON.stringify(mockSession));
        localStorage.setItem('user_data', JSON.stringify({
          id: mockSession.user.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          department: demoUser.department,
          student_id: demoUser.student_id,
          profile_complete: true
        }));

        // Navigate based on role
        if (role === 'student') {
          onLogin('dashboard', role);
        } else if (role === 'faculty') {
          onLogin('faculty', role);
        } else {
          onLogin('admin', role);
        }
        return;
      }

      // Regular Supabase authentication for non-demo users
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        // Provide better error message for demo users
        if (credentials.email.includes('demo.')) {
          setError('Demo users should be automatically created. Please try again or use the demo buttons below.');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
        setLoading(false);
        return;
      }

      if (!session?.access_token) {
        setError('Failed to establish session. Please try again.');
        setLoading(false);
        return;
      }

      // Import projectId for API calls
      const { projectId } = await import('../utils/supabase/info');

      // Fetch user profile from server
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0e3ff39/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile fetch error:', errorData);
        setError('Failed to load user profile. Please contact support.');
        setLoading(false);
        return;
      }

      const { user } = await response.json();

      // Verify user role matches the selected tab
      if (user.role !== role) {
        setError(`This account is not registered as a ${role}. Please select the correct role tab.`);
        setLoading(false);
        return;
      }

      // Store session in localStorage for persistence
      localStorage.setItem('supabase_session', JSON.stringify(session));
      localStorage.setItem('user_data', JSON.stringify(user));

      // Navigate based on role
      if (role === 'student') {
        onLogin('dashboard', role);
      } else if (role === 'faculty') {
        onLogin('faculty', role);
      } else {
        onLogin('admin', role);
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration and branding */}
        <div className="hidden lg:block">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="w-12 h-12 text-white mr-3" />
              <h1 className="text-4xl font-bold text-white">Smart Student Hub</h1>
            </div>
            <p className="text-xl text-white/80">
              Your centralized platform for academic excellence and portfolio building
            </p>
          </div>
          
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxhcHRvcHMlMjBib29rcyUyMHN0dWR5aW5nfGVufDF8fHx8MTc1Njk2NjU0OXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Students studying with laptops and books"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Right side - Login forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="backdrop-blur-lg bg-white/95 border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
                <CardTitle className="text-2xl text-blue-600">Smart Student Hub</CardTitle>
              </div>
              <CardTitle className="hidden lg:block text-2xl text-gray-800">Welcome Back</CardTitle>
              <CardDescription>Choose your role to continue</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="student" className="text-sm">Student</TabsTrigger>
                  <TabsTrigger value="faculty" className="text-sm">Faculty</TabsTrigger>
                  <TabsTrigger value="admin" className="text-sm">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="student" className="space-y-4 mt-6">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-email"
                        placeholder="student@university.edu"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin('student')}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleLogin('student')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Signing in...' : 'Sign in as Student'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => handleLogin('student')}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </Button>
                </TabsContent>

                <TabsContent value="faculty" className="space-y-4 mt-6">
                  {error && activeTab === 'faculty' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="faculty-email">Faculty Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="faculty-email"
                        placeholder="faculty@university.edu"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faculty-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="faculty-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin('faculty')}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleLogin('faculty')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <BookOpen className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Signing in...' : 'Sign in as Faculty'}
                  </Button>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4 mt-6">
                  {error && activeTab === 'admin' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-email"
                        placeholder="admin@university.edu"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={credentials.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin('admin')}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleLogin('admin')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <GraduationCap className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Signing in...' : 'Sign in as Admin'}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-4">
                {/* Demo Mode Section */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-sm text-blue-800 mb-2">🚀 Demo Mode</h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Try the platform instantly with these demo credentials:
                  </p>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setCredentials({ email: 'demo.student@university.edu', password: 'demo123' });
                        setActiveTab('student');
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start bg-white/50 hover:bg-white/80"
                    >
                      <User className="w-3 h-3 mr-2" />
                      <div className="text-left">
                        <div className="text-xs font-medium">Student Demo</div>
                        <div className="text-xs text-gray-500">demo.student@university.edu</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setCredentials({ email: 'demo.faculty@university.edu', password: 'demo123' });
                        setActiveTab('faculty');
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start bg-white/50 hover:bg-white/80"
                    >
                      <BookOpen className="w-3 h-3 mr-2" />
                      <div className="text-left">
                        <div className="text-xs font-medium">Faculty Demo</div>
                        <div className="text-xs text-gray-500">demo.faculty@university.edu</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setCredentials({ email: 'demo.admin@university.edu', password: 'demo123' });
                        setActiveTab('admin');
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start bg-white/50 hover:bg-white/80"
                    >
                      <GraduationCap className="w-3 h-3 mr-2" />
                      <div className="text-left">
                        <div className="text-xs font-medium">Admin Demo</div>
                        <div className="text-xs text-gray-500">demo.admin@university.edu</div>
                      </div>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-blue-600 mt-2 text-center">
                    Password for all demo accounts: <code className="bg-blue-100 px-1 rounded">demo123</code>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Need a real account?{' '}
                    <button className="text-blue-600 hover:underline font-medium">
                      Contact your institution
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}