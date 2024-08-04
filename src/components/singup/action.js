import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeSignup, { action as employeeSignupAction } from './components/signup/employee_signup';
// Import other components and actions as needed

function action_signup() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<EmployeeSignup />} action={employeeSignupAction} />
      </Routes>
    </Router>
  );
}

export default action_signup;
