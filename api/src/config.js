import { config } from "dotenv";

config();

export default {
    database: process.env.database || "proyectoso",
    host: process.env.host || "127.0.0.1",
    user: process.env.username || "root",
    password: process.env.password || ""
};


/*
database=proyectoso
username=xo37xwod03gj4yxlpp9b
host=us-east.connect.psdb.cloud
password=pscale_pw_jQhbvWgm1LtkMQ6r0EAE8tc2ZQ0cam3PXTfnzuuHRZV
*/