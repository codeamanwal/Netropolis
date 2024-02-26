// QuestCard.js
import {React} from 'react';
import './questCard.css';

const QuestCard = ({ quest, onRegisterClick }) => {
  const handleRegisterClick = () => {
    onRegisterClick(quest.quest_id, quest.name);
  };

 

  return (
    

<div className='quest-card'>


    <h1> {quest.name}</h1>
    <div className='Info'>
        <p>
          <h3>Id: {quest.quest_id}</h3>
        <h3>Work: {quest.work}</h3>
        <h3>Duration: {quest.duration}</h3>
        <h3>Reward: {quest.reward}</h3>
        <h3>Points: {quest.points}</h3>
        <h3>Weather: {quest.weather}</h3>
        <h3>Leisure: {quest.leisure}</h3>
        <h3>Local Events: {quest.local_events}</h3>
        </p>
        <div className='button-container'>
            <button onClick = {handleRegisterClick}> Register </button>
            {/* <button > Employer <br/> Details </button> */}
        </div>
        

    </div>
    

   
</div>
  );
};

export default QuestCard;
