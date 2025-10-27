import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if token exists in localStorage on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            validateToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const validateToken = async (tokenToValidate: string) => {
        try {
            const response = await fetch(`https://listapi.${window.location.hostname.split('.')[1].split('.')[1]}/api/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${tokenToValidate}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    setUser({
                        username: data.username,
                        email: data.email
                    });
                    setToken(tokenToValidate);
                } else {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } else {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`https://listapi.${window.location.hostname.split('.')[1]}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser({
                username: data.username,
                email: data.email
            });
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
