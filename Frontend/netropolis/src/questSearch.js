
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './questSearch.css'; // Import CSS file for styling
import QuestCard from './questCard';

const QuestSearch = () => {
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSearch = async () => {
  //   try {
  //     setIsLoading(true); // Set loading state while fetching data
  //     const response = await axios.get(`/quests/search?query=${searchQuery}`);
  //     setSearchResults(response.data);
  //     setIsLoading(false); // Reset loading state after data is fetched
  //   } catch (error) {
  //     console.error('Error searching quests:', error);
  //     setIsLoading(false); // Reset loading state if there's an error
  //   }
  // };

  const [searchQuery, setSearchQuery] = useState('');
  const [quests, setQuests] = useState([]);
  const [noQuestFound, setNoQuestFound] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  
  useEffect(() => {
    
    const s = io("https://netropolis-backend.onrender.com/", {
      transports: ["websocket"],
      cors: {
        origin: "https://netropolis.onrender.com",
      },
    }); 

    

    if(searchClicked){
      console.log(searchQuery);
      function searchReq() {
      const data = {
        'work':searchQuery   
      };
      s.emit('search_quests_elastic', data);
    }

    const waitForMessage = () => {

      return new Promise((resolve) => {
        s.on('selected_quests_elastic', (data) => {
          if(data['message']==="Quests found"){
            // alert(data['message']);
            console.log(data['quests']);
            setQuests(data['quests']);
            setIsLoading(false);
            resolve(data['quests']);
            
          }
          else{
            alert(data['message']);
            setIsLoading(false);
            resolve({});
          }
        });
      });
    };

    const fetchData = async () => {
      try {
        searchReq();
        const data = await waitForMessage();
        setSearchClicked(false);
        
      } catch (error) {
        console.error('Error while waiting for message from WebSocket:', error);
      }
    };

    s.on('connect', () => {
      console.log('Connected to backend via WebSocket');
      // setIsConnected(true)
    });
    
      fetchData();

  }
    return () => {
      s.disconnect();
    };

    }, [searchClicked]);

  const handleSearch = () => {

    setIsLoading(true);
    setSearchClicked(true);

  };

  return (
    <div className="quest-search-container">
            <div className="search-header">
        <h2>Search Quests</h2> 
      </div>
      <div className="search-box">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search quests..."
        className="quest-search-input"
      />
      <button onClick={handleSearch} className="quest-search-button">
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      <div className="quest-results">
        {quests.map((quest) => (
          <div key={quest.quest_id} className="quest-item">
            <h3>{quest.name}</h3>
            <p>Points: {quest.points}</p>
            <p>Location: {quest.location}</p>
            <p>Work: {quest.work}</p>
            <p>Reward: {quest.reward}</p>
            <p>Days: {quest.days}</p>
            <p>Temperature: {quest.temperature}</p>
            <p>Leisure: {quest.leisure}</p>
            <p>Local Events: {quest.local_events}</p>
            <p>Manager ID: {quest.managerId}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default QuestSearch;
