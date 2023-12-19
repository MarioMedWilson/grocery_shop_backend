import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import routes  from "./routes/routes.js";

const app = express();

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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
