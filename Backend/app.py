from flask import Flask, render_template, request, session, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:QD23qWN0NTtFu0wMNNn2Zki8y9nLBrWv@dpg-cnbif98l6cac73egd8cg-a/netropolis'
db = SQLAlchemy(app)





CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")



@socketio.on('connect')
def handle_connect():
    print('Client connected to WebSocket')



@socketio.on('Disconnect')
def handle_disconnect():
    print('Client disconnected to WebSocket')




# WebSocket event handler to execute create user query
@socketio.on('create_user')
def create_user(data):
    print(data)
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']
    dob = data['dob']
    specialisation = data['specialisation']

    with app.app_context():

        query = text(' Select * from userdetails where emailid=:email')
        result = db.session.execute(query, {'email': email}).fetchall()

        if(len(result)==0):

            # Execute the SQL query to create a new user
            query = text('INSERT INTO userdetails (firstname, lastname, password, emailid,specialisation, dob) VALUES (:first_name, :last_name, :password, :email, :specialisation, :dob)')
            db.session.execute(query, {'first_name': first_name, 'last_name': last_name, 'password': password, 'email': email, 'specialisation' : specialisation, 'dob' : dob})
            db.session.commit()
            # Emit a message to the client confirming the user creation
            emit('user_created', {'message': 'User created successfully'})
        else:
            emit('user_created',{"message":"user already exist"})
        


@socketio.on('create_community_manager')
def create_manager(data):

    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']
    dob = data['dob']
    specialisation = data['specialisation']

    with app.app_context():

        query = text(' Select * from managerdetails where emailid=:email')
        result = db.session.execute(query, {'email': email}).fetchall()

        if(len(result)==0):

            # Execute the SQL query to create a new user
            query = text('INSERT INTO managerdetails (firstname, lastname, password, emailid,specialisation, dob) VALUES (:first_name, :last_name, :password, :email, :specialisation, :dob)')
            db.session.execute(query, {'first_name': first_name, 'last_name': last_name, 'password': password, 'email': email, 'specialisation' : specialisation, 'dob' : dob})
            db.session.commit()
            # Emit a message to the client confirming the user creation
            emit('user_created', {'message': 'Manager created successfully'})
        else:
            emit('user_created',{"message":"Manager already exist"})


@socketio.on('login_user')
def login_user(details):
    email = details['email']
    password = details['password']

    # Query the database to check if the username exists
    query = text('SELECT password FROM userdetails WHERE emailid=:email')
    result = db.session.execute(query, {'email': email}).fetchone()

    if result:
        # If the username exists, check if the password matches
        stored_password = result[0]  # Password retrieved from the database
        if stored_password == password:
            session['username'] = email
            emit('login_result', {'message': 'User logged in successfully'})
        else:
            emit('login_result', {'message': 'Incorrect password'})
    else:
        emit('login_result', {'message': 'User does not exist'})




@socketio.on('login_manager')
def login_manager(details):
    email = details['email']
    password = details['password']

    # Query the database to check if the username exists
    query = text('SELECT password FROM managerdetails WHERE emailid=:email')
    result = db.session.execute(query, {'email': email}).fetchone()

    if result:
        # If the username exists, check if the password matches
        stored_password = result[0]  # Password retrieved from the database
        if stored_password == password:
            emit('login_manager', {'message': 'Manager logged in successfully'})
        else:
            emit('login_manager', {'message': 'Incorrect password'})
    else:
        emit('login_manager', {'message': 'Manager does not exist'})


@socketio.on('create_quest')
def create_quest(data):
    name = data['name']
    points= data['points']
    location = data['location']
    work = data['work']
    reward = data['reward']
    days = data['days']
    temperature = data.get('temperature')  
    leisure = data.get('leisure')          
    local_events = data.get('localEvent')  
    manager = data['managerId']

    with app.app_context():
        # Execute the SQL query to create a new quest
        query = text('INSERT INTO Quests (name, points,location, work, reward, days, temperature, leisure, local_events, manageremailid) VALUES (:name,:points ,:location, :work, :reward, :days, :temperature, :leisure, :local_events, :manager)')
        db.session.execute(query, {'name': name,'points':points,'location': location, 'work': work, 'reward': reward, 'days': days, 'temperature': temperature, 'leisure': leisure, 'local_events': local_events,'manager' : manager})
        db.session.commit()

        # Emit a message to the client confirming the quest creation
        emit('quest_created', {'message': 'Quest created successfully'})


