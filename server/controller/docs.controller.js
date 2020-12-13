const fs = require("fs");
const db = require("../lib/db.js");
const multer = require("multer");
const path = require("path");
const helpers = require("../middleware/helpers");
const __basedir = path.dirname(require.main.filename);

exports.searchFile = async (req, res, next) => {};

// Make Directory
exports.makeDirectory = (req, res) => {};

// Download User File Within their specific user Folder
exports.download = (req, res) => {
  const userId = req.body.id;
  const storageName = req.body.storage_name;
  const directoryPath = __basedir + `/uploads/${userId}/`;

  res.download(directoryPath + storageName, storageName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

// Upload to a specific user Folder
exports.upload = async (req, res, next) => {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { userId } = req.body;
      const dir = `./uploads/${userId}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      cb(null, dir);
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).single("files");

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    let keyword_ids = req.body.keywords.split(",");
    console.log(keyword_ids);
    db()
      .query(
        `INSERT INTO files (file_name, storage_name, file_path, file_size) VALUES(?,?,?,?)`,
        [req.file.originalname, req.file.filename, req.file.path, req.file.size]
      )
      .then(([result, fields]) => {
        const { userId } = req.body;
        const insertId = result.insertId;
        console.log(insertId);
        db()
          .query(`INSERT INTO user_files (user_id, file_id) VALUES(?,?)`, [
            userId,
            result.insertId,
          ])
          .then((result) => {
            db()
              .query(`SELECT id FROM keywords WHERE id IN (?)`, [keyword_ids])
              .then(([result, fields]) => {
                for (let i = 0; i < result.length; i++) {
                  db()
                    .query(
                      `INSERT INTO files_keywords (file_id, keyword_id) VALUES(?,?)`,
                      [insertId, result[i].id]
                    )
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });

            res.status(201).send({
              msg: "File Upload Success!",
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
  });
};

exports.getFile = async (req, res, next) => {
  db()
    .query(`SELECT file_id FROM user_files WHERE user_id = (?)`, [
      req.params.id,
    ])
    .then((result) => {
      let library = [];
      for (let i = 0; i < result[0].length; i++) {
        library.push(result[0][i].file_id);
      }
      db()
        .query(`SELECT * FROM files WHERE id IN (?)`, [library])
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
    })
    .catch((err) => {
      return res.status(200).send({
        msg: "Empty",
        err: err,
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
    .catch((err) => console.log(err));
};

exports.getFileByKeywords = async (req, res, next) => {
  keyword_ids = [];
  for (let i = 0; i < req.body.length; i++) {
    keyword_ids.push(req.body[i].id);
  }
  console.log("Printing Keyword IDs:");
  console.log(keyword_ids);
  db()
    .query(`SELECT * FROM files_keywords WHERE keyword_id IN (?)`, [
      keyword_ids,
    ])
    .then(([result, fields]) => {
      let library = [];
      all_file_ids = [];

      for (let i = 0; i < result.length; i++) {
        all_file_ids.push(result[i].file_id);
      }
      if (all_file_ids.length != 0) {
        console.log("Files exist related to keywords provided");
        db()
          .query(`SELECT * FROM user_files WHERE file_id IN (?)`, [
            all_file_ids,
          ])
          .then(([result, fields]) => {
            user_file_ids = [];
            console.log("All results related to keywords");
            console.log(result);
            for (let i = 0; i < result.length; i++) {
              if (req.params.id == result[i].user_id) {
                user_file_ids.push(result[i].file_id);
              }
            }
            if (user_file_ids.length != 0) {
              console.log("Files exist related to user");
              db()
                .query(`SELECT * FROM files WHERE id IN (?)`, [user_file_ids])
                .then(([result, fields]) => {
                  console.log(result);
                  res.status(200).send({
                    data: result,
                  });
                })
                .catch((err) => console.log(err));
              console.log(user_file_ids);
            } else {
              console.log("No items related");
              return res.status(200).send({
                msg: "No items found",
                data: null,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        res.status(200).send({
          msg: "empty",
        });
      }
      // We have all the Keyword IDs
      // We have all File IDs
      // Query user_files in file_ids
      // If user_id == req.params.id push to array and send
    })
    .catch((err) => console.log(err));
};

// get_last_file_id() {
//   var return_value = false;
//   return new Promise((resolve, reject) => {
//     this.db().get(
//       "SELECT DISTINCT id FROM messages ORDER BY timestamp;",
//       [],
//       (error, row) => {
//         if (!error) {
//           resolve(row.msgid);
//         } else {
//           //  Provide feedback for the error
//           console.log(error);
//           resolve(false);
//         }
//       }
//     );
//   });
// }
