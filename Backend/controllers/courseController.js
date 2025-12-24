const Course = require('../model/Course');

// Create a new course (Admin only)
const createCourse = async (req, res) => {
  try {
    const { code, name, credits, year, semester, description, isActive } = req.body;

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }

    const course = new Course({
      code,
      name,
      credits,
      year,
      semester,
      description,
      isActive
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses (any authenticated user)
const getCourses = async (req, res) => {
  try {
    const { year, semester, isActive } = req.query;
    const query = {};

    if (year) query.year = parseInt(year);
    if (semester) query.semester = parseInt(semester);
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const courses = await Course.find(query).sort({ code: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Flattened export for BI tools (stringified IDs/dates)
const getCoursesForPowerBI = async (_req, res) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    const flattened = courses.map((c) => ({
      id: c._id.toString(),
      code: c.code,
      name: c.name,
      credits: Number(c.credits),
      year: c.year ?? null,
      semester: c.semester ?? null,
      description: c.description || '',
      isActive: Boolean(c.isActive),
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
      updatedAt: c.updatedAt ? c.updatedAt.toISOString() : null,
    }));
    res.json(flattened);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting courses', error: error.message });
  }
};

// Get a single course by code
const getCourseByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findOne({ code: code.toUpperCase() });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update a course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body;

    const course = await Course.findOneAndUpdate(
      { code: code.toUpperCase() },
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete a course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findOneAndDelete({ code: code.toUpperCase() });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCoursesForPowerBI,
  getCourseByCode,
  updateCourse,
  deleteCourse
};

