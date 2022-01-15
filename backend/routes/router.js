import express from "express";
import mongoose from "mongoose";
import Cafes from "../mongo/models/Cafes";
import { SaveCafeName, updateCafeComment, searchComment } from "../mongo/mongo";

const router = express.Router();
const { google } = require("googleapis");

const db = mongoose.connection;
db.on("error", (err) => console.log(err));

const GOODLE_CLIENT_ID =
  "824943228622-9cffm6j6jboi5v04j7o1sla2rvekva0k.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const REFRESH_TOKEN_Test =
  "1//0eWkLTLb7tNerCgYIARAAGA4SNwF-L9IrNpljK8LqrW4DStuYmO5nk7TCGaPEY90oTn0Q7isGyAhNer9Fr-mMZXT5Ph3bKEwA_CQ";
let ACCESS_TOKEN = "";

// 使用OAuth2來將資料送到Google日曆
const oauth2Client = new google.auth.OAuth2(
  GOODLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

router.get("/", async (req, res, next) => {
  res.send({ message: "piyanapi is working" });
});

router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens.refresh_token);
    ACCESS_TOKEN = tokens.access_token;
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;

    oauth2Client.setCredentials({ access_token: ACCESS_TOKEN });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "1",
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/get-cafe-name", async (req, res, next) => {
  try {
    const { cafeName } = req.body;
    // console.log(cafeName)
    await SaveCafeName(cafeName);
  } catch (error) {
    next(error);
  }
});

router.post("/create-comment", async (req, res, next) => {
  try {
    const { cafeNameForComment, comment } = req.body;
    // console.log(comment)
    // console.log(cafeNameForComment)

    await updateCafeComment(cafeNameForComment, comment);
  } catch (error) {}
});

router.get("/get-comments", async (req, res, next) => {
  const name = req.query.name;

  const target = await searchComment(name);
  console.log(target);

  res.send({ comments: target });
});

export default router;
