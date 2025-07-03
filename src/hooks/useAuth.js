import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { user, login, logout, isAuthenticated, role } = useContext(AuthContext);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    role,
  };
};

export default useAuth;