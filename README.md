# Mock Radius Server DB

Just a fun project to explore uploading a list of contacts to a S3 bucket, triggering a lambda that then loads the CSV into a DynamoDB table.

The Scenario is that you are a small ISP that has their RADIUS server setup in AWS. For those that are wondering what a RADIUS server is:

```
Remote Authentication Dial-In User Service (RADIUS) Server is a centralized user authentication, authorization and accounting application. RADIUS authentication gives the ISP or network administrator ability to manage PPP users, login users and Hotspot users from one server throughout a large network.
```  
_REF:_ [SystemZone](https://systemzone.net/tag/radius-server-for-isp/)

The use case is that the ISP will upload a CSV file to a S3 bucket whenever they have a new subscribers that are ready to start using their service. Loading the Subscribers data will allow the subscriber modem to authenticate and allow the subscriber to start binge on seasons 1-7 of Game Of Thrones (Season 8, pfft ), followed by seasons 1 - 2 of IT Crowd.

The minimum needed fields for a radius to work (don't quote me) are:

- portAuthToken: This is the ID for the physical connection between the subscriber and the network carrier
- Username: subscribers unique username
- password: subscribers unique password
- GroupName: group assigned to the subscriber that tells the Radius Server what extra attributes need to be provided
- Reply: Attributes specific to the subscriber.  Static IP addresses are sent via here.

## Dev


## Deploy
