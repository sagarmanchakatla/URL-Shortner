const express = require("express");

const urlRoute = require("./routes/url");

const staticRoute = require("./routes/staticRoute");

const { connectToMongoDb } = require("./connection");

const URL = require("./models/url");

const path = require("path");

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://127.0.0.1:27017/url-shortener").then(() =>
  console.log("Mongodb connection established")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", { urls: allUrls });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: new Date(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
