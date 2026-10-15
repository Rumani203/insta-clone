const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");

let port = process.env.PORT || 8080;
// Multer Storage Configuration (Photos ko public/uploads me save karne ke liye)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Static files (uploads aur css folder)
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let posts = [
  {
    id: uuidv4(),
    username: "dog",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=60",
    caption: "Loving the sunny weather!",
    likes: "3432 likes",
    view: "view all 3 comments",
    postingTime: "3 days ago"
  }
];
app.get("/", (req, res) => {
    res.redirect("/ig");
});
// 1. Home feed
app.get("/ig", (req, res) => {
  res.render("home.ejs", { posts });
});

// 2. New Post Form
app.get("/ig/new", (req, res) => {
  res.render("new.ejs");
});

// 3. Create Post Route (upload.single('image') se gallery wali photo aayegi)
app.post("/ig", upload.single("image"), (req, res) => {
  let { username, caption, likes, view } = req.body;

  // Agar photo choose ki hai to uploads folder ka path, warna fallback image
  let imagePath = req.file 
    ? `/uploads/${req.file.filename}` 
    : "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60";

  posts.unshift({
    id: uuidv4(),
    username: username || "anonymous",
    image: imagePath,
    caption: caption || "",
    likes: likes ? `${likes} likes` : "0 likes",
    view: view ? `view all ${view} comments` : "view all 0 comments",
    postingTime: "Just now"
  });

  res.redirect("/ig");
});

// 4. Edit Route
app.get("/ig/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit.ejs", { post });
});

// 5. Update Caption
app.patch("/ig/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (post) {
    post.caption = req.body.caption;
  }
  res.redirect("/ig");
});

// 6. Delete Route
app.delete("/ig/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/ig");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/ig`);
});