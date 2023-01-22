require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

app.get("/api/departments", function (req, res) {
  db.query("SELECT * FROM departments", function (err, results) {
    console.log(results);
  });
});

app.get("/api/departments/:id", function (req, res) {
  db.query(
    "SELECT * FROM departments WHERE id = ?",
    1,
    function (error, results) {
      res.json(results);
    }
  );
});

// router.get('/notes/:id', (req, res) => {
// const noteId = req.params.id;
// readFromFile('./db/db.json')
//     .then((data) => JSON.parse(data))
//     .then((json) => {
//     const result = json.filter((note) => note.id === noteId);
//     return result.length > 0
//         ? res.json(result)
//         : res.json('No note with that ID');
//     });
// });

app.get("/api/roles", function (req, res) {
  db.query("SELECT * from roles", function (error, results) {
    res.json(results);
  });
});

app.get("/api/roles", function (req, res) {
  db.query("SELECT * from roles", function (error, results) {
    res.json(results);
  });
});

// app.post("/api/add-movie", (req, res) => {
//   const { movie_name } = req.body;
//   console.log(movie_name);

//   db.query(
//     "INSERT INTO movies (movie_name) VALUES (?);",
//     movie_name,
//     function (error, results) {
//       res.json(results);
//     }
//   );
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
