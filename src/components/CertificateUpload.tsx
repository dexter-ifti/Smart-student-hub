import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Upload, 
  File, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowLeft,
  FileText,
  Award,
  Calendar,
  Tag,
  Eye,
  Download,
  Search
} from 'lucide-react';
import { Screen } from '../App';
import { projectId } from '../utils/supabase/info';
import { DEMO_CERTIFICATES, isDemoSession } from '../utils/demo/mockData';

interface CertificateUploadProps {
  onNavigate: (screen: Screen) => void;
}

interface Certificate {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  remarks?: string;
  fileName: string;
  fileSize: string;
}

export function CertificateUpload({ onNavigate }: CertificateUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificateForm, setCertificateForm] = useState({
    name: '',
    category: '',
    issueDate: '',
    description: ''
  });

  // Get session from localStorage
  const getSession = () => {
    try {
      const sessionData = localStorage.getItem('supabase_session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  };

  // Fetch certificates on component mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const session = getSession();
      if (!session?.access_token) {
        setError('No valid session found. Please login again.');
        return;
      }

      // Use mock data for demo sessions
      if (isDemoSession()) {
        setCertificates(DEMO_CERTIFICATES);
        setLoading(false);
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0e3ff39/certificates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!certificateForm.name || !certificateForm.category) {
      setError('Please fill in certificate name and category before uploading');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const session = getSession();
      if (!session?.access_token) {
        setError('No valid session found. Please login again.');
        setIsUploading(false);
        return;
      }

      // Handle demo mode
      if (isDemoSession()) {
        // Simulate upload progress for demo
        const uploadInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(uploadInterval);
              return 100;
            }
            return prev + 25;
          });
        }, 400);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create new demo certificate
        const newCert = {
          id: 'demo-cert-' + Date.now(),
          name: certificateForm.name,
          category: certificateForm.category,
          issue_date: certificateForm.issueDate || new Date().toISOString().split('T')[0],
          upload_date: new Date().toISOString(),
          status: 'pending' as const,
          file_name: file.name,
          file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          remarks: ''
        };

        // Add to demo certificates
        setCertificates(prev => [newCert, ...prev]);

        // Clear form
        setCertificateForm({
          name: '',
          category: '',
          issueDate: '',
          description: ''
        });

        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
        return;
      }

      // Real upload for non-demo sessions
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for file upload
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 80) {
            clearInterval(uploadInterval);
            return 80;
          }
          return prev + 20;
        });
      }, 300);

      // Upload file to server
      const uploadResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0e3ff39/upload/certificate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'File upload failed');
      }

      const uploadData = await uploadResponse.json();
      setUploadProgress(90);

      // Create certificate metadata
      const certificateData = {
        name: certificateForm.name,
        category: certificateForm.category,
        issueDate: certificateForm.issueDate,
        description: certificateForm.description,
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
        fileUrl: uploadData.fileUrl
      };

      const certificateResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0e3ff39/certificates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
      });

      if (!certificateResponse.ok) {
        const errorData = await certificateResponse.json();
        throw new Error(errorData.error || 'Certificate creation failed');
      }

      setUploadProgress(100);
      
      // Clear form
      setCertificateForm({
        name: '',
        category: '',
        issueDate: '',
        description: ''
      });

      // Refresh certificates list
      await fetchCertificates();

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 hover:bg-green-600">✅ Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ Rejected</Badge>;
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (field: string, value: string) => {
    setCertificateForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmitCertificate = () => {
    if (!certificateForm.name || !certificateForm.category) {
      setError('Please provide certificate name and category');
      return;
    }
    setError('Please upload a file by dragging and dropping or clicking to browse');
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
            <h1 className="text-xl font-semibold text-gray-800">Certificate Management</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-blue-600" />
                  Upload New Certificate
                </CardTitle>
                <CardDescription>
                  Drag and drop your certificate or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        Drop your certificate here
                      </h3>
                      <p className="text-gray-600">
                        or <span className="text-blue-600 font-medium">browse</span> to choose a file
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Supports: PDF, JPG, JPEG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Certificate Details Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-name">Certificate Name</Label>
                    <Input 
                      id="cert-name" 
                      placeholder="e.g., AWS Cloud Practitioner"
                      className="bg-gray-50"
                      value={certificateForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cert-category">Category</Label>
                    <Select value={certificateForm.category} onValueChange={(value) => handleFormChange('category', value)}>
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Achievement">Achievement</SelectItem>
                        <SelectItem value="Community Service">Community Service</SelectItem>
                        <SelectItem value="Professional Development">Professional Development</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cert-date">Issue Date</Label>
                    <Input 
                      id="cert-date" 
                      type="date"
                      className="bg-gray-50"
                      value={certificateForm.issueDate}
                      onChange={(e) => handleFormChange('issueDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cert-description">Description (Optional)</Label>
                    <Textarea 
                      id="cert-description"
                      placeholder="Brief description of the certificate..."
                      className="bg-gray-50"
                      rows={3}
                      value={certificateForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleSubmitCertificate}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit for Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificates List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-green-600" />
                  My Certificates
                </CardTitle>
                <CardDescription>
                  {certificates.length} certificates uploaded
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50"
                  />
                </div>

                {/* Certificates List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading certificates...</p>
                    </div>
                  ) : filteredCertificates.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No certificates uploaded yet</p>
                      <p className="text-sm text-gray-500">Upload your first certificate to get started</p>
                    </div>
                  ) : (
                    filteredCertificates.map((cert) => (
                    <div key={cert.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">{cert.name}</h4>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <span className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {cert.category}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(cert.upload_date || cert.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(cert.status)}
                          {getStatusBadge(cert.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="flex items-center">
                          <File className="h-3 w-3 mr-1" />
                          {cert.file_name || cert.fileName} ({cert.file_size || cert.fileSize})
                        </span>
                      </div>

                      {cert.remarks && (
                        <div className={`text-sm p-2 rounded ${
                          cert.status === 'verified' 
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : cert.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          <strong>Faculty Remarks:</strong> {cert.remarks}
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Verified</p>
                  <p className="text-3xl font-bold">
                    {certificates.filter(c => c.status === 'verified').length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">Pending</p>
                  <p className="text-3xl font-bold">
                    {certificates.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Rejected</p>
                  <p className="text-3xl font-bold">
                    {certificates.filter(c => c.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}