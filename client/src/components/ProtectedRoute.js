import { Navigate } from 'react-router-dom';
import { getRole, getToken } from '../utils/auth';

function ProtectedRoute({ children, requiredRole }) {
    const token = getToken();
    const role = getRole();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
