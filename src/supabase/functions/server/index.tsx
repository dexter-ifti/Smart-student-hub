import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/middleware';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Configure CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Add logging
app.use('*', logger(console.log));

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to get user from token
async function getUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No authorization token provided' };
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

// Demo credentials for quick testing
const DEMO_USERS = [
  {
    email: 'demo.student@university.edu',
    password: 'demo123',
    role: 'student',
    name: 'Alex Johnson',
    department: 'Computer Science',
    student_id: 'CS2024001'
  },
  {
    email: 'demo.faculty@university.edu',
    password: 'demo123',
    role: 'faculty',
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science',
    student_id: ''
  },
  {
    email: 'demo.admin@university.edu',
    password: 'demo123',
    role: 'admin',
    name: 'Admin User',
    department: 'Administration',
    student_id: ''
  }
];

// Create storage buckets and demo users on startup
async function initializeStorage() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const certificatesBucketName = 'make-e0e3ff39-certificates';
    const portfoliosBucketName = 'make-e0e3ff39-portfolios';
    
    const bucketExists = (name: string) => buckets?.some(bucket => bucket.name === name);
    
    if (!bucketExists(certificatesBucketName)) {
      await supabaseAdmin.storage.createBucket(certificatesBucketName, { public: false });
      console.log('Created certificates bucket');
    }
    
    if (!bucketExists(portfoliosBucketName)) {
      await supabaseAdmin.storage.createBucket(portfoliosBucketName, { public: false });
      console.log('Created portfolios bucket');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Create demo users if they don't exist
async function initializeDemoUsers() {
  try {
    for (const demoUser of DEMO_USERS) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUsers.users?.some(user => user.email === demoUser.email);
      
      if (!userExists) {
        // Create user in Supabase Auth
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          user_metadata: { 
            name: demoUser.name, 
            role: demoUser.role, 
            department: demoUser.department,
            student_id: demoUser.student_id
          },
          email_confirm: true
        });

        if (error) {
          console.error(`Error creating demo user ${demoUser.email}:`, error);
          continue;
        }

        // Store additional user data in KV store
        await kv.set(`user:${data.user.id}`, {
          id: data.user.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          department: demoUser.department,
          student_id: demoUser.student_id,
          created_at: new Date().toISOString(),
          profile_complete: true
        });

        console.log(`Created demo user: ${demoUser.email} (${demoUser.role})`);

        // Add demo certificates for student users
        if (demoUser.role === 'student') {
          const demoCertificates = [
            {
              id: crypto.randomUUID(),
              user_id: data.user.id,
              name: 'AWS Cloud Practitioner Certification',
              category: 'Technical',
              issue_date: '2024-01-15',
              description: 'AWS Certified Cloud Practitioner certification demonstrating foundational understanding of AWS Cloud',
              file_name: 'aws-cloud-practitioner.pdf',
              file_size: 1250000,
              file_url: '#demo-file-url',
              status: 'verified',
              upload_date: '2024-01-20T10:00:00Z',
              verification_date: '2024-01-22T14:30:00Z',
              verified_by: 'demo-faculty',
              remarks: 'Excellent technical certification. Well documented and valid.'
            },
            {
              id: crypto.randomUUID(),
              user_id: data.user.id,
              name: 'Hackathon Winner - Tech Innovation 2024',
              category: 'Achievement',
              issue_date: '2024-02-10',
              description: 'First place winner in the annual Tech Innovation Hackathon for developing an AI-powered healthcare solution',
              file_name: 'hackathon-certificate.jpg',
              file_size: 850000,
              file_url: '#demo-file-url',
              status: 'verified',
              upload_date: '2024-02-12T09:15:00Z',
              verification_date: '2024-02-15T11:45:00Z',
              verified_by: 'demo-faculty',
              remarks: 'Outstanding achievement! This demonstrates exceptional problem-solving skills.'
            },
            {
              id: crypto.randomUUID(),
              user_id: data.user.id,
              name: 'Community Service Volunteer Certificate',
              category: 'Community Service',
              issue_date: '2023-12-05',
              description: '100+ hours of volunteer work at local food bank and community center',
              file_name: 'volunteer-certificate.pdf',
              file_size: 920000,
              file_url: '#demo-file-url',
              status: 'verified',
              upload_date: '2023-12-08T16:20:00Z',
              verification_date: '2023-12-10T13:10:00Z',
              verified_by: 'demo-faculty',
              remarks: 'Great dedication to community service. Keep up the excellent work!'
            },
            {
              id: crypto.randomUUID(),
              user_id: data.user.id,
              name: 'Machine Learning Workshop Completion',
              category: 'Professional Development',
              issue_date: '2024-03-20',
              description: 'Completed intensive 3-day workshop on Machine Learning fundamentals and applications',
              file_name: 'ml-workshop.pdf',
              file_size: 1100000,
              file_url: '#demo-file-url',
              status: 'pending',
              upload_date: '2024-03-22T14:00:00Z',
              verification_date: null,
              verified_by: null,
              remarks: ''
            }
          ];

          // Store certificates and create user certificate list
          const certificateIds = [];
          for (const cert of demoCertificates) {
            await kv.set(`certificate:${cert.id}`, cert);
            certificateIds.push(cert.id);
          }
          await kv.set(`user_certificates:${data.user.id}`, certificateIds);

          console.log(`Added ${demoCertificates.length} demo certificates for ${demoUser.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
}

// Initialize storage and demo users on startup
await initializeStorage();
await initializeDemoUsers();

// Authentication Routes

// Sign up route
app.post('/make-server-e0e3ff39/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role = 'student', department, studentId } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role, 
        department: department || '',
        student_id: studentId || ''
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      department: department || '',
      student_id: studentId || '',
      created_at: new Date().toISOString(),
      profile_complete: false
    });

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get('/make-server-e0e3ff39/profile', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Certificate Management Routes

// Upload certificate metadata
app.post('/make-server-e0e3ff39/certificates', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, category, issueDate, description, fileName, fileSize, fileUrl } = body;

    if (!name || !category || !fileName) {
      return c.json({ error: 'Certificate name, category, and file name are required' }, 400);
    }

    const certificateId = crypto.randomUUID();
    const certificate = {
      id: certificateId,
      user_id: user.id,
      name,
      category,
      issue_date: issueDate,
      description: description || '',
      file_name: fileName,
      file_size: fileSize,
      file_url: fileUrl,
      status: 'pending',
      upload_date: new Date().toISOString(),
      verification_date: null,
      verified_by: null,
      remarks: ''
    };

    await kv.set(`certificate:${certificateId}`, certificate);

    // Add to user's certificates list
    const userCertificates = await kv.get(`user_certificates:${user.id}`) || [];
    userCertificates.push(certificateId);
    await kv.set(`user_certificates:${user.id}`, userCertificates);

    return c.json({ 
      message: 'Certificate uploaded successfully',
      certificate
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    return c.json({ error: 'Failed to upload certificate' }, 500);
  }
});

// Get user's certificates
app.get('/make-server-e0e3ff39/certificates', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const certificateIds = await kv.get(`user_certificates:${user.id}`) || [];
    const certificates = await kv.mget(certificateIds.map((id: string) => `certificate:${id}`));

    return c.json({ certificates: certificates.filter(Boolean) });
  } catch (error) {
    console.error('Certificates fetch error:', error);
    return c.json({ error: 'Failed to fetch certificates' }, 500);
  }
});

// Faculty Routes

// Get all pending certificates for verification
app.get('/make-server-e0e3ff39/faculty/certificates', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    // Get user profile to check role
    const userData = await kv.get(`user:${user.id}`);
    if (!userData || (userData.role !== 'faculty' && userData.role !== 'admin')) {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }

    const status = c.req.query('status') || 'all';
    const department = c.req.query('department') || 'all';

    // Get all certificates by prefix
    const allCertificates = await kv.getByPrefix('certificate:');
    
    let filteredCertificates = allCertificates;

    // Filter by status
    if (status !== 'all') {
      filteredCertificates = filteredCertificates.filter((cert: any) => cert.status === status);
    }

    // Get student details for each certificate
    const certificatesWithStudents = await Promise.all(
      filteredCertificates.map(async (cert: any) => {
        const student = await kv.get(`user:${cert.user_id}`);
        return {
          ...cert,
          student_name: student?.name || 'Unknown',
          student_id: student?.student_id || 'Unknown',
          student_department: student?.department || 'Unknown'
        };
      })
    );

    // Filter by department
    if (department !== 'all') {
      certificatesWithStudents = certificatesWithStudents.filter(
        (cert: any) => cert.student_department === department
      );
    }

    return c.json({ certificates: certificatesWithStudents });
  } catch (error) {
    console.error('Faculty certificates fetch error:', error);
    return c.json({ error: 'Failed to fetch certificates for verification' }, 500);
  }
});

// Verify or reject certificate
app.put('/make-server-e0e3ff39/faculty/certificates/:id', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    // Check faculty permissions
    const userData = await kv.get(`user:${user.id}`);
    if (!userData || (userData.role !== 'faculty' && userData.role !== 'admin')) {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }

    const certificateId = c.req.param('id');
    const body = await c.req.json();
    const { action, remarks } = body; // action: 'verify' or 'reject'

    if (!action || !['verify', 'reject'].includes(action)) {
      return c.json({ error: 'Invalid action. Must be "verify" or "reject"' }, 400);
    }

    const certificate = await kv.get(`certificate:${certificateId}`);
    if (!certificate) {
      return c.json({ error: 'Certificate not found' }, 404);
    }

    const updatedCertificate = {
      ...certificate,
      status: action === 'verify' ? 'verified' : 'rejected',
      verification_date: new Date().toISOString(),
      verified_by: user.id,
      remarks: remarks || ''
    };

    await kv.set(`certificate:${certificateId}`, updatedCertificate);

    return c.json({ 
      message: `Certificate ${action}ed successfully`,
      certificate: updatedCertificate
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return c.json({ error: 'Failed to update certificate status' }, 500);
  }
});

// Portfolio Routes

// Generate portfolio
app.post('/make-server-e0e3ff39/portfolio/generate', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    // Get user profile
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Get user's verified certificates
    const certificateIds = await kv.get(`user_certificates:${user.id}`) || [];
    const allCertificates = await kv.mget(certificateIds.map((id: string) => `certificate:${id}`));
    const verifiedCertificates = allCertificates.filter((cert: any) => cert && cert.status === 'verified');

    // Create portfolio data
    const portfolioId = crypto.randomUUID();
    const portfolio = {
      id: portfolioId,
      user_id: user.id,
      student_name: userData.name,
      student_id: userData.student_id,
      email: userData.email,
      department: userData.department,
      certificates: verifiedCertificates,
      generated_at: new Date().toISOString(),
      shareable_link: `https://studenthub.edu/portfolio/${portfolioId}`,
      views: 0,
      last_updated: new Date().toISOString()
    };

    await kv.set(`portfolio:${portfolioId}`, portfolio);
    await kv.set(`user_portfolio:${user.id}`, portfolioId);

    return c.json({ 
      message: 'Portfolio generated successfully',
      portfolio: {
        id: portfolioId,
        shareable_link: portfolio.shareable_link,
        certificate_count: verifiedCertificates.length,
        generated_at: portfolio.generated_at
      }
    });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return c.json({ error: 'Failed to generate portfolio' }, 500);
  }
});

