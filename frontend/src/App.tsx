import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureApi } from './apiConfig';
configureApi();
import { useAuthStore } from './store/authStore';
import { UsersService } from './api';

import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GraphView } from './pages/GraphView';
import { SubmitProblem } from './pages/SubmitProblem';

export const App: React.FC = () => {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
    // Attempt to restore user profile on load if token exists

    // Attempt to restore user profile on load if token exists
    if (token) {
      UsersService.usersCurrentUserUsersMeGet()
        .then(setUser)
        .catch(() => {
          logout();
        });
    }
  }, [token, setUser, logout]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GraphView />} />
          <Route path="problems" element={<SubmitProblem />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
