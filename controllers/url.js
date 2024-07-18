const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body) return res.status(400).json({ error: "URL is required" });
  const shortId = shortid();

  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });
  return res.render("home", {
    id: shortId,
  });
  // return res.status(200).json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });
  // if (!result) {
  //   return res.status(404).json({ error: "Short URL not found" });
  // }

  // // const visitedHistory = result.visitedHistory || [];
  // return res.json({
  //   totalClicks: result.visitedHistory.length,
  // });
  // console.error("Error fetching analytics:", error);
  // return res.status(500).json({ error: "Internal Server Error" });
  // console.log(result);
  // console.log(result.visitedHistory.length);
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
