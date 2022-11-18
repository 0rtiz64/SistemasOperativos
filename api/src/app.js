import express from "express";
import morgan from "morgan";
const bodyParser = require('body-parser')
// Routes
import languageRoutes from "./routes/language.routes";

const app = express();

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes
app.use("/api/languages", languageRoutes);

export default app;
