import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import Cafes from "./models/Cafes";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("mongo db connection created");
  });

const SaveCafeName = async (name) => {
  const comments = [];
  const existing = await Cafes.findOne({ name });
  if (existing) {
    // console.log("Cafe is already existing")
  } else {
    try {
      const newCafe = new Cafes({ name, comments });
      return newCafe.save();
    } catch (error) {
      throw new Error("Cafe creation error: " + error);
    }
  }
};

const updateCafeComment = async (name, comment) => {
  const existing = await Cafes.findOne({ name });
  if (existing) {
    // console.log("Cafe is already existing1")
    await Cafes.updateOne(
      { name },
      {
        $push: {
          comments: {
            $each: [comment],
            $position: 0,
          },
        },
      }
    );
  }
};

const searchComment = async (name) => {
  const existing = await Cafes.findOne({ name });
  console.log(existing);
  let comments = [];
  if (existing) {
    try {
      const comment1 = existing.comments[0];
      const comment2 = existing.comments[1];
      const comment3 = existing.comments[2];
      console.log(comment1, comment2, comment3);

      comments = [comment1, comment2, comment3];
      return comments;
    } catch (error) {
      console.log(error);
    }
  }
};

export { SaveCafeName, updateCafeComment, searchComment };
