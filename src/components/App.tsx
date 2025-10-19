import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import { Content } from "./Content";
import { Login } from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";

export default function App()
{
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <main>
                                    <Content />
                                </main>
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}