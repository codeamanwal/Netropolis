import React, { useState } from 'react';

const QuestSchedule = ({ questId, onSchedule }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    // Validate date and time
    if (!date || !time) {
      alert('Please select date and time for scheduling.');
      return;
    }

    // Call the onSchedule function with questId, date, and time
    onSchedule(questId, date, time);
  };

  return (
    <div>
      <h2>Schedule Quest</h2>
      <label>Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <label>Time:</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
};

export default QuestSchedule;
