import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { studentAPI, courseAPI } from '../../services/api';
import SearchableCourseDropdown from './SearchableCourseDropdown';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    courses: [''],
    year: 1,
    semester: 1,
    dateOfBirth: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      // Filter only active courses
      const activeCourses = response.data.filter(course => course.isActive !== false);
      setCourses(activeCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (index, value) => {
    const newCourses = [...formData.courses];
    newCourses[index] = value;
    setFormData({
      ...formData,
      courses: newCourses,
    });
  };

  const handleAddCourse = () => {
    setFormData({
      ...formData,
      courses: [...formData.courses, ''],
    });
  };

  const handleRemoveCourse = (index) => {
    if (formData.courses.length > 1) {
      const newCourses = formData.courses.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        courses: newCourses,
      });
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({
      studentId: '',
      name: '',
      email: '',
      courses: [''],
      year: 1,
      semester: 1,
      dateOfBirth: '',
      contactNumber: '',
    });
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    // Handle both array and string (for backward compatibility)
    const studentCourses = Array.isArray(student.course) 
      ? student.course 
      : (student.course ? [student.course] : ['']);
    
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      courses: studentCourses.length > 0 ? studentCourses : [''],
      year: student.year,
      semester: student.semester,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      contactNumber: student.contactNumber || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter out empty courses and prepare data
    const coursesToSubmit = formData.courses.filter(c => c && c.trim() !== '');
    
    if (coursesToSubmit.length === 0) {
      setError('At least one course is required');
      return;
    }

    const submitData = {
      ...formData,
      course: coursesToSubmit,
    };
    delete submitData.courses; // Remove courses array, use course instead

    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.studentId, submitData);
        setSuccess('Student updated successfully');
      } else {
        await studentAPI.add(submitData);
        setSuccess('Student added successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(studentId);
        setSuccess('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
        <div>
          <h4 className="text-black font-extrabold text-2xl mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            👥 Student Management
          </h4>
          <p className="text-black text-sm mb-0">Manage student records and information</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleAdd} 
          className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-secondary-dark hover:to-accent-dark text-black font-bold py-2.5 px-6 border-0 transition-all duration-300 shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-110 rounded-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">➕</span>
            Add Student
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center p-5 text-black">Loading...</div>
      ) : (
        <Table striped bordered hover responsive className="text-black">
          <thead>
            <tr>
              <th className="text-primary">Student ID</th>
              <th className="text-primary">Name</th>
              <th className="text-primary">Email</th>
              <th className="text-primary">Course</th>
              <th className="text-primary">Year</th>
              <th className="text-primary">Semester</th>
              <th className="text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              // Handle both array and string (for backward compatibility)
              const studentCourses = Array.isArray(student.course) 
                ? student.course 
                : (student.course ? [student.course] : []);
              
              return (
                <tr key={student._id}>
                  <td className="text-black">{student.studentId}</td>
                  <td className="text-black">{student.name}</td>
                  <td className="text-black">{student.email}</td>
                  <td>
                    {studentCourses.length > 0 ? (
                      <div>
                        {studentCourses.map((courseCode, idx) => {
                          const courseDetails = courses.find(c => c.code === courseCode || c.name === courseCode);
                          return (
                            <div key={idx} className="mb-2">
                              {courseDetails ? (
                                <div>
                                  <div>
                                    <Badge bg="primary" className="me-1">{courseDetails.code}</Badge>
                                    <strong className="text-black">{courseDetails.name}</strong>
                                  </div>
                                  {courseDetails.credits && (
                                    <small className="text-black">
                                      {courseDetails.credits} credits
                                      {courseDetails.year && ` • Year ${courseDetails.year}`}
                                      {courseDetails.semester && ` • Semester ${courseDetails.semester}`}
                                    </small>
                                  )}
                                </div>
                              ) : (
                                <Badge bg="secondary">{courseCode}</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-black">No courses</span>
                    )}
                  </td>
                  <td className="text-black">{student.year}</td>
                  <td className="text-black">{student.semester}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2 bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 rounded-lg px-3"
                      onClick={() => handleEdit(student)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 rounded-lg px-3"
                      onClick={() => handleDelete(student.studentId)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-black">{editingStudent ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="text-black">Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                disabled={!!editingStudent}
                className="bg-white border-gray-600 text-black"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white border-gray-600 text-black"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-white border-gray-600 text-black"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0 text-black">Courses</Form.Label>
                <Button
                  variant="outline-success"
                  size="sm"
                  type="button"
                  onClick={handleAddCourse}
                >
                  + Add Course
                </Button>
              </div>
              {formData.courses.map((course, index) => (
                <div key={index} className="mb-2 d-flex align-items-start">
                  <div className="flex-grow-1 me-2">
                    <SearchableCourseDropdown
                      courses={courses.filter(c => {
                        // Filter out already selected courses (except current one)
                        const otherSelectedCourses = formData.courses
                          .filter((_, i) => i !== index)
                          .filter(c => c && c.trim() !== '');
                        return !otherSelectedCourses.includes(c.code);
                      })}
                      value={course}
                      onChange={(e) => handleCourseChange(index, e.target.value)}
                      name={`course-${index}`}
                      required={index === 0}
                    />
                  </div>
                  {formData.courses.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveCourse(index)}
                      style={{ marginTop: '0' }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Form.Text className="text-black">
                Select at least one course. Click "+ Add Course" to add more.
              </Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    min="1"
                    max="5"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-600 text-black"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-600 text-black"
                  >
                    <option value={1} className="bg-white">1</option>
                    <option value={2} className="bg-white">2</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="text-black">Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="bg-white border-gray-600 text-black"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black">Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="bg-white border-gray-600 text-black"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement;

