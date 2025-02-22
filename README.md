# wxapp
1.) Create a base Amazon Linux AMI with node js, npm, and git installed.  Reference the AMI ID in the CloudFormation template.
2.) Run the template in CloudFormation.  This creates the EC2 instance that hosts the four wxapp processes.
3.) Connect to the EC2 instance and clone the github repository.
  - git clone https://github.com/awe-chute/wxapp.git
  - cd wxapp
  - bash ./startup.sh
4.) Update "client" PlantTracker.jsx and the invoke URL with the IP address of the EC2 instance.
5.) npm start the client to connect to the backend services.
