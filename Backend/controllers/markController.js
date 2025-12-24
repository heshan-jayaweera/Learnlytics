const Mark = require('../model/Mark');
const Student = require('../model/Student');
const Course = require('../model/Course');

// Helper function to calculate grade
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Add marks (Admin/Lecturer only)
const addMarks = async (req, res) => {
  try {
    const { studentId, subject, courseCode, course, year, semester, assessmentType, marksObtained, totalMarks, remarks } = req.body;

    // Verify student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify course exists
    const courseDoc = await Course.findOne({ code: courseCode });
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate percentage and grade
    const percentage = (marksObtained / totalMarks) * 100;
    const grade = calculateGrade(percentage);

    const mark = new Mark({
      studentId,
      subject: subject || courseDoc.name,
      courseCode: courseCode || courseDoc.code,
      course: course || courseDoc.name,
      year,
      semester,
      assessmentType,
      marksObtained,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      remarks
    });

    await mark.save();
    res.status(201).json({ message: 'Marks added successfully', mark });
  } catch (error) {
    res.status(500).json({ message: 'Error adding marks', error: error.message });
  }
};

// Update marks (Admin/Lecturer only)
const updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, totalMarks, remarks } = req.body;

    const mark = await Mark.findById(id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark record not found' });
    }

    // Recalculate percentage and grade if marks changed
    if (marksObtained !== undefined || totalMarks !== undefined) {
      const newMarksObtained = marksObtained !== undefined ? marksObtained : mark.marksObtained;
      const newTotalMarks = totalMarks !== undefined ? totalMarks : mark.totalMarks;
      const percentage = (newMarksObtained / newTotalMarks) * 100;
      mark.marksObtained = newMarksObtained;
      mark.totalMarks = newTotalMarks;
      mark.percentage = Math.round(percentage * 100) / 100;
      mark.grade = calculateGrade(percentage);
    }

    if (remarks !== undefined) {
      mark.remarks = remarks;
    }

    await mark.save();
    res.json({ message: 'Marks updated successfully', mark });
  } catch (error) {
    res.status(500).json({ message: 'Error updating marks', error: error.message });
  }
};

// Get all marks (Admin/Lecturer only)
const getAllMarks = async (req, res) => {
  try {
    const { studentId, subject, course, courseCode, year, semester, assessmentType } = req.query;
    let query = {};

    if (studentId) query.studentId = studentId;
    if (subject) query.subject = subject;
    if (course) query.course = course;
    if (courseCode) query.courseCode = courseCode;
    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);
    if (assessmentType) query.assessmentType = assessmentType;

    const marks = await Mark.find(query).sort({ date: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marks', error: error.message });
  }
};

// Get marks for a specific student
const getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, year, semester, courseCode } = req.query;
    
    let query = { studentId };
    if (subject) query.subject = subject;
    if (courseCode) query.courseCode = courseCode;
    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);

    const marks = await Mark.find(query).sort({ date: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student marks', error: error.message });
  }
};

