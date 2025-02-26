# T3A2 Part B Server

## Index
The index file is the entry point into a Node.js application and it sets up the server to listen to a specific port which will connec the database.

### Importing Modules
![index_code_image](./src/images/index_code.png)

The require("./server.js") this line imports the app object normally an Express instance from a separate file named server.js. The app object is created using the Express framework, which is used to handle HTTP responses and requests.

The require('"/utils/database") imports the connectDB function from a file located inside the utils/database.js file, this connect DB function is responsible for connecting the applications database like MongoDB using appropriate credentials and authentication.

The require("dotenv").config() line loads the environment variables from a .env file into the process.env object. It is useful for storing the sensitive information in a secure manner for information such as API keys, port numbers and database credentials, instead of hardcoding them into the code itself.

![image_.env_code](./src/images/dot.env_code.png)

### Getting the Port Number

![image_getting_port_code](./src/images/getting_port_code.png)

This will check if the PORT environment variable is set, normally inside the .env file, however if not set the default port is 3000. The chosen port is assigned to the PORT constant which is used later to start the server.

![image_starting_server_code](./src/images/starting_server_code.png)

The app.listed code line starts the server and makes it listen for incoming requests on the specific PORT. The async function inside the call back is executed once the server starts listening. The await connectDB() line calls the connect DB function to establish a connection to the database and await for a likely asynchronous function to return a promise, we need to ensure the database connect is established before we proceed. Once the server is running and the database is connected the line contacts the console to confirm the serve is running and listening on the specified port.

The above code snippets are responsible for starting the server and connecting the database. It loads all the variables from the dotenv and starts the server on the specified port (3000). The server will ensure that the database connection is established asynchronously before it logs a success message.  Once everything is set up the server will notify a message that it is running.
