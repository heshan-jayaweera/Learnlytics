import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Form } from 'react-bootstrap';
import { marksAPI } from '../../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsDashboardCharts = () => {
  const [statistics, setStatistics] = useState(null);
  const [allMarks, setAllMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ course: '', year: '', semester: '' });

  useEffect(() => {
    fetchStatistics();
    fetchAllMarks();
  }, [filter]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filter.course) params.course = filter.course;
      if (filter.year) params.year = filter.year;
      if (filter.semester) params.semester = filter.semester;

      const response = await marksAPI.getStatistics(params);
      setStatistics(response.data);
    } catch (error) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMarks = async () => {
    try {
      const params = {};
      if (filter.course) params.course = filter.course;
      if (filter.year) params.year = filter.year;
      if (filter.semester) params.semester = filter.semester;

      const response = await marksAPI.getAll(params);
      setAllMarks(response.data);
    } catch (error) {
      console.error('Failed to fetch marks');
    }
  };

  // Prepare data for charts
  const gradeDistributionData = statistics
    ? Object.entries(statistics.gradeDistribution).map(([grade, count]) => ({
        name: grade,
        value: count,
      }))
    : [];

  const assessmentTypeData = statistics
    ? Object.entries(statistics.assessmentTypeDistribution).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
      }))
    : [];

  const subjectWiseData = statistics
    ? Object.entries(statistics.subjectWiseAverage).map(([subject, avg]) => ({
        subject,
        average: avg,
      }))
    : [];

  // Performance trend (by date)
  const performanceTrend = allMarks.reduce((acc, mark) => {
    const date = new Date(mark.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    acc[date].total += mark.percentage;
    acc[date].count += 1;
    return acc;
  }, {});

  const trendData = Object.entries(performanceTrend)
    .map(([date, data]) => ({
      date,
      average: (data.total / data.count).toFixed(2),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10); // Last 10 dates

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-gradient-to-r from-accent-alt/10 via-primary/5 to-accent-alt/10 rounded-2xl border border-accent-alt/20 backdrop-blur-sm flex-wrap gap-3">
        <div>
          <h4 className="text-black font-extrabold text-2xl mb-1 bg-gradient-to-r from-accent-alt to-primary bg-clip-text text-transparent">
            📊 Analytics Dashboard
          </h4>
          <p className="text-black text-sm mb-0">Visual insights and performance metrics</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Form.Control
            type="text"
            name="course"
            placeholder="🔍 Filter by course"
            value={filter.course}
            onChange={handleFilterChange}
            className="bg-white/80 border-2 border-gray-300 text-black placeholder-gray-500 focus:border-accent-alt focus:ring-2 focus:ring-accent-alt/50 rounded-lg"
            style={{ width: '200px' }}
          />
          <Form.Control
            type="number"
            name="year"
            placeholder="📅 Year"
            value={filter.year}
            onChange={handleFilterChange}
            className="bg-white/80 border-2 border-gray-300 text-black placeholder-gray-500 focus:border-accent-alt focus:ring-2 focus:ring-accent-alt/50 rounded-lg"
            style={{ width: '100px' }}
          />
          <Form.Select
            name="semester"
            value={filter.semester}
            onChange={handleFilterChange}
            className="bg-white border-2 border-gray-300 text-black focus:border-accent-alt focus:ring-2 focus:ring-accent-alt/50 rounded-lg"
            style={{ width: '150px' }}
          >
            <option value="" className="bg-white">All Semesters</option>
            <option value="1" className="bg-white">Semester 1</option>
            <option value="2" className="bg-white">Semester 2</option>
          </Form.Select>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/50 text-red-200 mb-5 rounded-lg animate-shake">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </Alert>
      )}

      {/* Quick Statistics Cards */}
      {statistics && (
        <Row className="mb-6">
          <Col md={3} className="mb-4">
            <Card className="bg-gradient-to-br from-primary/30 via-primary/15 to-primary/5 border-2 border-primary/50 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative text-center animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card.Body className="relative z-10">
                <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg">📊</span> Total Records
                </Card.Title>
                <h2 className="text-primary text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {statistics.totalRecords}
                </h2>
                <div className="mt-2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto" style={{ width: '60%' }}></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="bg-gradient-to-br from-success/30 via-success/15 to-success/5 border-2 border-success/50 shadow-2xl hover:shadow-success/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative text-center animate-fade-in delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card.Body className="relative z-10">
                <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg">📈</span> Average Percentage
                </Card.Title>
                <h2 className="text-success text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {statistics.averagePercentage}%
                </h2>
                <div className="mt-2 h-1 bg-gradient-to-r from-success to-success/50 rounded-full mx-auto" style={{ width: '60%' }}></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="bg-gradient-to-br from-accent/30 via-accent/15 to-accent/5 border-2 border-accent/50 shadow-2xl hover:shadow-accent/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative text-center animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card.Body className="relative z-10">
                <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg">👥</span> Total Students
                </Card.Title>
                <h2 className="text-accent text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {new Set(allMarks.map((m) => m.studentId)).size}
                </h2>
                <div className="mt-2 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mx-auto" style={{ width: '60%' }}></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="bg-gradient-to-br from-warning/30 via-warning/15 to-warning/5 border-2 border-warning/50 shadow-2xl hover:shadow-warning/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden group relative text-center animate-fade-in delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card.Body className="relative z-10">
                <Card.Title className="text-black text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg">📚</span> Total Subjects
                </Card.Title>
                <h2 className="text-warning text-4xl font-extrabold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {new Set(allMarks.map((m) => m.subject)).size}
                </h2>
                <div className="mt-2 h-1 bg-gradient-to-r from-warning to-warning/50 rounded-full mx-auto" style={{ width: '60%' }}></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {loading ? (
        <div className="text-center p-5 text-black">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row>
          {/* Grade Distribution - Pie Chart */}
          <Col md={6} className="mb-4">
            <Card className="bg-gradient-to-br from-dark-elevated/95 via-dark-surface/95 to-dark-elevated/95 backdrop-blur-sm border-2 border-primary/40 shadow-2xl hover:shadow-primary/30 transition-all duration-500 rounded-2xl overflow-hidden group animate-slide-up">
              <Card.Header className="bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 border-b-2 border-primary/40 backdrop-blur-sm">
                <h5 className="text-black font-bold text-lg flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Grade Distribution
                </h5>
              </Card.Header>
              <Card.Body>
                {gradeDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {gradeDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-black">No data available</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Assessment Type Distribution - Pie Chart */}
          <Col md={6} className="mb-4">
            <Card className="bg-gradient-to-br from-dark-elevated/95 via-dark-surface/95 to-dark-elevated/95 backdrop-blur-sm border-2 border-secondary/40 shadow-2xl hover:shadow-secondary/30 transition-all duration-500 rounded-2xl overflow-hidden group animate-slide-up delay-100">
              <Card.Header className="bg-gradient-to-r from-secondary/30 via-accent/20 to-secondary/30 border-b-2 border-secondary/40 backdrop-blur-sm">
                <h5 className="text-black font-bold text-lg flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  Assessment Type Distribution
                </h5>
              </Card.Header>
              <Card.Body>
                {assessmentTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assessmentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assessmentTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-black">No data available</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Subject-wise Average - Bar Chart */}
          <Col md={6} className="mb-4">
            <Card className="bg-gradient-to-br from-dark-elevated/95 via-dark-surface/95 to-dark-elevated/95 backdrop-blur-sm border-2 border-accent/40 shadow-2xl hover:shadow-accent/30 transition-all duration-500 rounded-2xl overflow-hidden group animate-slide-up delay-200">
              <Card.Header className="bg-gradient-to-r from-accent/30 via-primary/20 to-accent/30 border-b-2 border-accent/40 backdrop-blur-sm">
                <h5 className="text-black font-bold text-lg flex items-center gap-3">
                  <span className="text-2xl">📉</span>
                  Subject-wise Average Percentage
                </h5>
              </Card.Header>
              <Card.Body>
                {subjectWiseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectWiseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="#8884d8" name="Average %" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-black">No data available</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Performance Trend - Line Chart */}
          <Col md={6} className="mb-4">
            <Card className="bg-gradient-to-br from-dark-elevated/95 via-dark-surface/95 to-dark-elevated/95 backdrop-blur-sm border-2 border-accent-alt/40 shadow-2xl hover:shadow-accent-alt/30 transition-all duration-500 rounded-2xl overflow-hidden group animate-slide-up delay-300">
              <Card.Header className="bg-gradient-to-r from-accent-alt/30 via-secondary/20 to-accent-alt/30 border-b-2 border-accent-alt/40 backdrop-blur-sm">
                <h5 className="text-black font-bold text-lg flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  Performance Trend (Last 10 Assessments)
                </h5>
              </Card.Header>
              <Card.Body>
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#8884d8"
                        name="Average %"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-black">No data available</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AnalyticsDashboardCharts;

