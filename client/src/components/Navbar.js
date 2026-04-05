import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getRole, getToken, getUser } from '../utils/auth';

function Navbar() {
    const location = useLocation();
    const role = getRole();
    const token = getToken();
    const user = getUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div className="container mx-auto flex justify-between items-center p-4" style={{ gap: 12 }}>
                <Link to={token ? '/' : '/login'} className="text-xl font-bold" style={{ color: '#111827' }}>
                    Unizoy Job Board
                </Link>

                <div className="flex items-center" style={{ gap: 12 }}>
                    {token ? (
                        <>
                            <Link to="/" style={{ color: '#111827' }} className="hover:underline">Home</Link>
                            {role === 'user' && <Link to="/my-applications" style={{ color: '#111827' }} className="hover:underline">My Applications</Link>}
                            {role === 'admin' && <Link to="/admin" style={{ color: '#111827' }} className="hover:underline">Admin</Link>}
                            {user?.name && <span style={{ color: '#111827', fontWeight: 700 }}>Hi, {user.name}</span>}
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 10,
                                    padding: '0.55rem 1rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: 10,
                                padding: '0.55rem 1rem',
                                fontWeight: 800,
                                display: 'inline-block',
                                opacity: location.pathname === '/login' ? 0.75 : 1,
                                pointerEvents: location.pathname === '/login' ? 'none' : 'auto',
                            }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