# @socketio.on('register_quest')
# def register_quest(data):
#     questId = data['questId']
#     userEmail = data['userEmail']
#     registerDate = data['registerDate']


#     with app.app_context():
        
        
#         query1 = text(f'SELECT userId from userdetails where emailid = :email')
#         result = db.session.execute(query1, {'email': f'{userEmail}'}).fetchone()
 
#         query = text('INSERT INTO RegisteredQuests (quest_id, userId, registerDate) VALUES (:questId, :userId, :registerDate)')
#         db.session.execute(query, {'questId': questId, 'userId': result[0], 'registerDate': registerDate})
#         db.session.commit()

#         # Emit a message to the client confirming the quest creation
#         emit('quest_created', {'message': 'Quest registered successfully'})


@socketio.on('all_quests')
def All_Quests():
    with app.app_context():
        # Execute the SQL query to create a new quest
        query = text('Select * from Quests')
        Quests=db.session.execute(query)
        
        # Convert the result to a list of dictionaries
        quests_data = [{'quest_id': quest.quest_id,
                        'name': quest.name,
                        'points':quest.points,
                        'location': quest.location,
                        'work': quest.work,
                        'reward': quest.reward,
                        'duration': quest.days,
                        'weather': quest.temperature,
                        'leisure': quest.leisure,
                        'local_events': quest.local_events,
                        'managerID' : quest.manageremailid} for quest in Quests]
                        
        
        print(quests_data)

        # Emit a message to the client containing the quests data
        emit('all_quests_response', {'quests': quests_data})

@socketio.on('search_quests_exact')
def search_Quests_exact(data):

    work=data['work']

    with app.app_context():
        # Execute the SQL query to create a new quest        
        query = text(f"SELECT * FROM Quests WHERE work = :work")
        Quests = db.session.execute(query, {'work': {work}})
        

        # Convert the result to a list of dictionaries
        if(len(Quests)!=0):
            quests_data = [{'Quest_no': quest.quest_id,
                            'Location': quest.Location,
                            'Work': quest.Work,
                            'Reward': quest.Reward,
                            'Days': quest.Days,
                            'Temperature': quest.Temperature,
                            'Leisure': quest.Leisure,
                            'Local_events': quest.Local_events,
                            'ManagerID' : quest.manageremailid} for quest in Quests]
        
            print(quests_data)
            # Emit a message to the client containing the quests data
            emit('selected_quests_exact', {'quests': quests_data})

        else:
            emit('no_quest_found_elastic',{'message':f'No Quest Found with work = {work}'})

# @socketio.on('search_quests_elastic')
# def search_Quests_elastic(data):

#     elastic_work=data['work']
#     print(elastic_work)
#     works = elastic_work.split()

#     Quests=[]

#     with app.app_context():
        
#         for work in works: 
#             query = text(f"SELECT * FROM Quests WHERE work ILIKE :work")
#             result = db.session.execute(query, {'work': f'%{work}%'})

        
#         # Convert the result to a list of dictionaries
#             if(len(result.fetchone())!=0):
#                 for quest in Quests:
#                     quests_data = {'Quest_no': quest.questId,
#                                 'Location': quest.location,
#                                 'Work': quest.Work,
#                                 'Reward': quest.reward,
#                                 'Days': quest.aays,
#                                 'Temperature': quest.temperature,
#                                 'Leisure': quest.leisure,
#                                 'Local_events': quest.LocalEvents,
#                                 'ManagerID' : quest.managerId}
#                     Quests.append(quests_data)
        
#         print(Quests)
#         # Emit a message to the client containing the quests data
#         if(len(Quests)!=0):
#             emit('selected_quests_elastic', {'quests': quests_data , 'message': "Quests found"})

#         else:
#             emit('selected_quests_elastic',{'message':f'No Quest Found with work = {work}'})





