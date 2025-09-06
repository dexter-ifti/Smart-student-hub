import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client to avoid multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseClient;
}

// Demo mode bypass for demo credentials
export const DEMO_CREDENTIALS = [
  {
    email: 'demo.student@university.edu',
    password: 'demo123',
    role: 'student' as const,
    name: 'Alex Johnson',
    department: 'Computer Science',
    student_id: 'CS2024001'
  },
  {
    email: 'demo.faculty@university.edu',
    password: 'demo123',
    role: 'faculty' as const,
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science',
    student_id: ''
  },
  {
    email: 'demo.admin@university.edu',
    password: 'demo123',
    role: 'admin' as const,
    name: 'Admin User',
    department: 'Administration',
    student_id: ''
  }
];

export function isDemoCredentials(email: string, password: string) {
  return DEMO_CREDENTIALS.find(cred => cred.email === email && cred.password === password);
}