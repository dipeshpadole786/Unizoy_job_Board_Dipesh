import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Apply from './pages/Apply';
import MyApplications from './pages/MyApplications';
import AdminApplications from './pages/AdminApplications';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-applications"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <MyApplications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/jobs/:jobId/applications"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminApplications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/apply/:jobId"
                        element={
                            <ProtectedRoute>
                                <Apply />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<p>Page not found</p>} />
                </Routes>
            </main>
            <footer className="bg-gray-200 text-center p-4 mt-8">Built with MERN • Unizoy Job Board</footer>
        </div>
    );
}

export default App;
