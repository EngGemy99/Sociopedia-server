import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnection = (app, port) => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected successfully to server");
      app.listen(process.env.PORT || port, () =>
        console.log(`app listening on port ${port}!`)
      );
    })
    .catch((err) => console.log(err));
};

export { dbConnection };
