require("dotenv").config();
const http = require("http");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const querystring = require("querystring");
const cookie = require("cookie");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://niharsudheer3:alalalwa@monkeyquiz.h5655.mongodb.net/monkeyquiz?retryWrites=true&w=majority";
const dbName = "monkeyquiz";
const collectionName = "profiles";

let dbInstance;

async function connectDB() {
  if (!dbInstance) {
    try {
      const client = new MongoClient(MONGO_URI);
      await client.connect();
      dbInstance = client.db(dbName);
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      throw error;
    }
  }
  return dbInstance;
}

function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

const server = http.createServer(async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const userId = cookies.userId;

  if (req.method === "GET") {
    if (req.url === "/dashboard" && userId) {
      serveStaticFile(res, path.join(__dirname, "public/student_dashboard/student-dashboard.html"), "text/html");
      return;
    }

    if (req.url === "/api/profile" && userId) {
      try {
        const db = await connectDB();
        const usersCollection = db.collection(collectionName);
        const user = await usersCollection.findOne({ email: userId });

        if (!user) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Profile not found" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ role: user.role, username: user.username }));
        return;
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        return;
      }
    }

    const routes = {
      "/": "public/login_signup/sign_up_page.html",
      "/login": "public/login_signup/login_page.html",
      "/signup": "public/login_signup/sign_up_page.html",
      "/test_page": "public/test_page/test_page.html",
      "/quiz_test": "public/quiz_test/quiz_test.html",
    };

    if (routes[req.url]) {
      serveStaticFile(res, path.join(__dirname, routes[req.url]), "text/html");
      return;
    }

    if (req.url.startsWith("/public/")) {
      const ext = path.extname(req.url);
      const contentType = ext === ".css" ? "text/css" : "text/javascript";
      serveStaticFile(res, path.join(__dirname, req.url), contentType);
      return;
    }
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });

    req.on("end", async () => {
      try {
        let formData = req.headers["content-type"] === "application/x-www-form-urlencoded" 
          ? querystring.parse(body) 
          : JSON.parse(body);

        const db = await connectDB();
        const usersCollection = db.collection(collectionName);

        if (req.url === "/signup") {
          if (!formData.email || !formData.password || !formData.username) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "All fields are required" }));
            return;
          }

          const existingUser = await usersCollection.findOne({ email: formData.email });
          if (existingUser) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User already exists" }));
            return;
          }

          const hashedPassword = await bcrypt.hash(formData.password, 10);
          await usersCollection.insertOne({
            username: formData.username,
            email: formData.email,
            password: hashedPassword,
            role: formData.role || "user",
          });

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Sign-up successful!" }));
          return;
        }

        if (req.url === "/login") {
          const user = await usersCollection.findOne({ email: formData.email });
          if (!user || !(await bcrypt.compare(formData.password, user.password))) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid credentials" }));
            return;
          }

          res.writeHead(200, {
            "Content-Type": "application/json",
            "Set-Cookie": `userId=${user.email}; HttpOnly; Path=/; Max-Age=86400`
          });
          res.end(JSON.stringify({ success: true, user_id: user.email }));
          return;
        }
      } catch (error) {
        console.error("❌ Error processing request:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
