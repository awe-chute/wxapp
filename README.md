# wxapp

Description: React front-end, four node js back-end process (plants, event-bus, precipitation, calculation).  Plants contains the GET, POST, and DELETE methods that lets the client add a plant and its water amount (mL), list all of the plants, and remove a plant.  It also validates input as a part of of those methods.  The plant list (which contains plantName and waterAmount) is stored locally in an array that simulates a database. Plants posts and listens to the event-bus.  Precipitation is a scheduled process that runs every 7 days to retrieve the precipitation totals (in millimeters) for the past week.  When this job completes it posts to the event-bus.  Calculation then receives the precipitation total and converts it to an amount associated with area.  It then compares it with the water needs for each plant.  If the amount falls short an event is logged to the console.  In the future this will be an email notification leveraging AWS SNS.

1.) Create a base Amazon Linux AMI with node js, npm, and git installed.  Reference the AMI ID in the CloudFormation template (wxapp.yaml).

2.) Run the template in CloudFormation.  This creates the EC2 instance that hosts the four wxapp processes.

3.) Connect to the EC2 instance and clone the github repository.
  - git clone https://github.com/awe-chute/wxapp.git
  - cd wxapp
  - bash ./startup.sh
  
4.) Update "client" PlantTracker.jsx and the invoke URL with the IP address of the EC2 instance.

5.) "npm install" and then "npm start" the client to connect to the backend services.

# work remaining
- Add MySQL database for plant list
- Add SNS for email notification
