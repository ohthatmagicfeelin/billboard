// src/utils/localStorage.js
export const setUserId = (userId) => {
    localStorage.setItem('userId', userId);
  };
  
  export const getUserId = () => {
    return localStorage.getItem('userId');
  };