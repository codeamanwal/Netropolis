import React, { useState, useEffect } from 'react';
import './login.css';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';



// function Login({ props.onLogin }) {
function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formSubmitted, setFormStatus]=useState(false);
    const [loginAsManager, setLoginAsManager] = useState(false);
    const navigate = useNavigate();

    const handleRadioChange = (event) => {
      if (event.target.checked) {
        setLoginAsManager(true); 
        console.log(loginAsManager);
      } else {
        setLoginAsManager(false); 
        console.log(loginAsManager);
      }
      
    };

    useEffect(() => {
    
      const s = io("https://netropolis-backend.onrender.com/", {
        transports: ["websocket"],
        cors: {
          origin: "https://netropolis.onrender.com",
        },
      }); 
  
      if(formSubmitted){
      function SearchUser() {
        const data = {
            'email': email,
            'password': password
        };
        if(!loginAsManager){
          s.emit("login_user", data);
        }
        else{
          console.log("calling login manager")
          s.emit("login_manager",data);
        }
      }
  
      const waitForMessage = () => {
        return new Promise((resolve) => {

          const emittedMessage= loginAsManager?"login_manager":"login_result";

          s.on(emittedMessage, (data) => {
            resolve(data['message']);
          });
        });
      };
  
      const fetchData = async () => {
        try {
          SearchUser();
          const message = await waitForMessage();
          alert(message);
          console.log('Received message from WebSocket:', message);
          if(message=="User logged in successfully" || message=="Manager logged in successfully"){
            props.onLogin(true);
            props.setEmail(email);
            props.setManager(loginAsManager);
            // {console.log(props.formStatus)}
            navigate("/");
          }
          setFormStatus(false);
        } catch (error) {
          console.error('Error while waiting for message from WebSocket:', error);
        }
      };
  
      s.on('connect', () => {
        console.log('Connected to backend via WebSocket');
        // setIsConnected(true)
      });
  
  
      if(formSubmitted){
        fetchData();
      }
  
      return () => {
        s.disconnect();
      };
    }
  
  }, [formSubmitted]);
  
    const handleLogin = (e) => {
      e.preventDefault();
      setFormStatus(true);

    };
    
    return (
      <div className='header'>
          <h1 className='header1'>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
      
      <div className="body1">
      
        
      <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
        <input
            type="checkbox"
            onChange={handleRadioChange}
          />
          <label>Login as Manager</label>
          <br/>
          <br/>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
    
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" type="submit" onClick={handleLogin}>Login</button>
      </form>
      <p className='form'>Don't have an account yet? <a href='./register'>Register</a></p>
      <p className='form'><a href='./'>Return to home page</a></p>
    </div>
    </div>
    </div>
    
    );
  }

  export default Login;