import * as dotenv from "dotenv";

import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((result) => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(error);
      console.log("Database Connection error");
    });
};
