import React, { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import StudentManagement from './StudentManagement';
import MarksManagement from './MarksManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import CourseManagement from './CourseManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isLecturer = user?.role === 'lecturer';

  // Default tab: admins see students, lecturers see marks
  const [activeTab, setActiveTab] = useState(isAdmin ? 'students' : 'marks');

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Container fluid className="mt-6 px-4 pb-6 relative">
        {/* Animated background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>
        
        <div className="mb-8 relative">
          <h2 className="text-black text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Admin Dashboard
          </h2>
          <div className="absolute -bottom-2 left-0 w-40 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"></div>
        </div>
        
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="tabs" className="border-b-2 border-primary/30 mb-6 bg-gray-100/50 backdrop-blur-sm rounded-t-lg p-1">
            {isAdmin && (
              <Nav.Item>
                <Nav.Link 
                  eventKey="students"
                  className={`text-black hover:text-primary transition-all duration-300 border-0 rounded-lg px-4 py-3 font-semibold ${
                    activeTab === 'students' 
                      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-b-2 border-primary shadow-lg shadow-primary/30 scale-105' 
                      : 'hover:bg-gray-100/50 hover:scale-105'
                  }`}
                >
                  👥 Student Management
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link 
                eventKey="marks"
                className={`text-black hover:text-secondary transition-all duration-300 border-0 rounded-lg px-4 py-3 font-semibold ${
                  activeTab === 'marks' 
                    ? 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-b-2 border-secondary shadow-lg shadow-secondary/30 scale-105' 
                    : 'hover:bg-gray-100/50 hover:scale-105'
                }`}
              >
                📝 Marks Management
              </Nav.Link>
            </Nav.Item>
            {isAdmin && (
              <Nav.Item>
                <Nav.Link 
                  eventKey="courses"
                  className={`text-black hover:text-accent transition-all duration-300 border-0 rounded-lg px-4 py-3 font-semibold ${
                    activeTab === 'courses' 
                      ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-b-2 border-accent shadow-lg shadow-accent/30 scale-105' 
                      : 'hover:bg-gray-100/50 hover:scale-105'
                  }`}
                >
                  📖 Course Management
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          <Tab.Content className="mt-5">
            <Tab.Pane eventKey="students">
              <StudentManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="marks">
              <MarksManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="courses">
              <CourseManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="analytics">
              <AnalyticsDashboard />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

export default AdminDashboard;

