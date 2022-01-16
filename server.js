import express from 'express'
import morgan from "morgan";
import router from "./backend/routes/router.js";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
const PORT = process.env.PORT || 5000;

app.get("/", async (req, res, next) => {
  res.send({ message: "piyan is working" });
});

app.use("/api", router);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});


app.listen(PORT, () => console.log(`server is on http://locolhost:${PORT}`));