// Get student's own marks (Student role)
const getMyMarks = async (req, res) => {
  try {
    if (req.user.role !== 'student' || !req.user.studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { subject, year, semester, courseCode } = req.query;
    let query = { studentId: req.user.studentId };
    
    if (subject) query.subject = subject;
    if (courseCode) query.courseCode = courseCode;
    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);

    const marks = await Mark.find(query).sort({ date: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marks', error: error.message });
  }
};

// Get marks statistics for analytics
const getMarksStatistics = async (req, res) => {
  try {
    const { course, year, semester, subject } = req.query;
    let query = {};

    if (course) query.course = course;
    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);
    if (subject) query.subject = subject;

    const marks = await Mark.find(query);
    
    const stats = {
      totalRecords: marks.length,
      averagePercentage: marks.length > 0 
        ? Math.round((marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length) * 100) / 100 
        : 0,
      gradeDistribution: {},
      assessmentTypeDistribution: {},
      subjectWiseAverage: {}
    };

    marks.forEach(mark => {
      // Grade distribution
      stats.gradeDistribution[mark.grade] = (stats.gradeDistribution[mark.grade] || 0) + 1;
      
      // Assessment type distribution
      stats.assessmentTypeDistribution[mark.assessmentType] = 
        (stats.assessmentTypeDistribution[mark.assessmentType] || 0) + 1;
      
      // Subject-wise average
      if (!stats.subjectWiseAverage[mark.subject]) {
        stats.subjectWiseAverage[mark.subject] = { total: 0, count: 0 };
      }
      stats.subjectWiseAverage[mark.subject].total += mark.percentage;
      stats.subjectWiseAverage[mark.subject].count += 1;
    });

    // Calculate subject-wise averages
    Object.keys(stats.subjectWiseAverage).forEach(subject => {
      const data = stats.subjectWiseAverage[subject];
      stats.subjectWiseAverage[subject] = Math.round((data.total / data.count) * 100) / 100;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// Delete marks (Admin only)
const deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const mark = await Mark.findByIdAndDelete(id);
    
    if (!mark) {
      return res.status(404).json({ message: 'Mark record not found' });
    }

    res.json({ message: 'Marks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting marks', error: error.message });
  }
};

const gradePointsMap = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0
};

// Calculate GPA for a given studentId
const calculateGpaForStudent = async (studentId) => {
  const marks = await Mark.find({ studentId });
  if (!marks || marks.length === 0) {
    return { gpa: 0, totalCredits: 0, courses: [] };
  }

  const courseCodes = [...new Set(marks.map((m) => m.courseCode).filter(Boolean))];
  const courses = await Course.find({ code: { $in: courseCodes } });
  const courseMap = courses.reduce((acc, c) => {
    acc[c.code] = c;
    return acc;
  }, {});

  const grouped = marks.reduce((acc, mark) => {
    if (!mark.courseCode) return acc;
    acc[mark.courseCode] = acc[mark.courseCode] || [];
    acc[mark.courseCode].push(mark);
    return acc;
  }, {});

  let totalQualityPoints = 0;
  let totalCredits = 0;
  const breakdown = [];

  Object.keys(grouped).forEach((code) => {
    const courseMarks = grouped[code];
    const averagePercentage = courseMarks.reduce((sum, m) => sum + m.percentage, 0) / courseMarks.length;
    const grade = calculateGrade(averagePercentage);
    const gradePoints = gradePointsMap[grade] ?? 0;
    const credits = courseMap[code]?.credits ?? 0;

    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
    breakdown.push({
      courseCode: code,
      courseName: courseMap[code]?.name || courseMarks[0].course,
      credits,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
      grade,
      gradePoints
    });
  });

  const gpa = totalCredits > 0 ? Math.round((totalQualityPoints / totalCredits) * 100) / 100 : 0;

  return {
    gpa,
    totalCredits,
    courses: breakdown
  };
};

const getStudentGpa = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const result = await calculateGpaForStudent(studentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating GPA', error: error.message });
  }
};

const getMyGpa = async (req, res) => {
  try {
    if (req.user.role !== 'student' || !req.user.studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await calculateGpaForStudent(req.user.studentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating GPA', error: error.message });
  }
};

// Export marks data for Power BI (flattened structure)
const exportMarksForPowerBI = async (req, res) => {
  try {
    const marks = await Mark.find({}).lean();
    
    // Flatten the data for Power BI
    const flattenedMarks = marks.map(mark => ({
      markId: mark._id.toString(),
      studentId: mark.studentId,
      subject: mark.subject,
      courseCode: mark.courseCode,
      course: mark.course,
      year: mark.year,
      semester: mark.semester,
      assessmentType: mark.assessmentType,
      marksObtained: mark.marksObtained,
      totalMarks: mark.totalMarks,
      percentage: mark.percentage,
      grade: mark.grade,
      date: mark.date,
      remarks: mark.remarks || '',
      createdAt: mark.createdAt,
      updatedAt: mark.updatedAt
    }));
    
    res.json(flattenedMarks);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting marks data', error: error.message });
  }
};

module.exports = {
  addMarks,
  updateMarks,
  getAllMarks,
  getStudentMarks,
  getMyMarks,
  getMarksStatistics,
  deleteMarks,
  getStudentGpa,
  getMyGpa,
  exportMarksForPowerBI
};

