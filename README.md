![cf](http://i.imgur.com/7v5ASc8.png) Basic Auth And Sign in 
====
[![Build Status](https://travis-ci.com/ashabrai/BasicAuthorization.svg?branch=master)](https://travis-ci.com/ashabrai/BasicAuthorization)

Creating a basic authorization middleware, signup and sign in routes. 

## Getting Started
   * Instructions of what has been done will allow you to get the code running on your 
   local machine. 


## Requirements  
   * You need to have NodeJS installed, so if you don't just search online for nodejs and download it.
    
#### Installing 
   * Clone the repo into your local machine -git clone -directory name here- 
   * Next install project files - npm install 
   * You will need install superagent - npm install superagent
   * A few new files will be added, error-middeware and logger-middleware.js, and <name>-auth-middleware.js  If an error occurs it will
   automatically reach and respond with the error code listed in the error-middleware file. The logger-middeware 
   will show you updates of whats happening in your code. You can see the log when you are doing testing 
   and its a new resource to see where errors may have a occurred. 
   * In your __test__ file you will be adding <nameoffolder>-mock.js and a test.env.js file as well. Your are going 
   to need to add your mongodb and port information for your server to run. 

#### Testing  
* POST - test 400, if no request body has been provided or the body is invalid
* POST - test 200, if the request body has been provided and is valid
/api/signin
* GET - test 401, if the user could not be authenticated
* GET - test 200, responds with token for a request with a valid basic authorization header

   * You will need to have 2 terminal windows open when you are ready to test.
   * When you are ready to test type -npm run test in one
   * And the other one run -npm run dbOn

####  Authors
* Brai Frauen 

#### License 
This project is licensed under the MIT License - see the LICENSE.md file for details

#### Version
* 1.0.2
