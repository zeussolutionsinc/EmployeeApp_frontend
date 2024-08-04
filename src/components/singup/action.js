import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Employee_signup, { action as employeeSignupAction } from './components/signup/employee_signup';
// Import other components and actions as needed

function action_signup() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Employee_signup />} action={employeeSignupAction} />
        {/* Define other routes */}
      </Routes>
    </Router>
  );
}

export default action_signup;
