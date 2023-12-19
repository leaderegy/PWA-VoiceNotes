// Import the required modules
import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import { createServer } from "http";


// Create an express app
const app = express();
createServer(app);

app.set('trust proxy', true)






// Use the cors middleware to enable cross-origin resource sharing
app.use(cors());
// Use the express.json middleware to parse the request body as JSON
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }))



app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});



mongoose.connect("mongodb://127.0.0.1:27017/VoiceDB");

const dbConnection = mongoose.connection
dbConnection.on('error', (error) => console.log(error))
dbConnection.on('open', () => console.log('Connected to Database!'))

// Listen for requests on the port 4000
app.listen(4001, () => {
  console.log("Server started on port 4001");
});

// Define the schema and model for the data collection
const DataSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  audio: Buffer,
  title: String,
  status: String
});

const Data = mongoose.model("Recording", DataSchema);

// Define the API endpoints for the data collection
app.get("/api/data", async (req, res) => {
  // Get all the data from the database
  const data = await Data.find();
  // Send the data as a JSON response
  res.json(data);
});

// Define the API endpoints for get by Id
app.get("/api/data/:id", async (req, res) => {
  // Get by Id from the database
  const data = await Data.findById(req.params.id);  
  // Send the data as a JSON response
  res.json(data);
});

app.post("/api/data1", async (req, res) => {
  //console.log("inside post1..", Date.now())

  // const obj = JSON.parse(req.body.audio)
  // const values = Object.values(obj);
  // const array = Array.from(values);
  // req.body.audio = array
  // Log the array
  //console.log(req.body)
  // Create a new data document with the request body
  const data = new Data(req.body);
  // Save the data to the database
  await data.save();
  // Send the data as a JSON response
  res.json(req.body.audio);
});

app.put("/api/data/:id", async (req, res) => {
  // Find and update the data document by id with the request body
  const data = await Data.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // Send the data as a JSON response
  res.json(data);
});

app.delete("/api/data/:id", async (req, res) => {
  // Find and delete the data document by id
  const data = await Data.findByIdAndDelete(req.params.id);
  // Send the data as a JSON response
  res.json(data);
});