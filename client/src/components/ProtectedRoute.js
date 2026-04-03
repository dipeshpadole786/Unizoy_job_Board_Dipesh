import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
    const role = localStorage.getItem('role');

    if (!role) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;