const Student = require('../model/Student');
const User = require('../model/User');

// Get all students (Admin/Lecturer only)
const getAllStudents = async (req, res) => {
  try {
    const { course, year, semester } = req.query;
    let query = {};

    if (course) {
      // Search for students who have the course in their courses array
      const courseFilter = Array.isArray(course) ? course : [course];
      query.course = { $in: courseFilter };
    }
    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);

    const students = await Student.find(query).sort({ studentId: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ studentId: id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

// Add new student (Admin/Lecturer only)
const addStudent = async (req, res) => {
  try {
    const { studentId, name, email, course, year, semester, dateOfBirth, contactNumber } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ studentId }, { email }] 
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student already exists with this Student ID or Email' 
      });
    }

    // Normalize course to array (support both single course and array)
    let coursesArray = [];
    if (Array.isArray(course)) {
      coursesArray = course.filter(c => c && c.trim() !== '');
    } else if (course) {
      coursesArray = [course];
    }

    if (coursesArray.length === 0) {
      return res.status(400).json({ 
        message: 'At least one course is required' 
      });
    }

    const student = new Student({
      studentId,
      name,
      email,
      course: coursesArray,
      year,
      semester,
      dateOfBirth,
      contactNumber
    });

    await student.save();
    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

// Update student (Admin/Lecturer only)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Normalize course to array if provided
    if (updates.course !== undefined) {
      if (Array.isArray(updates.course)) {
        updates.course = updates.course.filter(c => c && c.trim() !== '');
      } else if (updates.course) {
        updates.course = [updates.course];
      } else {
        updates.course = [];
      }

      if (updates.course.length === 0) {
        return res.status(400).json({ 
          message: 'At least one course is required' 
        });
      }
    }

    const student = await Student.findOneAndUpdate(
      { studentId: id },
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOneAndDelete({ studentId: id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also delete associated user account if exists
    await User.findOneAndDelete({ studentId: id });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

// Get student's own profile (Student role)
const getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'student' || !req.user.studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findOne({ studentId: req.user.studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Export students data for Power BI
const exportStudentsForPowerBI = async (req, res) => {
  try {
    const students = await Student.find({}).lean();
    
    // Flatten the data for Power BI
    const flattenedStudents = students.flatMap(student => {
      // If student has multiple courses, create one row per course
      const courses = Array.isArray(student.course) ? student.course : [student.course];
      return courses.map(course => ({
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        course: course,
        year: student.year,
        semester: student.semester,
        dateOfBirth: student.dateOfBirth,
        contactNumber: student.contactNumber || '',
        address: student.address || '',
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }));
    });
    
    res.json(flattenedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting students data', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  exportStudentsForPowerBI
};

