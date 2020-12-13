const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./lib/db.js");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const fs = require("fs");
const start_clean = false;

const corsOptions = {
  origin: 'http://ec2-3-96-168-166.ca-central-1.compute.amazonaws.com',
};

// const corsOptions = {
//   origin: "https://ec2-54-151-50-194.us-west-1.compute.amazonaws.com",
// }

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("/public"));

// Routes
// const routes = require("./routes/router");
// app.use("/api", routes);

(async () => {
  if (!start_clean) return;

  bcrypt.hash("Testing123!", 10, (err, hash) => {
    // Hash Password
    if (err) {
      console.log(err);
    } else {
      var uid = uuid.v4(); // Unique ID
      db()
        .query(
          `INSERT INTO users (unique_id, first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
          [uid, "The", "Admin", "the.admin", "the.admin@gmail.com", hash]
        )
        .then((result) => {
          return {
            data: result[0],
          };
        })
        .then((result) => {
          if (!fs.existsSync("./uploads/" + result.data.insertId)) {
            console.log("No Existing Directory. Creating Directory.");
            fs.mkdirSync("./uploads/" + result.data.insertId);
          }

          db()
            .query(`INSERT INTO user_roles (user_id, role_id) VALUES (?,?)`, [
              result.data.insertId,
              1,
            ])
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}).call();



require("./routes/router")(app);

// database init method could be developed

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