// Get portfolio by ID (public access for sharing)
app.get('/make-server-e0e3ff39/portfolio/:id', async (c) => {
  try {
    const portfolioId = c.req.param('id');
    const portfolio = await kv.get(`portfolio:${portfolioId}`);
    
    if (!portfolio) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    // Increment view count
    portfolio.views = (portfolio.views || 0) + 1;
    await kv.set(`portfolio:${portfolioId}`, portfolio);

    return c.json({ portfolio });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return c.json({ error: 'Failed to fetch portfolio' }, 500);
  }
});

// Admin Analytics Routes

// Get analytics data
app.get('/make-server-e0e3ff39/admin/analytics', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    // Check admin permissions
    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Insufficient permissions. Admin access required' }, 403);
    }

    // Get all users, certificates, and portfolios
    const allUsers = await kv.getByPrefix('user:');
    const allCertificates = await kv.getByPrefix('certificate:');
    const allPortfolios = await kv.getByPrefix('portfolio:');

    // Calculate analytics
    const analytics = {
      total_users: allUsers.length,
      total_certificates: allCertificates.length,
      verified_certificates: allCertificates.filter((cert: any) => cert.status === 'verified').length,
      pending_certificates: allCertificates.filter((cert: any) => cert.status === 'pending').length,
      rejected_certificates: allCertificates.filter((cert: any) => cert.status === 'rejected').length,
      total_portfolios: allPortfolios.length,
      
      // Department breakdown
      departments: {},
      
      // Category breakdown
      certificate_categories: {},
      
      // Monthly trends (simplified)
      monthly_submissions: [],
      
      // Student engagement
      student_activity_levels: {
        high: 0, // 4+ certificates
        medium: 0, // 2-3 certificates
        low: 0 // 0-1 certificates
      }
    };

    // Calculate department and category breakdowns
    for (const cert of allCertificates) {
      // Get student info
      const student = await kv.get(`user:${cert.user_id}`);
      const department = student?.department || 'Unknown';
      
      if (!analytics.departments[department]) {
        analytics.departments[department] = { students: new Set(), certificates: 0 };
      }
      analytics.departments[department].students.add(cert.user_id);
      analytics.departments[department].certificates++;
      
      // Category breakdown
      const category = cert.category || 'Other';
      analytics.certificate_categories[category] = (analytics.certificate_categories[category] || 0) + 1;
    }

    // Convert sets to counts
    Object.keys(analytics.departments).forEach(dept => {
      analytics.departments[dept].students = analytics.departments[dept].students.size;
    });

    // Calculate student activity levels
    const studentCertCounts = {};
    allCertificates.forEach((cert: any) => {
      studentCertCounts[cert.user_id] = (studentCertCounts[cert.user_id] || 0) + 1;
    });

    Object.values(studentCertCounts).forEach((count: any) => {
      if (count >= 4) analytics.student_activity_levels.high++;
      else if (count >= 2) analytics.student_activity_levels.medium++;
      else analytics.student_activity_levels.low++;
    });

    return c.json({ analytics });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return c.json({ error: 'Failed to fetch analytics data' }, 500);
  }
});

// File upload route (for certificates)
app.post('/make-server-e0e3ff39/upload/certificate', async (c) => {
  try {
    const { user, error } = await getUser(c.req.raw);
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const bucketName = 'make-e0e3ff39-certificates';

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Create signed URL for the uploaded file
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      return c.json({ error: 'Failed to create file access URL' }, 500);
    }

    return c.json({ 
      message: 'File uploaded successfully',
      fileUrl: signedUrlData.signedUrl,
      fileName: file.name,
      fileSize: file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Health check
app.get('/make-server-e0e3ff39/health', (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Smart Student Hub API'
  });
});

// Start the server
Deno.serve(app.fetch);