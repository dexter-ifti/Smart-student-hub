import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CertificateUpload } from './components/CertificateUpload';
import { PortfolioGeneration } from './components/PortfolioGeneration';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DemoNavigation } from './components/DemoNavigation';

export type Screen = 'login' | 'dashboard' | 'certificates' | 'portfolio' | 'faculty' | 'admin';
export type UserRole = 'student' | 'faculty' | 'admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole>('student');

  const navigateTo = (screen: Screen, role?: UserRole) => {
    setCurrentScreen(screen);
    if (role) setUserRole(role);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage onLogin={navigateTo} />;
      case 'dashboard':
        return <StudentDashboard onNavigate={navigateTo} />;
      case 'certificates':
        return <CertificateUpload onNavigate={navigateTo} />;
      case 'portfolio':
        return <PortfolioGeneration onNavigate={navigateTo} />;
      case 'faculty':
        return <FacultyDashboard onNavigate={navigateTo} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigateTo} />;
      default:
        return <LoginPage onLogin={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {renderScreen()}
      
      {/* Demo Navigation - Only show when not on login page */}
      {currentScreen !== 'login' && (
        <DemoNavigation
          currentScreen={currentScreen}
          userRole={userRole}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}