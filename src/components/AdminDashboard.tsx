import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  ArrowLeft,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  FileText,
  TrendingUp,
  Users,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Screen } from '../App';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState('6months');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock data for charts
  const activityDistribution = [
    { name: 'Technical Certifications', value: 35, color: '#3B82F6' },
    { name: 'Community Service', value: 25, color: '#10B981' },
    { name: 'Academic Achievements', value: 20, color: '#F59E0B' },
    { name: 'Sports & Cultural', value: 12, color: '#EF4444' },
    { name: 'Leadership', value: 8, color: '#8B5CF6' }
  ];

  const departmentParticipation = [
    { department: 'Computer Science', students: 245, activities: 892 },
    { department: 'Electrical Eng.', students: 180, activities: 654 },
    { department: 'Mechanical Eng.', students: 210, activities: 723 },
    { department: 'Civil Engineering', students: 195, activities: 589 },
    { department: 'Business Admin', students: 165, activities: 445 }
  ];

  const monthlyTrends = [
    { month: 'Jul', submissions: 145, verifications: 132 },
    { month: 'Aug', submissions: 189, verifications: 171 },
    { month: 'Sep', submissions: 223, verifications: 198 },
    { month: 'Oct', submissions: 267, verifications: 241 },
    { month: 'Nov', submissions: 312, verifications: 289 },
    { month: 'Dec', submissions: 356, verifications: 321 }
  ];

  const yearWiseEngagement = [
    { year: '2021', participation: 68 },
    { year: '2022', participation: 74 },
    { year: '2023', participation: 81 },
    { year: '2024', participation: 87 }
  ];

  const kpiData = {
    totalActivities: 3303,
    avgParticipationRate: 82.4,
    verificationRate: 91.2,
    underEngagedStudents: 127,
    topPerformers: 89,
    pendingVerifications: 156
  };

  const departmentInsights = [
    {
      department: 'Computer Science',
      students: 245,
      avgActivities: 3.6,
      topCategory: 'Technical',
      engagement: 'High',
      color: 'bg-green-500'
    },
    {
      department: 'Electrical Engineering',
      students: 180,
      avgActivities: 3.6,
      topCategory: 'Technical',
      engagement: 'High',
      color: 'bg-green-500'
    },
    {
      department: 'Mechanical Engineering',
      students: 210,
      avgActivities: 3.4,
      topCategory: 'Technical',
      engagement: 'Medium',
      color: 'bg-yellow-500'
    },
    {
      department: 'Civil Engineering',
      students: 195,
      avgActivities: 3.0,
      topCategory: 'Academic',
      engagement: 'Medium',
      color: 'bg-yellow-500'
    },
    {
      department: 'Business Administration',
      students: 165,
      avgActivities: 2.7,
      topCategory: 'Leadership',
      engagement: 'Low',
      color: 'bg-red-500'
    }
  ];

  const handleExportNAAC = (format: 'pdf' | 'excel') => {
    console.log(`Exporting NAAC report as ${format}`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `naac-report-2024.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('login')}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">Admin Analytics Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Admin Portal
              </Badge>
              <div className="text-sm text-right">
                <p className="font-medium text-gray-700">John Anderson</p>
                <p className="text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
            <p className="text-gray-600">Comprehensive insights into student activities and engagement</p>
          </div>
          
          <div className="flex space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="ee">Electrical Engineering</SelectItem>
                <SelectItem value="me">Mechanical Engineering</SelectItem>
                <SelectItem value="ce">Civil Engineering</SelectItem>
                <SelectItem value="ba">Business Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Activities</p>
                  <p className="text-2xl font-bold">{kpiData.totalActivities.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Participation Rate</p>
                  <p className="text-2xl font-bold">{kpiData.avgParticipationRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Verification Rate</p>
                  <p className="text-2xl font-bold">{kpiData.verificationRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">Pending Reviews</p>
                  <p className="text-2xl font-bold">{kpiData.pendingVerifications}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Under-engaged</p>
                  <p className="text-2xl font-bold">{kpiData.underEngagedStudents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Top Performers</p>
                  <p className="text-2xl font-bold">{kpiData.topPerformers}</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-blue-600" />
                Activity Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of activity types across all departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {activityDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {activityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Participation Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Department Participation
              </CardTitle>
              <CardDescription>
                Activity participation by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentParticipation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activities" fill="#3B82F6" name="Total Activities" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends and Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Monthly Submission Trends
              </CardTitle>
              <CardDescription>
                Submissions vs verifications over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Submissions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="verifications" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Verifications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Year-wise Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-600" />
                Year-wise Engagement Heatmap
              </CardTitle>
              <CardDescription>
                Student participation rates by academic year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearWiseEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Participation Rate']} />
                    <Area 
                      type="monotone" 
                      dataKey="participation" 
                      stroke="#F59E0B" 
                      fill="#FEF3C7"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Department Performance Insights
            </CardTitle>
            <CardDescription>
              Detailed breakdown of each department's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {departmentInsights.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{dept.department}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`${dept.color} text-white`}
                      >
                        {dept.engagement} Engagement
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Students</p>
                      <p className="font-medium">{dept.students}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Activities</p>
                      <p className="font-medium">{dept.avgActivities}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Top Category</p>
                      <p className="font-medium">{dept.topCategory}</p>
                    </div>
                    <div className="flex items-end">
                      <Progress 
                        value={dept.avgActivities * 25} 
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Export Reports
            </CardTitle>
            <CardDescription>
              Generate comprehensive reports for NAAC and administrative purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-green-400 transition-colors">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">NAAC Report (PDF)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive PDF report formatted for NAAC submission
                </p>
                <Button 
                  onClick={() => handleExportNAAC('pdf')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>

              <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-blue-400 transition-colors">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">Analytics Export (Excel)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed analytics data in Excel format for further analysis
                </p>
                <Button 
                  onClick={() => handleExportNAAC('excel')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}