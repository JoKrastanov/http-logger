import { Request, Response, NextFunction } from "express";
import { LoggerOptions } from "./loggerOptions";
import { LogColor, LogColorKeys } from "./logColors";

const reset = "\x1b[0m";
const defaultColors: Record<number, LogColorKeys> = {
    500: "Red",
    400: "Yellow",
    300: "Blue",
    200: "Green",
}

export function httpLogger(options: LoggerOptions = { format: ':timestamp :method :url :status - :response-time ms', stream: process.stdout, color: true, colorOptions: defaultColors }) {
    return function (req: Request, res: Response, next: NextFunction) {
        const startTime = process.hrtime();

        res.on('finish', () => {
            const elapsedTime = process.hrtime(startTime);
            const responseTime = (elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6).toFixed(2);

            const log = options.format
                .replace(':timestamp', new Date().toISOString())
                .replace(':method', req.method)
                .replace(':url', req.originalUrl)
                .replace(':status', res.statusCode.toString())
                .replace(':response-time', responseTime);

            const coloredLog = options.color ? colorizeLog(log, res.statusCode, options.colorOptions) : log;
            options.stream.write(coloredLog + "\n");
        });

        next();
    };
}

function colorizeLog(log: string, statusCode: number, colorOptions: Record<number, LogColorKeys>): string {
    let coloredLog = log
    Object.keys(colorOptions).forEach(code => {
        if (statusCode >= parseInt(code)) {
            coloredLog = `${LogColor[colorOptions[parseInt(code)] as LogColorKeys]}${log}${reset}`
        }
    })
    return coloredLog
}

