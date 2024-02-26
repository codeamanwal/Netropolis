// QuestList.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import QuestCard from './questCard';
import QuestRegister from './questRegister';
import { useNavigate } from 'react-router-dom';
import './questCard.css';
import Dashboard from './dashboard';



const RegisteredQuests = () => {
  const [quests, setQuests] = useState([]);
  const [registeredQuests, setRegisteredQuests] = useState([]);
  const [socket, setSocket] = useState(null);
  
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // Track if user is registering


  const navigate = useNavigate();


  useEffect(() => {
    
    const s = io("https://netropolis-backend.onrender.com/", {
      transports: ["websocket"],
      cors: {
        origin: "https://netropolis.onrender.com",
      },
    }); 

    // if(formSubmitted){
    function SearchQuest() {
      s.emit("all_quests");
    }

    const waitForMessage = () => {
      return new Promise((resolve) => {
        s.on('all_quests_response', (data) => {
          resolve(data['quests']);
        });
      });
    };

    const fetchData = async () => {
      try {
        SearchQuest();
        const data = await waitForMessage();
        alert(data);
        console.log('Received message from WebSocket:', data);
        // if(message=="User logged in successfully"){
        //   onLogin(true);
        //   navigate("/");
        // }
        // setFormStatus(false);
      } catch (error) {
        console.error('Error while waiting for message from WebSocket:', error);
      }
    };

    fetchData();

    s.on('connect', () => {
      console.log('Connected to backend via WebSocket');
      // setIsConnected(true)
    });


    return () => {
      s.disconnect();
    };
  // }

  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('registration_success', (data) => {
      setRegisteredQuests(prevRegisteredQuests => [...prevRegisteredQuests, data]);
    });
  }, [socket]);

  const handleRegister = (questId, userName, userEmail) => {
    if (!socket) return;

    socket.emit('register_quest', { quest_id: questId, user_name: userName, user_email: userEmail });
  };

  const handleRegisterClick = (questId) => {
    setSelectedQuestId(questId);
    setIsRegistering(true); // Set isRegistering to true to show the RegisterForm

    // navigate('/questRegisterForm1');
     // Set the selected quest ID
  };

  // Function to fetch quests from backend
  useEffect(() => {
    // Replace this with your actual API call to fetch quests
    const fetchQuests = async () => {
      try {
        const response = await fetch('http://your-backend-api/quests');
        if (response.ok) {
          const data = await response.json();
          setQuests(data);
        } else {
          console.error('Failed to fetch quests');
        }
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };

    fetchQuests();
  }, []);

   // Sample quest data
   const sampleQuests = [
    { id: 1, name: 'Explore the Enchanted Forest', description: 'Embark on a magical journey through the Enchanted Forest.', duration: '3 days', reward: '100 gold' },
    { id: 2, name: 'Defeat the Dragon of Doom', description: 'Confront the fearsome dragon that threatens the kingdom.', duration: '5 days', reward: '200 gold' },
    { id: 3, name: 'Retrieve the Lost Relic', description: 'Brave the ancient ruins to recover the legendary artifact.', duration: '4 days', reward: '150 gold' },
  ];

  useEffect(() => {
    setQuests(sampleQuests);
    setRegisteredQuests(sampleQuests);
  }, []); // Set quests when component mounts
  console.log(selectedQuestId);
  return (
    
   

    <div>
      
        
          <div>
          <h2>Registered Quests</h2>
          <ul>
            {registeredQuests.map((quest) => (
              <li key={quest.id}>{quest.name} registered for quest {quest.quest_id}</li>
            ))}
          </ul>
        </div>
        
      
    </div>

    
   
  );
};

export default RegisteredQuests;
