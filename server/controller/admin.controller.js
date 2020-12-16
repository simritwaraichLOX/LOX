const fs = require("fs");
const db = require("../lib/db.js");
const multer = require("multer");
const path = require("path");
const helpers = require("../middleware/helpers");
const __basedir = path.dirname(require.main.filename);

/**
 **************************************************************
 **************************************************************
 *
 *
 * Admin - User Controller
 *
 *
 **************************************************************
 */

exports.createUser = async (req, res, next) => {
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
                          [result.data.insertId, req.body.role_id]
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

// Get All Users
exports.getAllUsers = (req, res) => {
  db()
    .query(`SELECT * FROM users`)
    .then(([rows, fields]) => {
      let library = [];

      //   for (let i = 0; i < rows[0].length; i++) {
      //     const entry = {
      //       first_name: rows[i].first_name,
      //       last_name: rows[i].last_name,
      //       email: rows[i].email,
      //       username: rows[i].username,
      //       registered: rows[i].registered,
      //       last_login: rows[i].last_login,
      //     };
      //     library.push(entry);
      //   }
      return res.status(200).send({
        data: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Edit User / Update User
exports.updateUser = (req, res) => {
  console.log(req.body);
  let user = req.body;

  db()
    .query(
      `Update users SET first_name = ?, last_name = ?, email = ?, username = ? WHERE id = ?`,
      [user.first_name, user.last_name, user.email, user.username, user.id]
    )
    .then(([rows, fields]) => {
      res.status(201).send({
        msg: "User Updated",
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err,
      });
    });
};

// Get User Role By ID

async function getUserRole(userID) {
  db()
    .query(`SELECT * FROM user_roles WHERE user_id = ?`, [userID])
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
            id: users[0].id,
            roles: authorities,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 **************************************************************
 **************************************************************
 *
 * Admin - File Controller
 *
 *
 *
 **************************************************************
 */

// Get Specific File

exports.getFile = async (req, res, next) => {
  //   db()
  //     .query(`SELECT file_id FROM user_files WHERE user_id = (?)`, [
  //       req.params.id,
  //     ])
  //     .then((result) => {
  //       let library = [];
  //       for (let i = 0; i < result[0].length; i++) {
  //         library.push(result[0][i].file_id);
  //       }
  console.log();
  db()
    .query(`SELECT * FROM files`)
    .then((result) => {
      res.status(201).send({
        msg: "Get Files Success!",
        data: result[0],
      });
    })
    .catch((err) => {
      return res.status(200).send({
        msg: "Empty",
        err: err,
      });
    });
};
//     })
//     .catch((err) => {
//       return res.status(200).send({
//         msg: "Empty",
//         err: err,
//       });
//     });
// };

/**
 **************************************************************
 **************************************************************
 *
 *
 * Admin - Keyword Controller
 *
 *
 **************************************************************
 */

exports.createKeyword = async (req, res, next) => {
  db()
    .query("SELECT * FROM keywords WHERE LOWER(keyword_name) = LOWER(?)", [
      req.body.keyword,
    ])
    .then(([keywords, fields]) => {
      console.log(keywords.length);
      if (keywords.length) {
        return res.status(500).send({
          msg: "This keyword already exists!",
        });
      } else {
        db()
          .query(
            "INSERT INTO keywords (keyword_name, description) VALUES (?, ?)",
            [req.body.keyword, req.body.description]
          )
          .then((result) => {
            return res.status(200).send({
              data: result,
            });
          })
          .catch((err) => {
            return res.status(500).send({
              msg: err,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err,
      });
    });
};

exports.getKeywords = async (req, res, next) => {
  db()
    .query("SELECT * FROM keywords")
    .then(([keywords, fields]) => {
      return res.status(200).send({
        data: keywords,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: err,
      });
    });
};
