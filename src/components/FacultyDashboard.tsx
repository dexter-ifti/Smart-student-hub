import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Filter,
  Search,
  FileText,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Download,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { Screen } from '../App';

interface FacultyDashboardProps {
  onNavigate: (screen: Screen) => void;
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  certificateName: string;
  category: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  fileName: string;
  fileSize: string;
  department: string;
  year: string;
  remarks?: string;
}

export function FacultyDashboard({ onNavigate }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [remarks, setRemarks] = useState('');

  const submissions: Submission[] = [
    {
      id: '1',
      studentName: 'John Smith',
      studentId: 'CS2021001',
      certificateName: 'AWS Cloud Practitioner',
      category: 'Technical',
      uploadDate: '2024-12-20',
      status: 'pending',
      fileName: 'aws-cert.pdf',
      fileSize: '2.3 MB',
      department: 'Computer Science',
      year: '2024'
    },
    {
      id: '2',
      studentName: 'Sarah Johnson',
      studentId: 'EE2021002',
      certificateName: 'IoT Development Workshop',
      category: 'Technical',
      uploadDate: '2024-12-19',
      status: 'pending',
      fileName: 'iot-workshop.pdf',
      fileSize: '1.8 MB',
      department: 'Electrical Engineering',
      year: '2024'
    },
    {
      id: '3',
      studentName: 'Mike Chen',
      studentId: 'CS2021003',
      certificateName: 'Hackathon Winner Certificate',
      category: 'Achievement',
      uploadDate: '2024-12-18',
      status: 'verified',
      fileName: 'hackathon-cert.pdf',
      fileSize: '1.5 MB',
      department: 'Computer Science',
      year: '2024',
      remarks: 'Excellent achievement! Certificate verified from official hackathon website.'
    },
    {
      id: '4',
      studentName: 'Emily Davis',
      studentId: 'ME2021004',
      certificateName: 'Community Service Certificate',
      category: 'Community Service',
      uploadDate: '2024-12-17',
      status: 'rejected',
      fileName: 'service-cert.jpg',
      fileSize: '3.2 MB',
      department: 'Mechanical Engineering',
      year: '2024',
      remarks: 'Image quality is too low. Please upload a clearer scan of the certificate.'
    },
    {
      id: '5',
      studentName: 'Alex Wilson',
      studentId: 'CS2021005',
      certificateName: 'Google Cloud Digital Leader',
      category: 'Technical',
      uploadDate: '2024-12-16',
      status: 'pending',
      fileName: 'gcp-cert.pdf',
      fileSize: '1.9 MB',
      department: 'Computer Science',
      year: '2024'
    }
  ];

  const handleVerify = (submissionId: string) => {
    console.log('Verifying submission:', submissionId, 'Remarks:', remarks);
    setSelectedSubmission(null);
    setRemarks('');
  };

  const handleReject = (submissionId: string) => {
    console.log('Rejecting submission:', submissionId, 'Remarks:', remarks);
    setSelectedSubmission(null);
    setRemarks('');
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.certificateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || submission.department === departmentFilter;
    const matchesTab = activeTab === 'all' || submission.status === activeTab;
    
    return matchesSearch && matchesDepartment && matchesTab;
  });

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    verified: submissions.filter(s => s.status === 'verified').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
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
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">Faculty Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Faculty Portal
              </Badge>
              <div className="text-sm text-right">
                <p className="font-medium text-gray-700">Dr. Sarah Mitchell</p>
                <p className="text-gray-500">Computer Science Dept.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Verified</p>
                  <p className="text-3xl font-bold">{stats.verified}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Submissions</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Certificate Verification Dashboard
            </CardTitle>
            <CardDescription>
              Review and verify student certificate submissions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by student name, ID, or certificate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center">
                  Pending
                  {stats.pending > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-yellow-500 text-white text-xs px-1">
                      {stats.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Certificate</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.studentName}</p>
                              <p className="text-sm text-gray-500">{submission.studentId}</p>
                              <p className="text-xs text-gray-400">{submission.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.certificateName}</p>
                              <p className="text-sm text-gray-500">{submission.fileName}</p>
                              <p className="text-xs text-gray-400">{submission.fileSize}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.category}</Badge>
                          </TableCell>
                          <TableCell>{submission.uploadDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(submission.status)}
                              {getStatusBadge(submission.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedSubmission(submission)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Certificate Review</DialogTitle>
                                    <DialogDescription>
                                      Review and verify the submitted certificate
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedSubmission && (
                                    <div className="space-y-6">
                                      {/* Student Info */}
                                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                          <Label className="font-medium">Student Name</Label>
                                          <p>{selectedSubmission.studentName}</p>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Student ID</Label>
                                          <p>{selectedSubmission.studentId}</p>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Department</Label>
                                          <p>{selectedSubmission.department}</p>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Upload Date</Label>
                                          <p>{selectedSubmission.uploadDate}</p>
                                        </div>
                                      </div>

                                      {/* Certificate Info */}
                                      <div className="space-y-2">
                                        <Label className="font-medium">Certificate Details</Label>
                                        <div className="p-4 border rounded-lg">
                                          <h3 className="font-medium">{selectedSubmission.certificateName}</h3>
                                          <p className="text-sm text-gray-600">{selectedSubmission.category}</p>
                                          <p className="text-sm text-gray-500">{selectedSubmission.fileName} ({selectedSubmission.fileSize})</p>
                                        </div>
                                      </div>

                                      {/* Certificate Preview */}
                                      <div className="space-y-2">
                                        <Label className="font-medium">Certificate Preview</Label>
                                        <div className="border rounded-lg p-8 bg-gray-50 text-center">
                                          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                          <p className="text-gray-600">Certificate preview would appear here</p>
                                          <Button variant="outline" size="sm" className="mt-2">
                                            <Download className="h-3 w-3 mr-1" />
                                            Download Full File
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Remarks */}
                                      <div className="space-y-2">
                                        <Label htmlFor="remarks">Remarks (Optional)</Label>
                                        <Textarea
                                          id="remarks"
                                          placeholder="Add any comments or remarks..."
                                          value={remarks}
                                          onChange={(e) => setRemarks(e.target.value)}
                                          rows={3}
                                        />
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex justify-end space-x-3">
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleReject(selectedSubmission.id)}
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                        <Button
                                          onClick={() => handleVerify(selectedSubmission.id)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Verify
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No submissions found matching your criteria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}