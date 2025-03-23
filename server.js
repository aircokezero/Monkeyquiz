require("dotenv").config();
const http = require("http");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const querystring = require("querystring");

// Load environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://niharsudheer3:alalalwa@monkeyquiz.h5655.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(MONGO_URI);
const dbName = "monkeyquiz";
const collectionName = "profiles";

// Connect to MongoDB **once** and reuse the connection
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

// Helper function to serve static files
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

// Create HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      serveStaticFile(res, path.join(__dirname, "public", "login_signup", "sign_up_page.html"), "text/html");
      return;
    }
    if (req.url === "/login") {
      serveStaticFile(res, path.join(__dirname, "public", "login_signup", "login_page.html"), "text/html");
      return;
    }
    if (req.url === "/signup") {
      serveStaticFile(res, path.join(__dirname, "public", "login_signup", "sign_up_page.html"), "text/html");
      return;
    }
    if (req.url.startsWith("/public/")) {
      serveStaticFile(res, path.join(__dirname, req.url), "text/css");
      return;
    }
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        let formData;
        if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
          formData = querystring.parse(body);
        } else {
          formData = JSON.parse(body);
        }

        const usersCollection = await connectDB();

        if (req.url === "/signup") {
          // Validate input
          if (!formData.email || !formData.password || !formData.username) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "All fields are required" }));
            return;
          }

          // Check if email already exists
          const existingUser = await usersCollection.findOne({ email: formData.email });
          if (existingUser) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User already exists" }));
            return;
          }

          // Hash the password before storing it
          const hashedPassword = await bcrypt.hash(formData.password, 10);

          // Insert new user with role
          await usersCollection.insertOne({
            username: formData.username,
            email: formData.email,
            password: hashedPassword, // Storing hashed password
            role: formData.role || "user",
          });

          console.log("✅ User added:", formData);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Sign-up successful!" }));
          return;
        }

        if (req.url === "/login") {
          if (!formData.email || !formData.password) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Email and password are required" }));
            return;
          }

          // Check if user exists
          const user = await usersCollection.findOne({ email: formData.email });
          if (!user) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid credentials" }));
            return;
          }

          // Validate password
          const passwordMatch = await bcrypt.compare(formData.password, user.password);
          if (!passwordMatch) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid credentials" }));
            return;
          }

          console.log("✅ User logged in:", user.email);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Login successful!" }));
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

  // Handle 404 for unknown routes
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
