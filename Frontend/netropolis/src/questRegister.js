// QuestRegister.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './registerQuest.css';
import 'react-datepicker/dist/react-datepicker.css';



const QuestRegister = ({ questId, questName, onRegister, onClose, email }) => {

  const [socket, setSocket] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [formSubmitted, setFormStatus]= useState(false);
  const [startDate, setStartDate]=useState('');
  const navigate=useNavigate();


  useEffect(() => {
    
    const s = io("https://netropolis-backend.onrender.com/", {
      transports: ["websocket"],
      cors: {
        origin: "https://netropolis.onrender.com",
      },
    }); 

    

    if(formSubmitted){

      function createRequest() {
      const data = {
          'quest_id': questId,
          'email_id': userEmail,
          'date':startDate
          
      };
      s.emit('schedule_request', data);
    }

    const waitForMessage = () => {

      return new Promise((resolve) => {
        s.on('request_created', (data) => {
          resolve(data['message']);
        });
      });
    };

    const sendData = async () => {
      try {
        createRequest();
        const message = await waitForMessage();
        console.log('Received message from WebSocket:', message);
        setFormStatus(false);
        if(message==="Request created successfully"){
          alert(message);
          navigate("/");
        }
        else{
          alert(message);
          navigate('/questList');
        }
      } catch (error) {
        console.error('Error while waiting for message from WebSocket:', error);
      }
    };

    s.on('connect', () => {
      console.log('Connected to backend via WebSocket');
      // setIsConnected(true)
    });
    
      sendData();

  }
    return () => {
      s.disconnect();
    };

    }, [formSubmitted]);
  
  
  useEffect(() => {
    console.log(email);
    setUserEmail(email);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const today = new Date();
    const selectedDate = new Date(startDate);
    if (selectedDate <= today) {
      alert("Start date should be greater than today's date");
      return;
    }

    setFormStatus(true);
    
  };

  return (
    
    <div className="body1">
    <div className="register-form ">
      <h2> Quest Register Form </h2>
    <form onSubmit={handleSubmit}>
      
      <div>
        <label htmlFor="quest_id">Quest ID:</label>
        <input type="text" id="questId" name="questId" value = {questId}  required />
      </div>
      <div>
        <label htmlFor="quest_id">Quest Name:</label>
        <input type="text" id="questName" name="questName" value = {questName}  required />
      </div>
      <div className='dateContainer'>
        <label htmlFor="Start_Date">Start Date:</label>
        <br/> 
        <br/>
        <input
            type="date"
            value={ startDate}
            onChange={(e) => setStartDate(e.target.value)}
            pattern="\d{4}/\d{2}/\d{2}"
            placeholder="YYYY/MM/DD"
            // placeholderText="MM/DD/YYYY"
            required
          />
      </div>
      <div>
        <label htmlFor="user_email">Email:</label>
        <input type="email" id="userEmail" name="userEmail" value = {userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
      </div>
      
      <button className="register-button" type="submit">Submit</button>
      <p className='form'> <a href="questList">Select other quest to register </a></p>
    </form>
    </div>
    </div>
  );
};

export default QuestRegister;
