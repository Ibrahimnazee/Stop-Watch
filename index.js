#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from 'chalk';
class Stopwatch {
    startTime;
    running;
    constructor() {
        this.startTime = 0;
        this.running = false;
    }
    async start() {
        if (!this.running) {
            this.startTime = Date.now();
            this.running = true;
            console.log(chalk.bgCyan("Stopwatch started."));
            // Continuously display the elapsed time
            this.displayElapsedTime();
            // Wait for user to manually stop
            await this.waitForStop();
        }
        else {
            console.log(chalk.bgBlueBright("Stopwatch is already running."));
        }
    }
    async stop() {
        if (this.running) {
            this.running = false;
            const elapsedTime = Date.now() - this.startTime;
            console.clear();
            console.log(chalk.bgRed(`Stopwatch stopped. Elapsed time:) ${this.formatTime(elapsedTime)}`));
        }
        else {
            console.log(chalk.bgMagenta("Stopwatch is not running."));
        }
    }
    reset() {
        this.startTime = 0;
        this.running = false;
        console.clear();
        console.log(chalk.bgGreen("Stopwatch reset."));
    }
    async displayElapsedTime() {
        while (this.running) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const elapsedTime = Date.now() - this.startTime;
            console.clear();
            console.log(chalk.bgGrey(`Elapsed time:) ${this.formatTime(elapsedTime)}`));
        }
    }
    async waitForStop() {
        const { stop } = await inquirer.prompt({
            type: "confirm",
            name: "stop",
            message: chalk.bgGreen("Do you want to stop the stopwatch?"),
            default: false,
        });
        if (stop) {
            await this.stop();
        }
    }
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }
}
// Create a new stopwatch instance
const stopwatch = new Stopwatch();
// Define the questions for Inquirer
const questions = [
    {
        type: "list",
        name: "action",
        message: chalk.bgYellow("What would you like to do?"),
        choices: ["Start", "Stop", "Reset", "Exit"],
    },
];
// Function to handle user input
async function handleInput() {
    const { action } = await inquirer.prompt(questions);
    switch (action) {
        case "Start":
            await stopwatch.start();
            break;
        case "Stop":
            await stopwatch.stop();
            break;
        case "Reset":
            stopwatch.reset();
            break;
        case "Exit":
            process.exit();
            break;
    }
    // Ask for another action recursively
    await handleInput();
}
// Start the program by asking for the user's action
handleInput();
