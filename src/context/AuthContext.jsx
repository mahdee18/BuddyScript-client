import { createContext, useState, useEffect, useContext, useMemo } from 'react'; 
import { registerUser, loginUser, getMe } from '../api/auth';
import ClipLoader from "react-spinners/ClipLoader";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await getMe(); 
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []); 

  const registerAction = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    const { token, ...userDataWithoutToken } = data;
    setUser(userDataWithoutToken);
    return data;
  };

  const loginAction = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    const { token, ...userDataWithoutToken } = data;
    setUser(userDataWithoutToken);
    return data;
  };

  const logOut = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const authContextValue = useMemo(
    () => ({ token, user, loading, registerAction, loginAction, logOut }),
    [token, user, loading] 
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F3F5F9' }}>
        <ClipLoader color={"#3b82f6"} size={50} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};