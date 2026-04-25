import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const user = useSelector((state) => state?.user?.user);

    useEffect(() => {
        // WebSocket connection disabled to prevent localhost connection errors in production template
        /*
        const backendBase =
            import.meta.env.VITE_APP_BACKEND_URI && !import.meta.env.VITE_APP_BACKEND_URI.includes('localhost') && !import.meta.env.VITE_APP_BACKEND_URI.includes('127.0.0.1')
                ? import.meta.env.VITE_APP_BACKEND_URI
                : (import.meta.env.DEV ? 'http://localhost:8080' : '');

        if (!backendBase || (!import.meta.env.DEV && (backendBase.includes('localhost') || backendBase.includes('127.0.0.1')))) {
            console.log(
                '[Socket] Backend URI is either missing or pointing to localhost in production. Socket connection skipped.'
            );
            return;
        }

        const socketConnection = io(backendBase, {
            withCredentials: true,
        });

        socketConnection.on('connect', () => {
            console.log('Connected to server:', socketConnection.id);
            setIsConnected(true);

            // Join user-specific room if user is logged in
            if (user?._id) {
                socketConnection.emit('join-user-room', user._id);
                console.log('Joined user room:', user._id);
            }
        });

        socketConnection.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        setSocket(socketConnection);

        // Cleanup on unmount
        return () => {
            socketConnection.disconnect();
        };
        */
       return () => {};
    }, [user?._id]);

    // Re-join room when user changes
    useEffect(() => {
        /*
        if (socket && user?._id && isConnected) {
            socket.emit('join-user-room', user._id);
            console.log('Re-joined user room:', user._id);
        }
        */
    }, [socket, user?._id, isConnected]);

    const value = {
        socket,
        isConnected,
        userId: user?._id,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};