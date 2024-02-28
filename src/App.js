import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    department: '',
    dob: '',
    gender: '',
    designation: '',
    salary: '',
    designationOptions: []
  });

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchKeyword !== '') {
      fetchSearchResults();
    } else {
      fetchEmployees();
    }
  }, [currentPage, searchKeyword]);

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`http://localhost:3001/search?keyword=${searchKeyword}&page=${currentPage}`);
      const data = await response.json();
      setSearchResults(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:3001/employees?page=${currentPage}`);
      const data = await response.json();
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let designationOptions = [];
    switch (value) {
      case 'IT':
        designationOptions = [
          'Software Engineer/Developer',
          'Systems Administrator',
          'Network Engineer',
          'Database Administrator (DBA)',
          'IT Project Manager',
          'IT Security Specialist',
          'Data Analyst'
        ];
        break;
      case 'HR':
        designationOptions = [
          'HR Consultant',
          'HR Administrator',
          'HR Manager',
          'HR Generalist',
          'HR Director'
        ];
        break;
      case 'Finance':
        designationOptions = [
          'Financial Analyst',
          'IT Auditor',
          'Budget Analyst',
          'IT Procurement Specialist',
          'Cost Accountant',
          'IT Financial Manager',
          'Financial Controller'
        ];
        break;
      default:
        break;
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      designation: '', // Reset designation when department changes
      designationOptions: designationOptions
    }));
  };

  const handleDesignationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      alert(data.message);
      setFormData({
        name: '',
        id: '',
        department: '',
        dob: '',
        gender: '',
        designation: '',
        salary: '',
        designationOptions: []
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const press = (id) => {
    axios.post("http://localhost:3001/deletedata", { id: id })
      .then(response => {
        fetchEmployees();
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      });
  }

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const maxDate = new Date(2006, 11, 31);

    const birthDate = new Date(dateOfBirth);
    let age = maxDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = maxDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && maxDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(2024, 1, 28).toISOString().split('T')[0]; // Set max date for date input


  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="employee-form">
          <div>
            <label htmlFor="name">Employee Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} maxLength={30} required />
          </div>
          <div>
            <label htmlFor="id">Employee ID:</label>
            <input type="number" id="id" name="id" value={formData.id} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="department">Department:</label>
            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div>
            <label htmlFor="dob">Date of Birth:</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} max={maxDate} required />
          </div>
          <div>
            <label>Gender:</label>
            <label>
              <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} required /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
            </label>
          </div>
          <div>
            <label htmlFor="designation">Designation:</label>
            <select id="designation" name="designation" value={formData.designation} onChange={handleDesignationChange} required>
              <option value="">Select Designation</option>
              {formData.designationOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {formData.designation && (
              <p>Selected Designation: {formData.designation}</p>
            )}
          </div>
          <div>
            <label htmlFor="salary">Salary:</label>
            <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} max={99999999} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="employee-table">
        <h2>Employee Data</h2>
        <div className="search-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search employees..."
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Department</th>
              <th>DOB</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.id}</td>
                  <td>{employee.department}</td>
                  <td>{employee.dob.substring(0, 10).split('-').reverse().join('/')}</td>
                  <td>{calculateAge(employee.dob)}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.salary}</td>
                  <td><button className="ss" onClick={() => press(employee.id)}>Delete</button></td>
                </tr>
              ))
            ) : searchKeyword !== '' ? (
              <tr>
                <td colSpan="9">No Data</td>
              </tr>
            ) : (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.id}</td>
                  <td>{employee.department}</td>
                  <td>{employee.dob.substring(0, 10).split('-').reverse().join('/')}</td>
                  <td>{calculateAge(employee.dob)}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.salary}</td>
                  <td><button className="ss" onClick={() => press(employee.id)}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: searchResults.length > 0 ? totalPages : totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default App;
