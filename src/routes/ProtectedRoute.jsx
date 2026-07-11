import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/desktop" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
