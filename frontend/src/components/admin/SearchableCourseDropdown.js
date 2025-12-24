import React, { useState, useRef, useEffect } from 'react';
import { InputGroup, FormControl, ListGroup } from 'react-bootstrap';

const SearchableCourseDropdown = ({ courses, value, onChange, name, required, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Find selected course when value changes
  useEffect(() => {
    if (value && courses.length > 0) {
      const course = courses.find(c => c.code === value || c.name === value);
      setSelectedCourse(course || null);
      if (course) {
        setSearchTerm(`${course.code} - ${course.name}`);
      } else {
        setSearchTerm(value);
      }
    } else {
      setSelectedCourse(null);
      setSearchTerm('');
    }
  }, [value, courses]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      course.code.toLowerCase().includes(search) ||
      course.name.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    
    // If input is cleared, clear selection
    if (!value) {
      setSelectedCourse(null);
      onChange({ target: { name, value: '' } });
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchTerm(`${course.code} - ${course.name}`);
    setShowDropdown(false);
    onChange({ target: { name, value: course.code } });
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      if (!selectedCourse && searchTerm) {
        setSearchTerm('');
      }
    }, 200);
  };

  return (
    <div style={{ position: 'relative' }}>
      <InputGroup>
        <FormControl
          ref={inputRef}
          type="text"
          placeholder="Search courses by code or name..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          required={required}
          disabled={disabled}
          autoComplete="off"
        />
        <InputGroup.Text>
          🔍
        </InputGroup.Text>
      </InputGroup>
      
      {showDropdown && filteredCourses.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            marginTop: '2px'
          }}
        >
          <ListGroup variant="flush">
            {filteredCourses.map((course) => (
              <ListGroup.Item
                key={course._id || course.code}
                action
                onClick={() => handleCourseSelect(course)}
                style={{
                  cursor: 'pointer',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderColor: '#475569'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                <div>
                  <strong className="text-black">{course.code}</strong> <span className="text-black">- {course.name}</span>
                  {course.credits && (
                    <span className="text-black ms-2">({course.credits} credits)</span>
                  )}
                </div>
                {course.description && (
                  <small className="text-black d-block mt-1">
                    {course.description.length > 60 
                      ? `${course.description.substring(0, 60)}...` 
                      : course.description}
                  </small>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      
      {showDropdown && filteredCourses.length === 0 && searchTerm && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.375rem',
            padding: '0.75rem 1rem',
            marginTop: '2px',
            color: '#000000'
          }}
        >
          <div>No courses found</div>
        </div>
      )}
    </div>
  );
};

export default SearchableCourseDropdown;

