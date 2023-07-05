const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./data/database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT,
    lname TEXT,
    dob DATE,
    parentName TEXT,
    address TEXT,
    city TEXT,
    phoneNumber TEXT,
    grade TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectName TEXT,
    marks INTEGER,
    studentId INTEGER,
    FOREIGN KEY (studentId) REFERENCES students (id)
  )
`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/students', (req, res) => {
  const { fname, lname, dob, parentName, address, city, phoneNumber, grade } = req.body;
  db.run(`INSERT INTO students (fname, lname, dob, parentName, address, city, phoneNumber, grade)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [fname, lname, dob, parentName, address, city, phoneNumber, grade],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error adding student');
            } else {
              res.status(200).send('Student added successfully');
            }
          });
});

app.post('/marks', (req, res) => {
  const { subjectName, marks, studentId } = req.body;
  db.run(`INSERT INTO marks (subjectName, marks, studentId)
          VALUES (?, ?, ?)`,
          [subjectName, marks, studentId],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error adding marks');
            } else {
              res.status(200).send('Marks added successfully');
            }
          });
});

app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching students');
    } else {
      res.json(rows);
    }
  });
});

app.get('/students/average-marks-greater-than-60', (req, res) => {
  db.all(`SELECT students.id, students.fname, students.lname, AVG(marks.marks) AS average
          FROM students
          INNER JOIN marks ON students.id = marks.studentId
          GROUP BY students.id, students.fname, students.lname
          HAVING average > 60`,
          (err, rows) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error fetching students');
            } else {
              res.json(rows);
            }
          });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
