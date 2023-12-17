const express = require("express");
const app = express();
const port = 8000;
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Pluto@2013',
  });

  let getRandomUser =  () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  }

  //Inserting Data from Faker//
  let q = "INSERT INTO user (id, username, email, password) VALUES ?";

  //let data = []; --> Not needed cz 100 users have been added
  //for (i=1; i<=100; i++) {
  //  data.push(getRandomUser());
  //}


  //Home Route
  app.get("/", (req, res) => {
    let q =  `SELECT count(*) FROM user`;
    try{
    connection.query(q, (err, result) => {
        if (err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
    });
    } catch(err) {
    console.log(err);
    res.send("Some error occured in our DB");
    };
  });

  //Show Route
  app.get("/user", (req, res) => {
    let q =  `SELECT * FROM user`;

    try{
    connection.query(q, (err, users) => {
        if (err) throw err;
        res.render("users.ejs", {users});
    });
    } catch(err) {
    console.log(err);
    res.send("Some error occured in our DB");
    };
  });

  //Edit Route
  app.get("/user/:id/edit", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
      connection.query(q, (err, result) => {
          if (err) throw err;
          let user = result[0];
          res.render("edit.ejs", {user});
      });
      } catch(err) {
      console.log(err);
      res.send("Some error occured in our DB");
      };
  });

  //Update Route (DB)
  app.patch("/user/:id", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    let {password: formPass, username: newUsername} = req.body;
    try{
      connection.query(q, (err, result) => {
          if (err) throw err;
          let user = result[0];
          if (formPass != user.password) {
            res.send("Wrong Password ENTERED");
          } else {
            let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;
            connection.query(q2, (err, result) => {
              if (err) throw err;
              res.redirect("/user");
            });
          }
        });
      } catch(err) {
      console.log(err);
      res.send("Some error occured in our DB");
      };
  });


  app.listen(port, () => {
    console.log( `App is listening in ${port}`);
  });

 //connection.end();
