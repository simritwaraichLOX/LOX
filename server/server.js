const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

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

require("./routes/router")(app);

// database init method could be developed

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
