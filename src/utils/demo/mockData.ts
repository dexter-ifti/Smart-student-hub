// Mock data for demo mode when API calls need to be bypassed

export const DEMO_CERTIFICATES = [
  {
    id: 'demo-cert-1',
    name: 'AWS Cloud Practitioner Certification',
    category: 'Technical',
    issue_date: '2024-01-15',
    upload_date: '2024-01-20T10:00:00Z',
    status: 'verified' as const,
    file_name: 'aws-cloud-practitioner.pdf',
    file_size: '1.2 MB',
    remarks: 'Excellent technical certification. Well documented and valid.'
  },
  {
    id: 'demo-cert-2',
    name: 'Hackathon Winner - Tech Innovation 2024',
    category: 'Achievement',
    issue_date: '2024-02-10',
    upload_date: '2024-02-12T09:15:00Z',
    status: 'verified' as const,
    file_name: 'hackathon-certificate.jpg',
    file_size: '850 KB',
    remarks: 'Outstanding achievement! This demonstrates exceptional problem-solving skills.'
  },
  {
    id: 'demo-cert-3',
    name: 'Community Service Volunteer Certificate',
    category: 'Community Service',
    issue_date: '2023-12-05',
    upload_date: '2023-12-08T16:20:00Z',
    status: 'verified' as const,
    file_name: 'volunteer-certificate.pdf',
    file_size: '920 KB',
    remarks: 'Great dedication to community service. Keep up the excellent work!'
  },
  {
    id: 'demo-cert-4',
    name: 'Machine Learning Workshop Completion',
    category: 'Professional Development',
    issue_date: '2024-03-20',
    upload_date: '2024-03-22T14:00:00Z',
    status: 'pending' as const,
    file_name: 'ml-workshop.pdf',
    file_size: '1.1 MB',
    remarks: ''
  }
];

export const DEMO_FACULTY_CERTIFICATES = [
  {
    id: 'demo-faculty-cert-1',
    name: 'React Advanced Concepts',
    category: 'Technical',
    student_name: 'Alex Johnson',
    student_id: 'CS2024001',
    student_department: 'Computer Science',
    upload_date: '2024-03-22T14:00:00Z',
    status: 'pending' as const,
    file_name: 'react-advanced.pdf',
    file_size: '950 KB'
  },
  {
    id: 'demo-faculty-cert-2',
    name: 'Data Structures & Algorithms',
    category: 'Academic',
    student_name: 'Emily Davis',
    student_id: 'CS2024002',
    student_department: 'Computer Science',
    upload_date: '2024-03-21T16:30:00Z',
    status: 'pending' as const,
    file_name: 'dsa-certificate.pdf',
    file_size: '1.3 MB'
  },
  {
    id: 'demo-faculty-cert-3',
    name: 'Leadership Excellence Award',
    category: 'Achievement',
    student_name: 'Michael Chen',
    student_id: 'EE2024001',
    student_department: 'Electrical Engineering',
    upload_date: '2024-03-20T11:15:00Z',
    status: 'verified' as const,
    file_name: 'leadership-award.jpg',
    file_size: '780 KB'
  }
];

export const DEMO_ANALYTICS = {
  total_users: 234,
  total_certificates: 1247,
  verified_certificates: 987,
  pending_certificates: 186,
  rejected_certificates: 74,
  total_portfolios: 156,
  departments: {
    'Computer Science': { students: 89, certificates: 445 },
    'Electrical Engineering': { students: 67, certificates: 298 },
    'Mechanical Engineering': { students: 45, certificates: 201 },
    'Information Technology': { students: 33, certificates: 303 }
  },
  certificate_categories: {
    'Technical': 567,
    'Academic': 289,
    'Achievement': 201,
    'Professional Development': 145,
    'Community Service': 45
  },
  student_activity_levels: {
    high: 45,
    medium: 123,
    low: 66
  }
};

export function isDemoSession(): boolean {
  try {
    const sessionData = localStorage.getItem('supabase_session');
    if (!sessionData) return false;
    
    const session = JSON.parse(sessionData);
    return session?.access_token?.startsWith('demo-token-');
  } catch {
    return false;
  }
}