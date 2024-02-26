import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import './questCreate.css';

function QuestCreate(props) {
    // const [socket, setSocket] = useState(null);
    const [name, setName] = useState('');
    const [points, setPoints] = useState('');
    const [location, setLocation] = useState('');
    const [work, setWork] = useState('');
    const [reward, setReward] = useState('');
    const [days, setDays] = useState('');
    const [temperature, setTemperature] = useState('');
    const [leisure, setLeisure] = useState('');
    const [localEvent, setLocalEvent] = useState('');
    const [managerId, setManagerId] = useState('');
    const [formSubmitted, setFormStatus]= useState(false);
    const navigate=useNavigate();
  
  
    useEffect(() => {
    
        const s = io("https://netropolis-backend.onrender.com/", {
          transports: ["websocket"],
          cors: {
            origin: "https://netropolis.onrender.com",
          },
        }); 
    
    
        function createQuest() {
          const data = {
              'name': name,
              'work': work,
              'points': points,
              'location': location,
              'reward': reward,
              'days': days,
              'temperature': temperature,
              'leisure': leisure,
              'localEvent': localEvent,
              'managerId': managerId
          };
          
            s.emit("create_quest", data);
          
    
          
        }
    
        const waitForMessage = () => {
          return new Promise((resolve) => {
            s.on('quest_created', (data) => {
              resolve(data['message']);
            });
          });
        };
    
        const sendData = async () => {
          try {
            createQuest();
            const message = await waitForMessage();
            console.log('Received message from WebSocket:', message);
            
            setFormStatus(false);
            if(message==="Quest created successfully"){
              alert(message);
              navigate("/questList");
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
    
    
        if(formSubmitted){
          sendData();
    
        }
    
        return () => {
          s.disconnect();
        };
    
        }, [formSubmitted]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        // if (password !== confirmPassword) {
        //   alert("Passwords do not match");
        //   return;
        // }
        setFormStatus(true)
        
        
      };

  return (
    <div>
      
      { (props.formStatus===true && props.manager===true)?(
    <div className="quest-form-container">
      
      <h2>Create New Quest</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Points:</label>
        <input
          type="number"
          name="points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>Work:</label>
        <input
          type="text"
          name="work"
          value={work}
          onChange={(e) => setWork(e.target.value)}
        />
        <label>Reward:</label>
        <input
          type="text"
          name="reward"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />
        <label>Days:</label>
        <input
          type="number"
          name="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <label>Temperature:</label>
        <input
          type="text"
          name="temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <label>Leisure:</label>
        <input
          type="text"
          name="leisure"
          value={leisure}
          onChange={(e) => setLeisure(e.target.value)}
        />
        <label>Local Events:</label>
        <input
          type="text"
          name="localEvents"
          value={localEvent}
          onChange={(e) => setLocalEvent(e.target.value)}
        />
        <label>Manager Email ID:</label>
        <input
          type="text"
          name="managerid"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
        />
        <button className="quest-submit-button" type="submit">Create Quest</button>
      </form>
    </div>
      ):
      <div>
      {alert("Only Managers can see requests")}
      {navigate("/")}
      </div>
    }

    </div>
  );
}

export default QuestCreate;
