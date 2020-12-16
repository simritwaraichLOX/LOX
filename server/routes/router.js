const router = require("express").Router();
const authController = require("../controller/auth.controller");
const adminController = require("../controller/admin.controller");
const docsController = require("../controller/docs.controller");
const verifySignUp = require("../middleware/verifySignUp");
const authJWT = require("../middleware/authJWT");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    
    next();
  });

  /**
   * Admin Services
   * -----------------------
   * Get All Users - Check JWT & isAdmin
   * Create User - Check JWT & isAdmin
   * Create Keyword - Check JWT & isAdmin
   */

  app.get(
    "/api/admin/users",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.getAllUsers
  );

  app.post(
    "/api/admin/files",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.getFile
  );

  app.post(
    "/api/admin/users",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.createUser
  );

  app.post(
    "/api/admin/update_users",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.updateUser
  );

  app.post(
    "/api/admin/keywords",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.createKeyword
  );

  app.get(
    "/api/admin/keywords",
    [authJWT.isLoggedIn, authJWT.isAdmin],
    adminController.getKeywords
  );

  /**
   * User Routes
   * -----------------------
   * Sign up and Login
   * Create File
   * Download File
   * Find File By User ID
   * Search By Column? Search All
   */

  /**
   * Sign Up and Log In
   */
  app.post("/api/sign-up", verifySignUp, authController.signup);

  app.post("/api/login", authController.login);

  /**
   * File Upload / Download
   */
  app.post("/api/upload", authJWT.isLoggedIn, docsController.upload);

  app.post("/api/download", authJWT.isLoggedIn, docsController.download);

  /**
   * Get Files by User ID
   */
  app.get(
    "/api/file/:id",
    [authJWT.isLoggedIn, authJWT.isUser],
    docsController.getFile
  );

  /**
   * Get Keywords
   */
  app.get("/api/keywords", authJWT.isLoggedIn, docsController.getKeywords);

  /**
   * Search
   */

  app.post(
    "/api/filterbykeywords/:id",
    [authJWT.isLoggedIn, authJWT.isUser],
    docsController.getFileByKeywords
  );
};
