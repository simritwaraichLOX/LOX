const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./lib/db.js");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const fs = require("fs");
const start_clean = true;

const corsOptions = {
  origin: "http://localhost:8081",
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

// async function wipe() {
//   db().query("DROP TABLE IF EXISTS files;");
//   db().query("DROP TABLE IF EXISTS files_keywords;");
//   db().query("DROP TABLE IF EXISTS keywords;");
//   db().query("DROP TABLE IF EXISTS roles;");
//   db().query("DROP TABLE IF EXISTS users;");
//   db().query("DROP TABLE IF EXISTS user_files;");
//   db().query("DROP TABLE IF EXISTS user_roles;");
//   db().query("SET FOREIGN_KEY_CHECKS = 1");
// }

// async function createDB() {
//   await db().query(
//     "CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTO_INCREMENT, file_name TEXT NOT NULL, store_name TEXT NOT NULL, file_path TEXT NOT NULL, file_size TEXT NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB;"
//   );
//   await db().query(
//     "CREATE TABLE IF NOT EXISTS keywords (id INTEGER PRIMARY KEY AUTO_INCREMENT, keyword_name TEXT NOT NULL, description TEXT NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB;"
//   );
//   await db().query(
//     "CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTO_INCREMENT, role_name TEXT NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP, last_updated DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB;"
//   );
//   await db().query(
//     "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTO_INCREMENT, unique_id TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, registered DATETIME DEFAULT CURRENT_TIMESTAMP, last_login DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB;"
//   );
//   await db().query(
//     "CREATE TABLE IF NOT EXISTS user_files (id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER NOT NULL, file_id INTEGER NOT NULL, KEY fileFK (file_id), KEY userFK (user_id)) ENGINE=InnoDB;"
//   );

//   await db().query(
//     "CREATE TABLE IF NOT EXISTS user_roles (id INTEGER PRIMARY KEY AUTO_INCREMENT, role_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP, last_updated DATETIME DEFAULT CURRENT_TIMESTAMP, KEY user_id_FK (user_id), key user_role_FK (role_id)) ENGINE=InnoDB;"
//   );

//   await db().query(
//     "CREATE TABLE IF NOT EXISTS files_keywords (id INTEGER PRIMARY KEY AUTO_INCREMENT, file_id INTEGER NOT NULL, keyword_id INTEGER NOT NULL, KEY keyword_FK (keyword_id), KEY file_FK (file_id)) ENGINE=InnoDB;"
//   );

//   db().query(
//     "ALTER TABLE files_keywords ADD CONSTRAINT file_FK FOREIGN KEY (file_id) REFERENCES files (id), ADD CONSTRAINT keyword_FK FOREIGN KEY (keyword_id) REFERENCES keywords (id);"
//   );

//   db().query(
//     "ALTER TABLE user_files ADD CONSTRAINT fileFK FOREIGN KEY (file_id) REFERENCES files (id), ADD CONSTRAINT userFK FOREIGN KEY (user_id) REFERENCES users (id);"
//   );

//   db().query(
//     "ALTER TABLE user_roles ADD CONSTRAINT user_id_FK FOREIGN KEY (user_id) REFERENCES users (id), ADD CONSTRAINT user_role_FK FOREIGN KEY (role_id) REFERENCES roles (id);"
//   );
// }

(async () => {
  if (!start_clean) return;

  // await wipe();

  // await createDB();

  // await db().query("INSERT INTO roles (role_name) VALUES (?)", "admin");

  // await db().query("INSERT INTO roles (role_name) VALUES (?)", "user");

  db()
    .query("SELECT * FROM users WHERE LOWER(username) = LOWER(?)", [
      "the.admin",
    ])
    .then(([users, fields]) => {
      if (users.length) {
        return;
      } else {
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
                  .query(
                    `INSERT INTO user_roles (user_id, role_id) VALUES (?,?)`,
                    [result.data.insertId, 1]
                  )
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
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
