
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const dataFile = path.join(__dirname, 'attendance.json');

// Load data or initialize
let students = [];
if (fs.existsSync(dataFile)) {
  students = JSON.parse(fs.readFileSync(dataFile));
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { students });
});

app.post('/add-student', (req, res) => {
  students.push({ name: req.body.name, status: 'Absent' });
  fs.writeFileSync(dataFile, JSON.stringify(students));
  res.redirect('/');
});

app.post('/mark-attendance', (req, res) => {
  const name = req.body.name;
  students = students.map(student =>
    student.name === name ? { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' } : student
  );
  fs.writeFileSync(dataFile, JSON.stringify(students));
  res.redirect('/');
});

app.get('/summary', (req, res) => {
  res.render('summary', { students });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { studentId, section, subject } = req.body;
    console.log(`Login received: Student ID=${studentId}, Section=${section}, Subject=${subject}`);
    res.send('Login successful. You can now mark attendance.');
});
