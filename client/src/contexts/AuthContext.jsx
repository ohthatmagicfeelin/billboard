// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import { authService } from '@/features/auth/services/authService';
import { resetCsrfToken } from '@/common/services/csrfService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  initialized: false
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return { ...state, loading: true };

    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        initialized: true
      };

    case 'AUTH_INIT_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: true
      };

    case 'AUTH_INIT_COMPLETE':
      return {
        ...state,
        loading: false,
        initialized: true
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null

      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {

  const [state, dispatch] = useReducer(authReducer, initialState);
  const mounted = useRef(false);


  useEffect(() => {
    mounted.current = true;
    let timeoutId;
    
    async function initAuth() {
      if (!mounted.current) return;
      
      dispatch({ type: 'AUTH_INIT_START' });
      
      try {
        console.log("validating session")
        const response = await authService.validateSession();
        
        if (!mounted.current) return; // If component is unmounted, stop execution
        
        if (response.data?.user) {
          // If user is authenticated, set the user and dispatch success
          dispatch({ 
            type: 'AUTH_INIT_SUCCESS', 
            payload: response.data.user 
          });
        } else {
          // If user is not authenticated, dispatch completion
          dispatch({ type: 'AUTH_INIT_COMPLETE' });
        }
      } catch (error) {
        if (!mounted.current) return;
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_INIT_ERROR', payload: error.message });
      }
    }

    // Prevent multiple simultaneous validation attempts
    if (!state.initialized && state.loading) {
      console.log("initAuth")
      initAuth();
    }

    return () => {
      mounted.current = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state.initialized, state.loading]);


  const value = useMemo(() => ({
    ...state,
    login: async (credentials) => {
      try {
        const { user } = await authService.login(credentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return user;
      } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', payload: error.message });
        throw error;
      }
    },
    logout: async () => {
      try {
        await authService.logout();
        localStorage.removeItem('auth_initialized');
        resetCsrfToken(); // Reset CSRF token on logout
        dispatch({ type: 'LOGOUT' });
      } catch (error) {
        resetCsrfToken(); // Reset CSRF token even on error
        dispatch({ type: 'LOGOUT' });
        throw error;
      }
    }
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}