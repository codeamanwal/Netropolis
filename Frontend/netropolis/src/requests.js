import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './request.css';
import { useNavigate } from 'react-router-dom';

function Requests(props){

    const [quests,setQuests]=useState([]);
    const [newStatus,setNewStatus]=useState(null);
    const [requestID,setRequestID]=useState(0);
    const navigate=useNavigate();

    useEffect(() => {
    
        const s = io("https://netropolis-backend.onrender.com/", {
          transports: ["websocket"],
          cors: {
            origin: "https://netropolis.onrender.com",
          },
        }); 

        const changeStatusRequest= ()=>{
            const data = {
                'requestId':requestID
              };
              if(newStatus==="accepted"){
                s.emit('accept_request', data);
              }
              else if(newStatus==="rejected"){
                s.emit("reject_request",data);
              }
        }
    
    
        const waitForMessage = () => {
    
          return new Promise((resolve) => {
            var waitingMsg;
            if(newStatus==="accepted"){
                waitingMsg="request_accepted";
            }
            else if(newStatus==="rejected"){
                waitingMsg="request_rejected";
            }
            
            s.on(waitingMsg, (data) => {
              
                console.log(data['message']);
                resolve(data['message']);
              
            });
          });
        };
    
        const UpdateData = async () => {
          try {
            changeStatusRequest();
            const message = await waitForMessage();
            alert(message);
            navigate("/requests")
            
          } catch (error) {
            console.error('Error while waiting for message from WebSocket:', error);
          }
        };
    
        s.on('connect', () => {
          console.log('Connected to backend via WebSocket');
          // setIsConnected(true)
        });
        
          UpdateData();
    
      
        return () => {
          s.disconnect();
        };
    
        }, [newStatus]);

    useEffect(() => {
    
        const s = io("https://netropolis-backend.onrender.com/", {
          transports: ["websocket"],
          cors: {
            origin: "https://netropolis.onrender.com",
          },
        }); 

        const searchRequests= ()=>{
            const data = {
                'emailid':props.email 
              };
              s.emit('employer_requests', data);
        }
    
    
        const waitForMessage = () => {
    
          return new Promise((resolve) => {
            s.on('employer_request_data', (data) => {
              
                console.log(data['quests']);
                setQuests(data['quests']);
                resolve(data['quests']);
              
            });
          });
        };
    
        const fetchData = async () => {
          try {
            searchRequests();
            const data = await waitForMessage();
            // setSearchClicked(false);
            
          } catch (error) {
            console.error('Error while waiting for message from WebSocket:', error);
          }
        };
    
        s.on('connect', () => {
          console.log('Connected to backend via WebSocket');
          // setIsConnected(true)
        });
        
          fetchData();
    
      
        return () => {
          s.disconnect();
        };
    
        }, []);

        const handleAccept = (requestId) => {
          setNewStatus("accepted");
          setRequestID(requestId);
        };
      
        const handleReject = (requestId) => {
          setNewStatus("rejected");
          setRequestID(requestId);
        };



    return(
        <div>

        { (props.formStatus===true && props.manager===true)?(
          <div className="requests-container">
          
          {quests.length > 0 ? (
          <h2>Requests</h2>
     
      
          ):(
          <h2>No Pending Requests</h2>
          )}
     
      
         {quests.map((quest) => (
          <div className="request-card" key={quest.questId}>
            <p>Name: {quest.firstname + " " + quest.lastname}</p>
            <p>Email Id: {quest.emailID}</p>
            <p>Date Of Birth: {quest.dob}</p>
            <p>Start Date :{quest.startDate}</p>
            <p>Quest ID: {quest.questId}</p>
            <p>Specialisation: {quest.specialisation}</p>
            
            
            <div className="request-actions">
            <button className="accept-button" onClick={() => handleAccept(quest.requestId)}>Accept</button>
            <button className="reject-button" onClick={() => handleReject(quest.requestId)}>Reject</button>
            </div>
          </div>
        ))
      
        }
        

       
      
      </div>
      ):(
        <div>
          {alert("Only Managers can see requests")}
          {navigate("/")}
          
        </div>

        )
      }

      </div>

    );


}

export default Requests;