import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Unizoy Job Board</Link>
                <div className="flex space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    {role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
                    <button onClick={handleLogout} className="hover:underline">Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;