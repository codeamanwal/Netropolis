// Register.js

import React, { useState, useEffect} from 'react';
import './register.css'; // Import CSS file for styling
import { io } from "socket.io-client";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

// function Register({ onRegister }) {
function Register(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateBirth, setDateOfBirth] = useState('');
  const [specialisation, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formSubmitted, setFormStatus]= useState(false);
  const [loginAsManager, setLoginAsManager] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    
    const s = io("https://netropolis-backend.onrender.com/", {
      transports: ["websocket"],
      cors: {
        origin: "https://netropolis.onrender.com",
      },
    }); 


    function createUser() {
      const data = {
          'first_name': firstName,
          'last_name': lastName,
          'password': password,
          'email': email,
          'dob': dateBirth,
          'specialisation': specialisation
      };
      if(!loginAsManager){
        s.emit("create_user", data);
      }
      else{
        s.emit("create_community_manager",data);
      }
    }

    const waitForMessage = () => {
      return new Promise((resolve) => {
        s.on('user_created', (data) => {
          resolve(data['message']);
        });
      });
    };

    const sendData = async () => {
      try {
        createUser();
        const message = await waitForMessage();
        console.log('Received message from WebSocket:', message);
        
        setFormStatus(false);
        if(message==="User created successfully"){
          alert(message);
          navigate("/login");
        }
        else{
          alert(message);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error while waiting for message from WebSocket:', error);
      }
    };

    s.on('connect', () => {
      console.log('Connected to backend via WebSocket');
      // setIsConnected(true)
    });


    if(formSubmitted){
      sendData();

    }

    return () => {
      s.disconnect();
    };

    }, [formSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setFormStatus(true)
    
    // Perform registration logic here (e.g., validation, API call)
    // For simplicity, let's just pass the form data to the parent component
    // onRegister({ username, email, password });
  };

  const handleRadioChange = (event) => {
    if (event.target.checked) {
      setLoginAsManager(true); // Set to 1 if radio button is checked
    } else {
      setLoginAsManager(false); // Set to 0 if radio button is unchecked
    }
    console.log(loginAsManager);
  };

  return (
    <div>
    <div className='header'>
          <h1 className='header1'>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
    </div>
    <div className="body2">
      
    <div className="register-form ">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          
          <input
            type="checkbox"
            onChange={handleRadioChange}
          />
          <label>Resister as Manager</label>
          <br/>
          <br/>

          
          <label>First Name:</label>
          <input
            type="text"
            value={ firstName}
            pattern="[A-Za-z]{1,}"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={ lastName}
            pattern="[A-Za-z]{1,}"
            onChange={(e) => setLastName(e.target.value)}
            required
          />

        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={ dateBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            pattern="\d{4}/\d{2}/\d{2}"
            placeholder="YYYY/MM/DD"
            // placeholderText="MM/DD/YYYY"
            required
          />
        </div>
        <div className="form-group">
          <label>Specialisation:</label>
          <input
            type="text"
            value={ specialisation}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password: (atleast 6 characters)</label>
          <input
            type="password"
            value={password}
            pattern=".{6,}"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            pattern=".{6,}"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="register-button" type="submit">Register</button>
      </form>
      <p>Already have an account <a href='./login'>Login</a></p>
    </div>
    </div>
    </div>
    
    
  );
}

export default Register;
