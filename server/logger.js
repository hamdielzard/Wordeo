// Useful to log information about the server, such as when it starts, when it receives a request, and when it crashes.

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const MAX_LOGS = 50;
const logFilePath = path.join(__dirname, 'logs.txt');

let logs = [];

const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.blue(`[INFO] [${timestamp}] ${message}`));
        logs.push(`[INFO] [${timestamp}] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    warn: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.yellow(`[WARN] [${timestamp}] ${message}`));
        logs.push(`[WARN] [${timestamp}] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.red(`[ERROR] [${timestamp}] ${message}`));
        logs.push(`[ERROR] ${message}`);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
        exportLogs();
    },
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
