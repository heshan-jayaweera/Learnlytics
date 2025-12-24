import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { courseAPI } from '../../services/api';

const defaultForm = {
  code: '',
  name: '',
  credits: 3,
  year: '',
  semester: '',
  description: '',
  isActive: true,
};

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits,
      year: course.year || '',
      semester: course.semester || '',
      description: course.description || '',
      isActive: course.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCourse) {
        await courseAPI.update(editingCourse.code, formData);
        setSuccess('Course updated successfully');
      } else {
        await courseAPI.add(formData);
        setSuccess('Course created successfully');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (code) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(code);
        setSuccess('Course deleted successfully');
        fetchCourses();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-2xl border border-accent/20 backdrop-blur-sm">
        <div>
          <h4 className="text-black font-extrabold text-2xl mb-1 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            📖 Course Management
          </h4>
          <p className="text-gray-400 text-sm mb-0">Create and manage academic courses</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleAdd} 
          className="bg-gradient-to-r from-accent via-primary to-accent hover:from-accent-dark hover:via-primary-dark hover:to-accent-dark text-black font-bold py-2.5 px-6 border-0 transition-all duration-300 shadow-2xl shadow-accent/50 hover:shadow-accent/70 hover:scale-110 rounded-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">➕</span>
            Add Course
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center p-8 text-black">
          <div className="inline-block">
            <div className="spinner-border text-accent mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-lg font-semibold animate-pulse">Loading courses...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-dark-elevated/50 to-dark-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-accent/20 shadow-2xl">
          <Table striped bordered hover responsive className="text-black mb-0">
          <thead>
            <tr>
              <th className="text-primary">Code</th>
              <th className="text-primary">Name</th>
              <th className="text-primary">Credits</th>
              <th className="text-primary">Year</th>
              <th className="text-primary">Semester</th>
              <th className="text-primary">Status</th>
              <th className="text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="text-black font-medium">{course.code}</td>
                <td className="text-black">{course.name}</td>
                <td className="text-black">{course.credits}</td>
                <td className="text-black">{course.year || '-'}</td>
                <td className="text-black">{course.semester || '-'}</td>
                <td>
                  {course.isActive ? (
                    <span className="text-success font-medium">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2 bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 rounded-lg px-3"
                    onClick={() => handleEdit(course)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-black font-semibold border-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 rounded-lg px-3"
                    onClick={() => handleDelete(course.code)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-black">{editingCourse ? 'Edit Course' : 'Add Course'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                disabled={!!editingCourse}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Control
                    type="number"
                    name="credits"
                    min="0"
                    step="0.5"
                    value={formData.credits}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Year (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    min="1"
                    max="5"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Semester (optional)</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="">Not set</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="isActive"
              name="isActive"
              label="Active"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCourse ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;

