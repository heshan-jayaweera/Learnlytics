import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, FormControl } from 'react-bootstrap';
import { marksAPI, studentAPI, courseAPI } from '../../services/api';
import SearchableCourseDropdown from './SearchableCourseDropdown';

const MarksManagement = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    course: '',
    courseCode: '',
    year: 1,
    semester: 1,
    assessmentType: 'assignment',
    marksObtained: '',
    totalMarks: '',
    remarks: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMarks();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const response = await marksAPI.getAll();
      setMarks(response.data);
    } catch (error) {
      setError('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      // Filter only active courses
      const activeCourses = response.data.filter(course => course.isActive !== false);
      setCourses(activeCourses);
    } catch (error) {
      console.error('Failed to fetch courses');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    const selected = courses.find((c) => c.code === value);
    setFormData({
      ...formData,
      courseCode: value,
      course: selected?.name || '',
      subject: formData.subject || selected?.name || '',
      year: selected?.year || formData.year,
      semester: selected?.semester || formData.semester,
    });
  };

  const handleAdd = () => {
    setEditingMark(null);
    setFormData({
      studentId: '',
      subject: '',
      course: '',
      courseCode: '',
      year: 1,
      semester: 1,
      assessmentType: 'assignment',
      marksObtained: '',
      totalMarks: '',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleEdit = (mark) => {
    setEditingMark(mark);
    setFormData({
      studentId: mark.studentId,
      subject: mark.subject,
      course: mark.course,
      courseCode: mark.courseCode,
      year: mark.year,
      semester: mark.semester,
      assessmentType: mark.assessmentType,
      marksObtained: mark.marksObtained,
      totalMarks: mark.totalMarks,
      remarks: mark.remarks || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingMark) {
        await marksAPI.update(editingMark._id, {
          marksObtained: parseFloat(formData.marksObtained),
          totalMarks: parseFloat(formData.totalMarks),
          remarks: formData.remarks,
        });
        setSuccess('Marks updated successfully');
      } else {
        await marksAPI.add({
          ...formData,
          marksObtained: parseFloat(formData.marksObtained),
          totalMarks: parseFloat(formData.totalMarks),
        });
        setSuccess('Marks added successfully');
      }
      setShowModal(false);
      fetchMarks();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (markId) => {
    if (window.confirm('Are you sure you want to delete this mark record?')) {
      try {
        await marksAPI.delete(markId);
        setSuccess('Marks deleted successfully');
        fetchMarks();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete marks');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-gradient-to-r from-secondary/10 via-accent/5 to-secondary/10 rounded-2xl border border-secondary/20 backdrop-blur-sm">
        <div>
          <h4 className="text-black font-extrabold text-2xl mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            📝 Marks Management
          </h4>
          <p className="text-black text-sm mb-0">Add and manage student marks and assessments</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleAdd} 
          className="bg-gradient-to-r from-secondary via-accent to-secondary hover:from-secondary-dark hover:via-accent-dark hover:to-secondary-dark text-black font-bold py-2.5 px-6 border-0 transition-all duration-300 shadow-2xl shadow-secondary/50 hover:shadow-secondary/70 hover:scale-110 rounded-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">➕</span>
            Add Marks
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center p-8 text-black">
          <div className="inline-block">
            <div className="spinner-border text-secondary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-lg font-semibold animate-pulse">Loading marks...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-dark-elevated/50 to-dark-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-secondary/20 shadow-2xl">
          <Table striped bordered hover responsive className="text-black mb-0">
          <thead>
            <tr>
              <th className="text-primary">Student ID</th>
              <th className="text-primary">Course Code</th>
              <th className="text-primary">Course/Subject</th>
              <th className="text-primary">Assessment</th>
              <th className="text-primary">Marks</th>
              <th className="text-primary">Percentage</th>
              <th className="text-primary">Grade</th>
              <th className="text-primary">Date</th>
              <th className="text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark) => {
              // Find course details for better display
              const courseDetails = courses.find(c => c.code === mark.courseCode);
              return (
                <tr key={mark._id}>
                  <td className="text-black">{mark.studentId}</td>
                  <td><strong className="text-black">{mark.courseCode}</strong></td>
                  <td>
                    {courseDetails ? (
                      <div>
                        <div><strong className="text-black">{courseDetails.name}</strong></div>
                        {mark.subject !== courseDetails.name && (
                          <small className="text-black">Subject: {mark.subject}</small>
                        )}
                      </div>
                    ) : (
                      <span className="text-black">{mark.subject || mark.course}</span>
                    )}
                  </td>
                  <td className="text-black">{mark.assessmentType}</td>
                  <td className="text-black font-medium">{mark.marksObtained} / {mark.totalMarks}</td>
                  <td className="text-accent font-medium">{mark.percentage}%</td>
                  <td className="text-secondary font-medium">{mark.grade}</td>
                  <td className="text-black">{new Date(mark.date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2 bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 rounded-lg px-3"
                      onClick={() => handleEdit(mark)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 rounded-lg px-3"
                      onClick={() => handleDelete(mark._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-black">{editingMark ? 'Edit Marks' : 'Add Marks'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Form.Select
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                disabled={!!editingMark}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student.studentId}>
                    {student.studentId} - {student.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <SearchableCourseDropdown
                    courses={courses}
                    value={formData.courseCode}
                    onChange={handleCourseChange}
                    name="courseCode"
                    required
                    disabled={!!editingMark}
                  />
                  <Form.Text className="text-muted">
                    Subject will be automatically set to the course name
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    min="1"
                    max="5"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingMark}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingMark}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Assessment Type</Form.Label>
              <Form.Select
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleInputChange}
                required
                disabled={!!editingMark}
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="project">Project</option>
                <option value="lab">Lab</option>
              </Form.Select>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Marks Obtained</Form.Label>
                  <Form.Control
                    type="number"
                    name="marksObtained"
                    min="0"
                    step="0.01"
                    value={formData.marksObtained}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalMarks"
                    min="0"
                    step="0.01"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingMark ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MarksManagement;

