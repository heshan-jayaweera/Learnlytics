import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import { marksAPI, studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [marks, setMarks] = useState([]);
  const [student, setStudent] = useState(null);
  const [gpaSummary, setGpaSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    year: '',
    semester: '',
  });

  useEffect(() => {
    fetchMyProfile();
    fetchMyMarks();
    fetchMyGpa();
  }, []);

  useEffect(() => {
    fetchMyMarks();
  }, [filters]);

  const fetchMyProfile = async () => {
    try {
      const response = await studentAPI.getMyProfile();
      setStudent(response.data);
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchMyMarks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.year) params.year = filters.year;
      if (filters.semester) params.semester = filters.semester;

      const response = await marksAPI.getMyMarks(params);
      setMarks(response.data);
    } catch (error) {
      console.error('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGpa = async () => {
    try {
      const response = await marksAPI.getMyGpa();
      setGpaSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch GPA');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate overall statistics
  const calculateStats = () => {
    if (marks.length === 0) return null;

    const totalMarks = marks.reduce((sum, m) => sum + m.marksObtained, 0);
    const totalPossible = marks.reduce((sum, m) => sum + m.totalMarks, 0);
    const averagePercentage = totalPossible > 0 
      ? ((totalMarks / totalPossible) * 100).toFixed(2) 
      : 0;

    return {
      totalRecords: marks.length,
      averagePercentage,
      totalMarks,
      totalPossible,
    };
  };

  const stats = calculateStats();

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Container fluid className="mt-6 px-4 pb-6">
        <div className="mb-8 relative">
          <h2 className="text-black text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            My Dashboard
          </h2>
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
        </div>

        {/* Student Profile Card */}
        {student && (
          <Card className="mb-6 bg-white backdrop-blur-sm border-2 border-primary/40 shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-[1.01] rounded-2xl overflow-hidden group">
            <Card.Header className="bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 border-b-2 border-primary/40 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <h5 className="text-black font-bold text-xl mb-0 relative z-10 flex items-center gap-3">
                <span className="text-2xl animate-bounce">👤</span>
                Student Profile
              </h5>
            </Card.Header>
            <Card.Body className="bg-white">
              <Row>
                <Col md={6}>
                  <p className="text-black mb-2"><strong className="text-primary">Student ID:</strong> <span className="text-black">{student.studentId}</span></p>
                  <p className="text-black mb-2"><strong className="text-primary">Name:</strong> <span className="text-black">{student.name}</span></p>
                  <p className="text-black mb-2"><strong className="text-primary">Email:</strong> <span className="text-black">{student.email}</span></p>
                  {student.contactNumber && (
                    <p className="text-black mb-2"><strong className="text-primary">Contact Number:</strong> <span className="text-black">{student.contactNumber}</span></p>
                  )}
                </Col>
                <Col md={6}>
                  {student.dateOfBirth && (
                    <p className="text-black mb-2"><strong className="text-secondary">Date of Birth:</strong> <span className="text-black">{new Date(student.dateOfBirth).toLocaleDateString()}</span></p>
                  )}
                  <p className="text-black mb-2"><strong className="text-secondary">Year:</strong> <span className="text-black">{student.year}</span></p>
                  <p className="text-black mb-2"><strong className="text-secondary">Semester:</strong> <span className="text-black">{student.semester}</span></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* GPA Summary */}
        {gpaSummary && (
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-to-br from-primary/30 via-primary/15 to-primary/5 border-2 border-primary/50 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">⭐</span> Overall GPA
                  </Card.Title>
                  <h3 className="text-primary text-5xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {gpaSummary.gpa?.toFixed(2) || '0.00'}
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-to-br from-secondary/30 via-secondary/15 to-secondary/5 border-2 border-secondary/50 shadow-2xl hover:shadow-secondary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">📚</span> Total Credits
                  </Card.Title>
                  <h3 className="text-secondary text-5xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {gpaSummary.totalCredits || 0}
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="bg-white backdrop-blur-sm border-2 border-accent/40 shadow-2xl hover:shadow-accent/30 transition-all duration-500 rounded-2xl overflow-hidden group">
                <Card.Body>
                  <Card.Title className="text-black font-bold text-lg mb-4 border-b-2 border-accent/40 pb-3 flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    Course Breakdown
                  </Card.Title>
                  {gpaSummary.courses && gpaSummary.courses.length > 0 ? (
                    <Table striped bordered hover responsive size="sm" className="mb-0 text-black">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-accent border-accent/30">Course</th>
                          <th className="text-accent border-accent/30">Credits</th>
                          <th className="text-accent border-accent/30">Grade</th>
                          <th className="text-accent border-accent/30">Avg %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gpaSummary.courses.map((course) => (
                          <tr key={course.courseCode} className="hover:bg-gray-100/50 transition-colors">
                            <td className="border-gray-300">
                              <div className="fw-bold text-black">{course.courseCode}</div>
                              <div className="text-black text-xs">{course.courseName}</div>
                            </td>
                            <td className="border-gray-300 text-black">{course.credits}</td>
                            <td className="border-gray-300 text-accent font-medium">{course.grade} ({course.gradePoints})</td>
                            <td className="border-gray-300 text-black">{course.averagePercentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-black">No course results yet</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Statistics */}
        {stats && (
          <Row className="mb-6">
            <Col md={3} className="mb-4">
              <Card className="bg-gradient-to-br from-primary/30 via-primary/15 to-primary/5 border-2 border-primary/50 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">📊</span> Total Records
                  </Card.Title>
                  <h3 className="text-primary text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stats.totalRecords}
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="bg-gradient-to-br from-accent/30 via-accent/15 to-accent/5 border-2 border-accent/50 shadow-2xl hover:shadow-accent/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative animate-fade-in delay-100">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">📈</span> Average Percentage
                  </Card.Title>
                  <h3 className="text-accent text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stats.averagePercentage}%
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="bg-gradient-to-br from-secondary/30 via-secondary/15 to-secondary/5 border-2 border-secondary/50 shadow-2xl hover:shadow-secondary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative animate-fade-in delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">✅</span> Total Marks
                  </Card.Title>
                  <h3 className="text-secondary text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stats.totalMarks.toFixed(2)}
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="bg-gradient-to-br from-accent-alt/30 via-accent-alt/15 to-accent-alt/5 border-2 border-accent-alt/50 shadow-2xl hover:shadow-accent-alt/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative animate-fade-in delay-300">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-alt/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card.Body className="relative z-10">
                  <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">🎯</span> Total Possible
                  </Card.Title>
                  <h3 className="text-accent-alt text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stats.totalPossible.toFixed(2)}
                  </h3>
                  <div className="mt-2 h-1 bg-gradient-to-r from-accent-alt to-accent-alt/50 rounded-full"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters */}
        <Card className="mb-6 bg-white backdrop-blur-sm border-2 border-primary/40 shadow-2xl hover:shadow-primary/30 transition-all duration-500 rounded-2xl overflow-hidden group">
          <Card.Header className="bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 border-b-2 border-primary/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <h5 className="text-black font-bold text-lg mb-0 relative z-10 flex items-center gap-3">
              <span className="text-2xl animate-spin-slow">🔍</span>
              Filters
            </h5>
          </Card.Header>
          <Card.Body className="bg-white">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-black font-medium">Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Filter by subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    className="bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-black font-medium">Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    placeholder="Filter by year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-secondary focus:ring-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-black font-medium">Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={filters.semester}
                    onChange={handleFilterChange}
                    className="bg-gray-100 border-gray-300 text-black focus:border-accent focus:ring-accent"
                  >
                    <option value="" className="bg-gray-100">All Semesters</option>
                    <option value="1" className="bg-gray-100">Semester 1</option>
                    <option value="2" className="bg-gray-100">Semester 2</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Marks Table */}
        <Card className="bg-white backdrop-blur-sm border-2 border-secondary/40 shadow-2xl hover:shadow-secondary/30 transition-all duration-500 rounded-2xl overflow-hidden group">
          <Card.Header className="bg-gradient-to-r from-secondary/30 via-accent/20 to-secondary/30 border-b-2 border-secondary/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <h5 className="text-black font-bold text-lg mb-0 relative z-10 flex items-center gap-3">
              <span className="text-2xl">📋</span>
              My Results
            </h5>
          </Card.Header>
          <Card.Body className="bg-white">
            {loading ? (
              <div className="text-center p-5 text-black">Loading...</div>
            ) : marks.length === 0 ? (
              <Alert variant="info" className="bg-accent/20 border-accent/50 text-accent">
                No marks found
              </Alert>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <Table striped bordered hover responsive className="text-black mb-0">
                  <thead className="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20">
                    <tr>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">📚 Subject</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">📝 Assessment Type</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">✅ Marks Obtained</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">📊 Total Marks</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">📈 Percentage</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">🏆 Grade</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">📅 Date</th>
                      <th className="text-primary border-primary/30 font-bold py-3 px-4">💬 Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark, index) => (
                      <tr 
                        key={mark._id} 
                        className="hover:bg-gradient-to-r hover:from-primary/10 hover:via-secondary/5 hover:to-accent/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 border-gray-300/50 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="border-gray-300/50 text-black py-3 px-4 font-medium">{mark.subject}</td>
                        <td className="border-gray-300/50 text-black py-3 px-4">{mark.assessmentType}</td>
                        <td className="border-gray-300/50 text-black font-bold py-3 px-4 text-lg">{mark.marksObtained}</td>
                        <td className="border-gray-300/50 text-black py-3 px-4">{mark.totalMarks}</td>
                        <td className="border-gray-300/50 text-accent font-bold py-3 px-4 text-lg">{mark.percentage}%</td>
                        <td className="border-gray-300/50 py-3 px-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/50">
                            <strong className="text-secondary text-lg">{mark.grade}</strong>
                          </span>
                        </td>
                        <td className="border-gray-300/50 text-black py-3 px-4">{new Date(mark.date).toLocaleDateString()}</td>
                        <td className="border-gray-300/50 text-black py-3 px-4 italic">{mark.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StudentDashboard;

