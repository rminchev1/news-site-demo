import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state function to avoid localStorage access during module load
const getInitialState = () => {
  // Don't access localStorage during module initialization
  // to avoid SSR issues - let useEffect handle auth restoration
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };
};

// Action types
const ActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case ActionTypes.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('🔍 Checking auth status on app load...');
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      console.log('📱 Token exists:', !!token);
      console.log('👤 Saved user exists:', !!savedUser);
      
      if (token && savedUser) {
        try {
          // Parse the saved user data
          const parsedUser = JSON.parse(savedUser);
          console.log('✅ Parsed saved user:', parsedUser);
          
          // Try to verify token with backend (but don't fail if backend is down)
          try {
            const response = await authAPI.verifyToken();
            console.log('🔐 Token verification response:', response.data);
            
            if (response.data.success) {
              console.log('✅ Token verified, restoring session with backend data');
              dispatch({
                type: ActionTypes.AUTH_SUCCESS,
                payload: {
                  user: response.data.user,
                  token: token,
                },
              });
              return;
            }
          } catch (apiError) {
            console.warn('⚠️ Backend unavailable for token verification:', apiError.message);
          }
          
          // Use saved user data (works offline or when backend is down)
          console.log('📦 Using saved user data for session restore');
          dispatch({
            type: ActionTypes.AUTH_SUCCESS,
            payload: {
              user: parsedUser,
              token: token,
            },
          });
          
        } catch (parseError) {
          console.error('❌ Failed to parse saved user data:', parseError);
          // Saved user data is corrupted
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } else {
        console.log('❌ No valid token/user found, staying logged out');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: ActionTypes.AUTH_START });
    
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: { user, token },
        });
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: ActionTypes.AUTH_START });
    
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: { user, token },
        });
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on backend, we'll clear local state
      console.error('Logout error:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    dispatch({ type: ActionTypes.LOGOUT });
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: userData,
    });
    
    // Update localStorage
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;