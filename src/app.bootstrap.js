import express from "express";
import { NODE_ENV, port } from "../config/config.service.js";
import { authenticateDB } from "./DB/connection.db.js";
import { noteRouter, userRouter } from "./modules/index.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());

  await authenticateDB();

  app.use("/users", userRouter);
  app.use("/notes", noteRouter);

  app.use("/", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  app.use((error, req, res, next) => {
    const status = error.cause?.status ?? 500;
    return res.status(status).json({
      error_message:
        status == 500
          ? "something went wrong"
          : (error.message ?? "something went wrong"),
      stack:
        NODE_ENV == "development"
          ? error.stack?.split("\n").map((line) => line.trim())
          : undefined,
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

export default bootstrap;
