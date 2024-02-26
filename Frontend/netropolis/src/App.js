
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from "socket.io-client";
import './App.css';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import QuestList from './questList';
import QuestRegister from './questRegister';
import QuestScheduling from './questSchedule';
import RegisteredQuests from './registeredQuest';
import QuestSearch from './questSearch';
import Requests from './requests';
import QuestCreate from './questCreate';
import MyRequests from './myRequests';


function App() {
  // const [loggedIn, setLoggedIn] = useState(false);
  

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailID,setEmailId] = useState("");
  const [loginManager,setAsManager] = useState(false);


  
  

   const handleLogin = (e) => {
      // e.preventDefault();
      setIsAuthenticated(true);
    };

   

    const handleSignOut = () => {
      // Perform sign out logic
      setIsAuthenticated(false);
    };

    const handleRegister = () => {
      // Perform register logic
      setIsAuthenticated(true);
    };

    const LoginRoute = ({ element }) => {
      // Redirect to the dashboard if the user is already authenticated
      return checkAuthentication() ? <Navigate to="/" /> : element;
    };

    const checkAuthentication = () => {
      // Replace this logic with your actual authentication logic
      return isAuthenticated;
    };

  
  return (
     
    <Router>
      <div className="App">
        
        <Routes>
                <Route path="/login" element={<Login onLogin={setIsAuthenticated} setEmail={setEmailId} setManager={setAsManager} formStatus={isAuthenticated}/>} />

        {/* <Route path="/login" element={<Login onLogin={setIsAuthenticated} setEmail={setEmailId} setManager={setAsManager}/>} /> */}
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Dashboard formStatus={isAuthenticated} onLogout={setIsAuthenticated} email={emailID} manager={loginManager} />} />
        <Route path="/questList" element={<QuestList formStatus={isAuthenticated} email={emailID}/>}/>
        {/* <Route path="/questRegisterForm1" element={<QuestRegister/>}/> */}
        {/* <Route path="/questSchedule" element={<QuestScheduling/>}/> */}
        {/* <Route path="/registeredQuest" element={<RegisteredQuests/>}/> */}
        <Route path="/questSearch" element={<QuestSearch/>}/>
        <Route path="/requests" element = {<Requests email={emailID} formStatus={isAuthenticated} manager={loginManager}/>}/>
        <Route path="/questCreate" element = {<QuestCreate formStatus={isAuthenticated} manager={loginManager}/>}/>     
        <Route path="/myRequests" element = {<MyRequests email={emailID} formStatus={isAuthenticated} manager={loginManager}/>}/>  
          
        </Routes>
        
      </div>
    </Router>
    
    
  );
    }

export default App;
