import React from 'react';
import Login from './components/Login/Login'; 
import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users'
import Parks from './components/Parks/Parks'
import Reports from './components/Reports/Reports';
import ProtectedRoute from './navigation/ProtectedRoute';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router



  function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/parks" 
          element={
            <ProtectedRoute>
              <Parks />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;