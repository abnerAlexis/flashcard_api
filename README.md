1. Run the following code in your terminal will generate a new “package.json” file with information about the current directory:

`npm init --yes`  
or:

`npm init -y`

2. nd in the terminal:   
`npm install express`  

3. To install body-parser, run the following command in the terminal:   
`npm install body-parser`

4. Install lodash, type the following command in your terminal (install it into the project directory!):  
`npm install lodash`

5. To install eslint as a dev dependency, run the following command in the terminal:  
`npm install eslint --save-dev`

6. Install morgan, type the following command in your terminal (install it into the project directory!):  
`npm install morgan`

7. Install nodemon, type the following command in your terminal (install it into the project directory!):  
`npm install nodemon --save-dev`  
Nodemon watches for any changes made to your project files.  
Whenever a change is detected, Nodemon automatically restarts your Node.js application.  
This eliminates the need to manually stop and restart your server after every code modification, significantly speeding up your development cycle. (`node filename.js`)  
You can focus on coding without interruptions, as Nodemon handles the restarts seamlessly. (`npm run dev)



### START PROJECT
node index.js  
or  
npm run dev (To use this; update your package.json as follows;  
```
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```
)

NOTE: 

`npm install` command generates a new “node_modules” folder containing all the corresponding package folders.