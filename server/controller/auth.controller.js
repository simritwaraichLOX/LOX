const fs = require("fs");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const db = require("../lib/db.js");
const config = require("../lib/auth.config");

exports.signup = async (req, res, next) => {
  db()
    .query("SELECT * FROM users WHERE LOWER(username) = LOWER(?)", [
      req.body.username,
    ])
    .then(([users, fields]) => {
      if (users.length) {
        return res.status(500).send({
          msg: "This username is already in use!",
        });
      } else {
        // Username is available. Check Email
        db()
          .query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [
            req.body.email,
          ])
          .then(([email, fields]) => {
            if (email.length) {
              return res.status(500).send({
                msg: "This email is already in use!",
              });
            } else {
              // Email is available. Insert new User.
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                // Hash Password
                if (err) {
                  return res.status(500).send({
                    msg: err,
                  });
                } else {
                  // Has hashed pw => add to database
                  var dateTime = new Date(); // Current DateTime
                  var uid = uuid.v4(); // Unique ID

                  db()
                    .query(
                      `INSERT INTO users (unique_id, first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
                      [
                        uid,
                        req.body.first_name,
                        req.body.last_name,
                        req.body.username,
                        req.body.email,
                        hash,
                      ]
                    )
                    .then((result) => {
                      return {
                        msg: "Registered!",
                        data: result[0],
                      };
                    })
                    .then((result) => {
                      if (!fs.existsSync("./uploads/" + result.data.insertId)) {
                        console.log(
                          "No Existing Directory. Creating Directory."
                        );
                        fs.mkdirSync("./uploads/" + result.data.insertId);
                      }

                      db()
                        .query(
                          `INSERT INTO user_roles (user_id, role_id) VALUES (?,?)`,
                          [result.data.insertId, 2]
                        )
                        .then((result) => {
                          res.status(201).send({
                            msg: "Registered!",
                            data: result[0],
                          });
                        })
                        .catch((err) => {
                          return res.status(500).send({
                            msg: err,
                          });
                        });
                    })
                    .catch((err) => {
                      return res.status(500).send({
                        msg: err,
                      });

                      // Add query to add role when signing up new user & create directory
                    });
                }
              });
            }
          });
      }
      return users;
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err,
      });
    });
};

exports.login = async (req, res, next) => {
  db()
    .query(`SELECT * FROM users WHERE LOWER(username) = LOWER(?)`, [
      req.body.username,
    ])
    .then(([users, fields]) => {
      if (!users.length) {
        return res.status(401).send({
          msg: "Username or password is incorrect!",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        users[0].password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: users[0].unique_id }, config.secret, {
        expiresIn: 86400, // 24 hrs
      });
      var authorities = [];
      var roles = [];
      db()
        .query(`SELECT * FROM user_roles WHERE user_id = ?`, [users[0].id])
        .then(([rows, fields]) => {
          for (let i = 0; i < rows.length; i++) {
            roles.push(rows[i].role_id);
          }

          db()
            .query(`SELECT * FROM roles WHERE id IN (?)`, [roles])
            .then(([rows, fields]) => {
              for (let i = 0; i < rows.length; i++) {
                authorities.push("ROLE_" + rows[i].role_name.toUpperCase());
              }
              return res.status(200).send({
                msg: "Log in Successful!",
                id: users[0].id,
                username: users[0].username,
                email: users[0].email,
                roles: authorities,
                accessToken: token,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
