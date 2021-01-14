const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const keys = require('./config/keys');
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const markRoutes = require('./routes/markRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const internalExamRoutes = require('./routes/internalExamRoutes');

global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: true, saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname));

app.use('/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/internalexam', internalExamRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if(err) return console.log(err);
    console.log(`Listening to port ${PORT}`);
});