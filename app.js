import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";


import createTables from "./database/createTables.js"
import routes  from "./routes/routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api", routes);
app.get("/", (req, res)=>{
  res.send("Thank you server is running")
})

export default app;
