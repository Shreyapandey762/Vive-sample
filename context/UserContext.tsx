import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  area_code: string;
  image_url: string;
  image_thumb_url: string;
  active: boolean;
  invited: boolean;
  mobile_verified: boolean;
  website: string;
  lag: string;
  user_role_name: string;
  user_role_id: string;
  full_address: string;
  auth_token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
