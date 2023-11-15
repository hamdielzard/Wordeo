// Useful to log information about the server, such as when it starts, when it receives a request, and when it crashes.

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const MAX_LOGS = 50;
const logFilePath = path.join(__dirname, 'logs.txt');

let logs = [];
let logSockets = true; // added boolean to decide whether to log socket logs or not

const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.bgBlue.white(`[INFO]`) + chalk.blue(` [${timestamp}] ${message}`));
        logs.push(`[INFO] [${timestamp}] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    warn: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.bgYellow.black(`[WARN]`) + chalk.yellow(` [${timestamp}] ${message}`));
        logs.push(`[WARN] [${timestamp}] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.bgRed.whiteBright(`[ERROR]`) + chalk.red(` [${timestamp}] ${message}`));
        logs.push(`[ERROR] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    cont: (message) => {
        console.log("  ↳  " + message);
        logs.push(message);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    socket: (message) => {
        // Use this for socket logs (designed for multiplayer)
        if (logSockets) { // check if logSockets is true before logging socket logs
            const timestamp = new Date().toISOString();
            console.log(chalk.bgGreenBright(`[SOCK]`) + chalk.green(` [${timestamp}] ${message}`));
            logs.push(`[SOCK] [${timestamp}] ${message}`);
            if (logs.length > MAX_LOGS) {
                logs.shift();
            }
            //exportLogs(); - TODO: Turn this on after fixing client spam, otherwise it will destroy your hard drive with constant writes :)
        }
    }
};

function exportLogs() {
    const logString = logs.join('\n');
    fs.writeFile(logFilePath, logString, (err) => {
        if (err) {
            console.error(`Error exporting logs: ${err}`);
        }
    });
}

module.exports = logger;
