import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import todosRouter from "./routes/todos";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/todos", todosRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
