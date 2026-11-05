# Wedding RSVP API

## Project Description
RSVP API to be integrated with a marriage website.

## How It Works
User enters their first name, last name, along with the first names and last names of all the people they will be attending the event with.
Then they select the relationship category which consists of the following options: **Bride** or **Groom**.

For each object in the array, internally the system combines the first name and last name to get the fullname, then it trims the string both on the left and right side as well as in-between.

If the same name value is entered multiple times, the system will not create a new entry. It will send a message to the user saying, a seat has already been reserved for you.

A seperate endpoint for retrieving a list of the guests who have reserved seats.
This endpoint also returns the total count of reserved unique guests.
This particular endpoint will be publicly restricted by a required api key in the request headers.

## Tools and Technologies Used
1. TypeScript: for writing strict type-checked code.
2. Node.js: JavaScript runtime.
3. Express.js: Node.js framework.
4. MongoDB: Database
5. Postman: API Testing and Documentation
6. Render: Server Deployment

## Security Considerations
* Sanitization of incoming request.
* Prevent MongoDB query injection attacks.
* Strong validation that sanitizes incoming request data so that only what is needed by the controller gets accepted in.
* Strong error handling to prevent the server from crashing.

## How to Setup and Run the Project Locally
1. Ensure your local machine has Nodejs installed (Version 24 - at least). 
2. Clone the repository to your local machine.
3. Install all the dependencies using the **npm install** command.
4. Setup your env variables. The **env-sample.txt** file shows you what is needed.
5. In dev mode, simple run the **npm run dev** command.
6. Alternatively you can execute the **npm run build** and then **npm run start** commands.
7. You can now interact with the server application using your localhost url and port number.