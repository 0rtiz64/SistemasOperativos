import { config } from "dotenv";

config();

export default {
    database: process.env.database || "proyectoso",
    host: process.env.host || "127.0.0.1",
    user: process.env.username || "root",
    password: process.env.password || ""
};