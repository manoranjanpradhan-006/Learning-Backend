import dns from "dns";
import { execSync } from "child_process";

import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { log } from "console";


dotenv.config({
    path: './.env'
})


connectDB()
    .then(
        () => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server is running at port : ${process.env.PORT}`)
            })
        }
    )
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })