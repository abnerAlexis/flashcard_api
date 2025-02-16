const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(morgan('common', { stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' }) }));

mongoose.connect('mongodb://localhost:27017/flashcardDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/doc', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

const Users = Models.User;
const Courses = Models.Course;
const FlashCards = Models.Flashcard;

//  √   Get list of users
app.get(
    "/users",
    async (req, res) => {
        await Users.find()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    });

//  Get user by userId
app.get('/users/id/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Convert the string ID to an ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(userId);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid user ID format' }); // Handle invalid ObjectId strings
        }

        const user = await Users.findOne({ _id: objectId }); // Use the ObjectId in the query

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  √   Get user by name
app.get('/users/username/:username', async (req, res) => {
    await Users.findOne({ username: req.params.username })
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
        })
});

//  √   Get a users courses by userid
app.get('/courses/:userid', async (req, res) => {
    const userId = req.params.userid;

    try {
        //  Convert userId from string to objectid
        const objectId = new mongoose.Types.ObjectId(userId);
        userCourses = await Courses.find({ userid: objectId });
        if (userCourses.length === 0) {
            return res.status(404).json({ error: "No courses found for this user." });
        }
        res.json(userCourses);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/flashcards/:courseid', async (req, res) => {
    const courseId = req.params.courseid;
    try {
        const objectId = new mongoose.Types.ObjectId(courseId);
        courseFlashcards = await FlashCards.find({ course_id: objectId });
        if (courseFlashcards.length === 0) {
            return res.status(404).json({ error: "No flashcards found for this course." });
        }
        res.json(courseFlashcards);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//POST REQUESTS

//  √   Add new user
app.post("/users", async (req, res) => {
   try {
    const existingUser = await Users.findOne({username: req.body.username});
    if (existingUser) {
        return status(400).send(req.body.username + 'alredy exist.');
    }
    const newUser = await Users.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    res.status(201).json(newUser).send(username + ' Welcome to flashcard app.');
   } catch(error) {
    console.error("Error creating user:", error);
    res.status(500).json({error: error.message});
   }
});

//============================TO DO=============================================

//  Add new course using userid
app.post("/courses/:userid", (req, res) => {
    try {
        const { userid } = req.params; // Extract userId from the request URL
        const { courseName } = req.body; // Extract courseName from request body

        // Validate if courseName is provided
        if (!courseName) {
            return res.status(400).json({ message: "Course name is missing in your request." });
        }

        // Check if the user exists before adding the course
        const userExists = users.some(user => user._id === userid);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        // Create a new course
        const newCourse = {
            _id: uuidv4(), // Generate a unique ID
            userId: userid, // Assign user ID from params
            courseName
        };

        // Add to courses array
        courses.push(newCourse);

        // Respond with the newly created course
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error adding the new course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//  PUT REQUESTS

app.put('/users/:username', (req, res) => {
    let user = users.find(user => {
        return user.username === req.params.username
    });

    if (user) {
        user.email(req.params.classs)
    }
})

//  √   DELETE REQUESTS
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id.toString();
    const userIndex = users.findIndex(user => user._id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1); //Removing user from the array
        res.status(200).json({ message: `User ${userId} was deleted.` });
    } else {
        res.status(404).json({ message: "User not found." });
    }
});

// Listening for requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((error, req, res, next) => {
    console.log(`Error: ${error.stack}`);
    res.status(500).send("Something broke.")
})

//GET USER BY ID AND DELETE FUNCTIONS ARE TO DOS