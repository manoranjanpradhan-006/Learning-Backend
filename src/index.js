import dns from "dns";
import { execSync } from "child_process";

// Fix Node.js DNS resolution issue on Windows
if (process.platform === "win32") {
    try {
        const defaultServers = dns.getServers();
        // If Node defaults to loopback or has no servers, try to retrieve system DNS
        if (defaultServers.includes("127.0.0.1") || defaultServers.includes("::1") || defaultServers.length === 0) {
            const stdout = execSync("ipconfig /all").toString();
            const dnsServers = [];
            const lines = stdout.split("\n");
            let isParsingDns = false;
            for (let line of lines) {
                line = line.trim();
                if (line.includes("DNS Servers")) {
                    isParsingDns = true;
                    const ip = line.split(":").pop().trim();
                    if (ip && !ip.includes("::") && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
                        dnsServers.push(ip);
                    }
                } else if (isParsingDns) {
                    if (line && !line.includes(":") && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(line)) {
                        dnsServers.push(line);
                    } else if (line.includes(":")) {
                        isParsingDns = false;
                    }
                }
            }
            const activeServers = dnsServers.filter(ip => ip !== "127.0.0.1");
            if (activeServers.length > 0) {
                dns.setServers(activeServers);
            } else {
                dns.setServers(["8.8.8.8", "1.1.1.1"]); // Fallback
            }
        }
    } catch (e) {
        // Fallback to public DNS silently if execSync fails
        try {
            dns.setServers(["8.8.8.8", "1.1.1.1"]);
        } catch (_) { }
    }
}

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