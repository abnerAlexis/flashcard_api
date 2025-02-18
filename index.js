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
app.use(express.urlencoded({ extended: true }));
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

//  √   Get list of courses
app.get(
    "/courses",
    async (req, res) => {
        await Courses.find()
            .then(courses => {
                res.status(200).json(courses);
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    });

//  √   Get list of flashcards
app.get(
    "/flashcards",
    async (req, res) => {
        await FlashCards.find()
            .then(flashcards => {
                res.status(200).json(flashcards);
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

//  √   Get a flashcards by  course id
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
        const existingUser = await Users.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send(req.body.username + 'alredy exist.');
        }
        const newUser = await Users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
});

//  Add new course using userid
app.post("/courses/:userid", async (req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.params.userid);
        const existingCourse = await Courses.findOne({ userid: objectId });
        if (existingCourse) {
            return res.status(400).send(req.params.userid + ' already exists.');
        }
        const newCourse = await Courses.create({
            userid: objectId,
            name: req.body.name,
        })
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: error.message });
    }
});

//  Add new flashcard
app.post('/flashcards/:courseid', async (req, res) => {
    // console.log("Request Body:", req.body); // Debugging output
    try {
        const objectid = new mongoose.Types.ObjectId(req.params.courseid);

        const newFlashcard = await FlashCards.create({
            course_id: objectid,
            question: req.body.question,
            answer: req.body.answer,
            imageURL: req.body.imageURL,
        });
        // console.log("Created Flashcard:", newFlashcard); // Log created object
        res.status(201).json(newFlashcard);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: error.message });
    }
})

//============================TO DO=============================================
//  PUT REQUESTS


//  √   DELETE REQUESTS
        //Delete user account along with all associating courses and flashcards
//Function to delete all courses associating user to be deleted
const deleteCourses = async (userId) => {
    const courses = await Courses.find({ userid: userId });
    const courseIds = courses.map(course => course._id);

    //delete flashcards of courses & and courses of user to be deleted
    await deleteCourseFlashcards(courseIds);
    //delete courses
    await Courses.deleteMany({ userid: userId });
}
//Function to delete flashcards of a course to be deleted
const deleteCourseFlashcards = async (courseIds) => {
    await FlashCards.deleteMany({ course_id: { $in: courseIds } });
};

app.delete('/users/:userid', async (req, res) => {
    try {
        const userId = req.params.userid.toString();
        //checking user's existence in the db
        const user = await Users.findById(userId);
        if (!user) {
            return req.status(404).json({ message: 'User not found.' });
        }
        //Deleting users flashcards of their courses by a method call
        await deleteCourses(userId);

        //Delete user
        await Users.findByIdAndDelete(userId);

        res.status(200).json({ message: `Your user account, along its courses, and associated flashcards were deleted.` });
    } catch (error) {
        console.error("Error deleting user, courses, and flashcards:", error);
        res.status(500).json({ error: error.message });
    }
})

// Delete a  flashcard by its associated course id
app.delete('/flashcards/:courseid', async (req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.params.courseid);
        const flashcard = await FlashCards.findOneAndDelete({ course_id: objectId });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found.' });
        }

        res.status(200).json({ message: 'Flashcard was removed.' });
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a flashcard by its ID ==== Admin
app.delete('/flashcards/del/:id', async (req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const flashcard = await FlashCards.findOneAndDelete({ _id: objectId });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found.' });
        }

        res.status(200).json({ message: 'Flashcard was removed.' });
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        res.status(500).json({ error: error.message });
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