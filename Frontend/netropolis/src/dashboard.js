// Dashboard.js

import React from 'react';
import './dashboard.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';
import { io } from "socket.io-client";
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import QuestScheduling from './questSchedule';
import Login from './login';
import Homepage from './Homepage';


// function Dashboard1({ onLogin, onRegister }) {
function Dashboard(props) {
   
    const navigate = useNavigate();


    const handleLogout = async () => {
      try {
        props.onLogout(false);
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    // alert(props.formStatus);
  return (

    
<div>
    
      {props.formStatus === true ? (
        <div className="dashboard">
          <div className='header'>
          <h1>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
      </div>
      <nav className="navbar">
        <div className="logo"></div>
        <ul className="nav-links">
        <li><button className='button1' onClick={handleLogout}>Sign out</button></li>
          {/* <li><Link to='/'>Sign Out</Link></li> */}
          <li><Link to="/questList">Quest List</Link></li>
          {/* <li><Link to="/questCreate">Quest Register</Link></li> */}
          <li><Link to="/questSearch">Quest Search</Link></li>
          {(props.manager===false)?(
          <li><Link to="/myRequests">Requests</Link></li>) :null
            
          }

          
          {(props.manager===true)?(
            <li><Link to="/requests">Requests </Link></li>
            ):null
           
          }
          {(props.manager===true)?(
            <li><Link to="/questCreate">Create Quest </Link></li>
            ):null
           
          }
        </ul>
      </nav>
      <Homepage/>
      <footer className='footer'>
        <div >
          <p>Copyright © 2024 All Rights Reserved by Netropolis</p>
        </div>
      </footer>
    </div>
      ) : (
        <div className="dashboard">
          <div className='header'>
          <h1>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
      </div>
      <nav className="navbar">
        <div className="logo"></div>
        <ul className="nav-links">
          <li><Link to='/login'>Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/questList">Quest List</Link></li>
          <li><Link to="/questSearch">Quest Search</Link></li>
          
        </ul>
      </nav>
      {/* <div className="content">
        <h1>Welcome to the Dashboard!</h1>
        <p>This is the central content area where you can display website details.</p>
        
      </div> */}
      <Homepage/>
      <footer className='footer'>
        <div >
          <p>Copyright © 2024 All Rights Reserved by Netropolis</p>
        </div>
      </footer>
    </div>
      )}

</div>


  );
}

export default Dashboard;
