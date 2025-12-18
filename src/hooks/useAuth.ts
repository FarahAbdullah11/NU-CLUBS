// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export interface User {
  user_id: number;
  fullname: string;
  role: 'SU_ADMIN' | 'STUDENT_LIFE_ADMIN' | 'CLUB_LEADER';
  club_id: number | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data from localStorage:', e);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  return { user };
};