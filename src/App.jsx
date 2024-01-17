import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "views/auth/hooks/useAuthContext";
import AdminLayout from "layouts/admin";
import TechLayout from "layouts/technicien";
import ClientLayout from "layouts/client";
import HelpdeskLayout from "layouts/help-desk";
import NoAccess from "layouts/noaccess";
import Page404 from "layouts/page404";
import AuthLayout from "layouts/auth";
import ControllerLayout from "layouts/Controller";
import { io } from "socket.io-client";

const App = () => {
  const { user, state } = useAuthContext();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit("setup", user);
    });

    setSocket(newSocket);

    return () => {
      // Clean up the socket connection when the component unmounts
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user && user.role) {
      console.log("User Role:", user.role);
    }
  }, [user]);

  const isUserAuthorized = (allowedRoles) => {
    return user && user.role && allowedRoles.includes(user.role);
  };

  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route
        path="client/*"
        element={
          isUserAuthorized(['CLIENT']) ? (
            <ClientLayout socket={socket} />
          ) : (
            <Navigate to="/noacces" replace />
          )
        }
      />
      <Route
        path="helpdesk/*"
        element={
          isUserAuthorized(['HELPDESK']) ? (
            <HelpdeskLayout socket={socket} />
          ) : (
            <Navigate to="/noacces" replace />
          )
        }
      />
      <Route
        path="tech/*"
        element={
          isUserAuthorized(['TECHNICIEN']) ? (
            <TechLayout socket={socket} />
          ) : (
            <Navigate to="/noacces" replace />
          )
        }
      />
      <Route
        path="manager/*"
        element={
          isUserAuthorized(['ADMIN']) ? (
            <ControllerLayout socket={socket} />
          ) : (
            <Navigate to="/noacces" replace />
          )
        }
      />
      <Route
        path="admin/*"
        element={
          isUserAuthorized(['COORDINATRICE']) ? (
            <AdminLayout socket={socket} />
          ) : (
            <Navigate to="/noacces" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      {<Route path="*" element={<Page404 />} />}
      {<Route path="/noacces" element={<NoAccess />} />}
    </Routes>
  );
};

export default App;