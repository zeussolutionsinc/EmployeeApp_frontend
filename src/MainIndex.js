import React from 'react';
// import { useEffect } from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements  } from 'react-router-dom';
import './index.css';
import "./App.css";
import { CallbackPage } from './pages/callback-page';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate';
import { AuthenticationGuard } from './components/authentication-guard';
import RootLayout from './routes/RootLayout';
import H1bLanding from './components/h1b/H1bLandingPage';
import EmployeeSignup, { action as employeeSignupAction } from './components/singup/employee_signup'
import HomePage from './pages/HomePage';
import { AuthProvider} from './AuthContext';
import Thankyou from './pages/Thankyou';
import H1bAdmin from './components/h1badmin/H1bAdmin';

// // Function to check if the user is authenticated
// const isAuthenticated = () => {
//   return localStorage.getItem('isAuthenticated') === 'true';
// };

// AuthGuard component to protect routes
// const AuthGuard = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//       if (!isAuthenticated()) {
//           navigate('/'); // Redirect to landing page if not authenticated
//       }
//   }, [navigate]);

//   return isAuthenticated() ? children : null;
// };

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Auth0ProviderWithNavigate />} >
        <Route path='/' element={<RootLayout />}></Route>
          <Route path="/signup" element={<EmployeeSignup />} action={employeeSignupAction} />
          <Route path='/home' element={<AuthenticationGuard component={HomePage} />} />  {/* Protected HomePage route */}
          <Route path='/callback' element={<AuthenticationGuard component={CallbackPage} />}></Route>
          <Route path='/h1bform' element={<AuthenticationGuard component={H1bLanding} />}></Route>
          <Route path='/thankyou' element={<AuthenticationGuard component={Thankyou} />}></Route>
          <Route path='/admin' element={<AuthenticationGuard component={H1bAdmin} />}></Route>

     
      </Route>
    )
);

function Main() {
  return (
    <AuthProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthProvider>
  );
}

export default Main;