import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import routes from "./routes/api/index.js";
import { FileStorage } from "./models/fileStorage/index.js";

export const db = new FileStorage();
db.starter();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8081;

const dataFilePath = path.join(__dirname, "data.json");

// mvc
// models
// views
// controllers

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

function readPosts() {
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading posts data", err);
    return [];
  }
}

// Middleware to write posts to DATA.json
const writePosts = (posts) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
};

app.use("/api/v1", routes);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/views/404.html");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