@socketio.on('search_quests_elastic')
def search_Quests_elastic(data):

    elastic_work = data['work']
    print(elastic_work)
    works = elastic_work.split()

    Quests = []

    with app.app_context():
        for work in works: 
            query = text("SELECT * FROM quests WHERE work ILIKE :work")
            result = db.session.execute(query, {'work': f'%{work}%'})

            # Fetch all results for the current word and append them to Quests
            for quest in result.fetchall():
                quests_data = {
                    'quest_id': quest.quest_id,
                    'name': quest.name,
                    'location': quest.location,
                    'work': quest.work,
                    'points': quest.points,
                    'reward': quest.reward,
                    'days': quest.days,
                    'temperature': quest.temperature,
                    'leisure': quest.leisure,
                    'local_events': quest.local_events,
                    'managerId': quest.manageremailid
                }
                Quests.append(quests_data)
        
        print(Quests)
        # Emit a message to the client containing the quests data
        if Quests:
            emit('selected_quests_elastic', {'quests': Quests , 'message': "Quests found"})
        else:
            emit('selected_quests_elastic', {'message': 'No Quest Found'})





@socketio.on('schedule_request')
def schedule_Quest(data):

    date = data["date"]
    userId = data["email_id"]
    questId = data["quest_id"] 
    

    with app.app_context():

        query = text(f'SELECT * FROM quests WHERE quest_id = :quest_id')
        result = db.session.execute(query, {'quest_id': questId}).fetchone()

        print(result)

        quest_detail={'Quest_Id' : questId,
                    'location': result.location,
                    'work': result.work,
                    'Employer': result.manageremailid }
        
        query = text('INSERT INTO schedulerequest (manageremailid,quest_id, useremailid, status,startdate) VALUES (:employer, :Quest_id, :user_id, :status,:date)')
        db.session.execute(query, {'employer': quest_detail['Employer'], 'Quest_id': quest_detail['Quest_Id'],'user_id':userId, 'status' : 'pending','date':date})
        db.session.commit()

        # Emit a message to the client confirming the quest creation
        emit('request_created', {'message': 'Request created successfully'})


@socketio.on('employer_requests')
def employer_requests(data):
    manager_email = data["emailid"]
    
    with app.app_context():

        query = text(f"""
            SELECT sr.request_id, sr.quest_id, sr.status, sr.startdate, sr.userEmailid,
                   ud.firstname, ud.lastname, ud.specialisation, ud.dob
            FROM schedulerequest sr
            INNER JOIN userdetails ud ON sr.useremailid = ud.emailid
            WHERE sr.manageremailid = :manager_email AND sr.status = 'pending'
        """)

        result = db.session.execute(query, {'manager_email': manager_email}).fetchall()
        quests = []

        for request in result:
            quest_detail = {
                'requestId': request.request_id,
                'questId': request.quest_id,
                'status': request.status,
                'startDate': request.startdate.strftime('%Y-%m-%d'),
                'emailID': request.useremailid,
                'firstname': request.firstname,
                'lastname': request.lastname,
                'specialisation': request.specialisation,
                'dob': request.dob.strftime('%Y-%m-%d')
            }
            quests.append(quest_detail)

        emit('employer_request_data', {'quests': quests})


@socketio.on('user_requests')
def user_requests(data):
    user_email = data["emailid"]
    
    with app.app_context():

        query = text("""SELECT * FROM schedulerequest WHERE useremailid = :user_email""")
        result = db.session.execute(query, {'user_email': user_email}).fetchall()
        quests = []

        for request in result:
            quest_detail = {
                'requestId': request.request_id,
                'questId': request.quest_id,
                'status': request.status,
                'startDate': request.startdate.strftime('%Y-%m-%d'),
                'emailID': request.manageremailid,
            }
            quests.append(quest_detail)

        emit('user_request_data', {'quests': quests})



    

# Function to handle request acceptance
@socketio.on('accept_request')
def accept_request(data):
    print(data)
    request_id = data["requestId"]
    print(request_id)
    
    with app.app_context():
        # Update the status of the request to "accepted" in the database
        query = text('UPDATE ScheduleRequest SET status = :status WHERE request_id = :request_id')
        db.session.execute(query, {'status': 'accepted', 'request_id': request_id})
        db.session.commit()

        emit('request_accepted',{'message':'Request Accepted By Employer'})


# Function to handle request rejection
@socketio.on('reject_request')
def reject_request(data):
    request_id = data["requestId"]
    
    with app.app_context():
        # Update the status of the request to "rejected" in the database
        query = text('UPDATE ScheduleRequest SET status = :status WHERE request_id = :request_id')
        db.session.execute(query, {'status': 'rejected', 'request_id': request_id})
        db.session.commit()

        emit('request_rejected',{'message':'Request Rejected By Employer'})



if __name__ == '__main__':
    # app.run(debug=True)
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT',5000)), allow_unsafe_werkzeug=True)
