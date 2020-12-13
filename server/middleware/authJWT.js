const jwt = require("jsonwebtoken");
const config = require("../lib/auth.config.js");
const db = require("../lib/db.js");
const getRoles = require("../controller/admin.controller");

isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret-key");
    req.userData = decoded;

    next();
  } catch (err) {
    return res.status(401).send({
      msg: "Your session is not valid!",
    });
  }
};

isUser = (req, res, next) => {
  try {
    db()
      .query("SELECT * FROM users WHERE unique_id = ?", [req.userData.id])
      .then(([users, fields]) => {
        if (users.length) {
          // User's id equal to accessToken provided id continue
          let userID = users[0].id;

          if (userID == req.params.id) {
            next();
          } else {
            // Deny user access
            return res.status(401).send({
              msg: "Access Denied",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    return res.status(401).send({
      msg: "Access Denied",
    });
  }
};

isAdmin = (req, res, next) => {
  var authorities = [];
  var roles = [];
  // Query for Unique User ID
  db()
    .query("SELECT * FROM users WHERE unique_id = ?", [req.userData.id])
    .then(([users, fields]) => {
      if (users.length) {
        // User's id exists & equal to accessToken provided id
        let userID = users[0].id;
        // Query User ID for current Role IDs
        db()
          .query(`SELECT * FROM user_roles WHERE user_id = ?`, [userID])
          .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
              roles.push(rows[i].role_id);
            }
            // Query Role IDs for each user role
            db()
              .query(`SELECT * FROM roles WHERE id IN (?)`, [roles])
              .then(([rows, fields]) => {
                for (let i = 0; i < rows.length; i++) {
                  if (rows[i].role_name == "admin") {
                    console.log("You are an admin!");
                    next();
                    return;
                  }
                }
                res.status(403).send({
                  message: "Require Admin Role!",
                });
                return;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(401).send({
          message: "Unauthorized",
        });
      }
    });
};

isModerator = (req, res, next) => {
  // Find User req.fa-user-injured
  // Find Roles by ID
  // If Role Mod
  next();
  return;
};

const authJWT = {
  isLoggedIn: isLoggedIn,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isUser: isUser,
};

module.exports = authJWT;

// const jwt = require("jsonwebtoken");

// isLoggedIn = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, "secret-key");
//     req.userData = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).send({
//       msg: "Your session is not valid!",
//     });
//   }
// };

// const verifyIsLoggedIn = {
//   isLoggedIn: isLoggedIn,
// };

// module.exports = verifyIsLoggedIn;
