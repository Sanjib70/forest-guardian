import { Navigate } from 'react-router-dom';

/**
 * Decode JWT payload (without external libraries)
 */
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * ProtectedRoute Component
 * @param {ReactNode} children
 * @param {Array} allowedRoles (optional)
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // ❌ No token → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Check token expiry
  const decoded = decodeToken(token);
  const currentTime = Date.now() / 1000; // seconds

  if (!decoded || decoded.exp < currentTime) {
    // Token expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // 🧑‍⚖️ Role-based access check (if roles are provided)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
