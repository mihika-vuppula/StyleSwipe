// src/context/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');

    return (
        <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
