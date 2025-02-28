# T3A2 Part B Server

This code is part of the user sign up process in the Node.js backend. It is designed to handle the logic of signing up a user by creating a new user entry in the database.

### Importing dependencies
![image_importing_dependencies](./src/images/importing_dependencies.png)

- <b>User</b> is imported from a file named UserModel, which contains the schema for the user model which allows it to interact with the database.
- <b>bycrypt</b> is a library that is used to salt and hash passwords to ensure secure storage of user passwords.
- <b>jsonwebtoken</b> is used to create and verify JWT web tokens, and is generally used for authentication, after the user has successfully registered.

### Defining signupUser function
![image_async_function](./src/images/asynchronous_function.png)
This function is asynchronous and is designed to handle the signup process with the user submits their details via the frontend form.

### Data Extracting from request body
![image_extracting-data](./src/images/extracting_data.png)

This sends the user data from the signup form to request.body. Here we extract the user information accountEmail, firstname, lastname, and password from the request body.

### Checking if email exists in the database
![image_check_for_email](./src/images/check_for_email.png)

The User.findOne() code will check if there is an existing user in the database with the supplied accountEmail. This will query the database and will return null if no user present with a matching email address or will return the user object if it does exist.

This code has checked if the email is already in use
![image_if_email_exists](./src/images/if_email_exists.png0)

If the email already exists, the server responds with a 400 HTTP status telling the user to use another email address.

### Hashing passwords
![image_hashing_passwords](./src/images/bcrypt_hash_pswd.png
)
This line of code is used to "hash" the user's password before storing it into the database. bcrypt.hash() function provides the bcrypt library that will take two arguments, the plain text password supplied by the user, and the salt rounds or cost factor used to generate the hash. The salt is a random value added to the password before hashign to make sure that even if two users have the same password the has values are different.

### UserModel
![image_UserModel](./src/images/UserModel.png)

This code is used to create.save a new user using the database User model.
- <b>User.create()</b> is part of the ORM (Object Relational Mapping) framework, like Mongoose if you're using MongoDB. It is used to create a new instance of the User model and save it directly to the database in one step.

- The <b>await</b> keyword ensures the code waits until the user has been successfully crated and saved to the database before moving on to the next line of code. It allows the function to work asynchronously but in a way that looks and acts like synchronous code.
- The object that is passed to <b>create()</b> contains the fields that the Usermodel expects to save. In this instance these fields are;
        accountEmail
        firstname
        lastname
        password (this will be hashed with bcypt)

The User.create() method will take this object, map the data to the corresponding fields in the database and insert the data into the appropriate collection (aka users collection in this instance). Once this is successfully executed, it will return the newly created user object which now contains all the properties just saved into the database, this will also have a database generated field such as ID and/or timestamp.

The await User.create() is stored inside the user variable. This now holds the newly created complete user object that has just been saved to the database. You can now use it for further processing or send it back to the client in response.

### Response Status
![image_response_status](./src/images/response_status.png)

This part of the code is responsible for sending a response back to the client at the front end to whoever many the request, after the user has been signed up successfully.

The response.status() method is used to set the HTTP status code for the response, the status code 201 is created which indicates that the request has been fullfilled. This means the users signup request was successful and the new entry has been created in the database.

The .json({...}) method is used to send a JSON response back to the client, the object passed into .json() will be converted to a JSON format and sent back as the response body. The dynamic string using the template literals constructs a message which confirms the successful signup of the user. The placeholders ${firstname}, ${lastname}, ${accountEmail}, will be replaced with the actual values received from the user from the request body.

The client sends a POST request to the server with the users signup details (eg name, email, password),the server then processes the request, it will check if the email is unique, hash the password, then creates the user in the database and returns a response. The message in the response body confims the user has been successfully signed up.

### Login User Function

This is the login unser function, it is typically part of the authentication flow. The code starts by extracting the email and password from the request body. The request.body contains the data that the client sends when they attempt to log in. It is expected to be an object with the variables of accountEmail and password.

The const user = await User.findOne() code is searching for a user with the supplied accountEmail. User is the model representing the users in the database, the query will return the user object if a matching user is found in the database or null if no user is found to match the supplied email. If no user is found the function will then send an error response HTTP Status 400. This is a "bad request" status code which indicates that the request made by the client is invalid. It is invalid because the email has not been found in the database. the response.json() method sends a JSON object with a message informing the client that the email does not exist and directs them to the signup page.

The pupose of this code is to authenticate the user, the first part of the code  ensures the user who is attempting to log in has an account, it checks this by searching the database for the given accountEmail. It will then check if the given password matches the hashed password stored in the database. If the email exists and the password is correct, then the server will generate a JWT token that they client can use to authenticate furture requests. If the login is successful, the success response and JWT will be sent back to the client.

The complete flow;
    1. user enters email and password
    2. server checks if email is in database
    3. if email does not exist, error message is sent
    4. if email exists, server checks if supplied password matches hashed password stored in database
    5. if password is correct, server generates JWT token for authentication
    6. server sends acknowledgement message and generated token back to client.

This secure login system is a common approach, so passwords are never stored in plain text and tokens are used for stateless authentication.

### Is Password Valid
![image_is_password_valie](./src/images/is_password_valid.png)

This code is part of the authentication process for user login, specifically in backend application of Node.js. It uses bcrypt for password hashing and JWT token creation after successful authentication.

<b>bcrypt.compare()</b> is an asynchronous function that compares a plain text password with the hashed password stored in the database. bcrypt is a popular library for hashing and comparing passwords securely. The function takes two arguments the first is the plain text password the second is the hashed password stored in the database that gets retrieved as the <b>user.password</b>. If the passwords match, <b>isPasswordValid</b> will be true, otherwise it is false. 

<b>await</b> is used because <b>bcrypt.compare()</b> returns a promise, so the function waits for the promise to be resolved before continuing.

if <b>!isPasswordValid</b> is invalid, then it is false, and returns a HTTP response indiciating the error <b>response.status(400).json({...}).</b> This sets the HTTP code status to 400 (bad request), which indicates that there is something wrong with the request, in this case password is incorrect. The <b>json({...})</b> sends a JSON response back to the client telling the client that the password is invalid, and to please try again. This informs the client that the log in attempt has failed due to incorrect password given.

<b>jwt.sign()</b> creates a JSON Web Token (JWT). The token is used for authenticating other requests from the client, so they don't have to log in again each request. 

<b>{ userID: user._id }</b> is the data that has been stored in the token, in this instance, its the user ID (user._id) which can later be used to identify the user when decoding the token.

<b>process.env.JWT_SECRET</b> is the secret key used to sign the token, it should be stored securely in your environment variable (.evn file) to prevent it from being exposed inside the code.
<b>{ expiresIn: "1h" }</b> this code sets the token exiry time for 1 hour after creation, so the client would need to log in again once the hour has passed to refresh the token.

<b>response.json( { token})</b> this code sends the JSON response back to the client with the generated JWT token. The token is attached in the respose body as {token: 'your_generated_token}. The client can then store this token in their local storage or cookies and include it in the authorisation head of future requests to authenticate.

<b>module.exports = {signupUser, loginUser}</b> this line of code exports the two functions so they can be used in other parts of the application such as route handlers for both signup and login features.