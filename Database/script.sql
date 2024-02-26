 Database: Netropolis

 DROP DATABASE IF EXISTS "Netropolis";

 CREATE DATABASE "Netropolis";

 CREATE TABLE userdetails (
     userid SERIAL PRIMARY KEY,
     firstname VARCHAR(255),
     lastname VARCHAR(255),
     password VARCHAR(255),
     emailid VARCHAR(255) UNIQUE,
     specialisation VARCHAR(255),
     dob DATE
 );



 CREATE TABLE managerdetails (
     managerid SERIAL PRIMARY KEY,
     firstname VARCHAR(255),
     lastname VARCHAR(255),
     password VARCHAR(255),
     emailid VARCHAR(255) UNIQUE,
     specialisation VARCHAR(255),
     dob DATE
 );

  CREATE TABLE quests (
     quest_id SERIAL PRIMARY KEY,
     name VARCHAR(255),
 	 points INT,
     location VARCHAR(255),
     work VARCHAR(255),
     reward VARCHAR(255),
     days INTEGER,
     temperature VARCHAR(255),
     leisure VARCHAR(255),
     local_events VARCHAR(255),
     manageremailid VARCHAR(255)
 );

 INSERT INTO quests (name, points,location, work, reward, days, temperature, leisure, local_events, manageremailid) 
 VALUES 
 ('Explore the Enchanted Forest',1200,'Forest', 'Exploration', '100 gold', 3, 'Moderate', 'Hiking', 'Forest Festival', '2022csb1118@iitrpr.ac.in'),
 ('Defeat the Dragon of Doom',2000,'Mountain', 'Climbing', '200 gold', 5, 'Cold', 'Skiing', 'Mountain Marathon', '2022csb1119@iitrpr.ac.in'),
 ('Retrieve the Lost Relic',4000,'Beach', 'Treasure Hunt', '150 gold', 4, 'Warm', 'Surfing', 'Beach Party', '2022csb1120@iitrpr.ac.in');
 INSERT INTO quests (name, points,location, work, reward, days, temperature, leisure, local_events, manageremailid)
 VALUES 
 ('Enchanted Forest',1200,'Forest', 'Exploration', '100 gold', 3, 'Moderate', 'Hiking', 'Forest Festival', '2022csb1117@iitrpr.ac.in');
 


 CREATE TABLE schedulerequest (
     request_id SERIAL PRIMARY KEY,
     manageremailid VARCHAR(255),
     quest_id INTEGER,
     useremailid VARCHAR(255),
     status VARCHAR(255),
     startdate Date,

     FOREIGN KEY(useremailid) REFERENCES userdetails(emailid),
     FOREIGN KEY(quest_id) REFERENCES quests(quest_id)
     

 );


