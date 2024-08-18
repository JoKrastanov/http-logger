import { Request, Response, NextFunction } from "express";
import { LoggerOptions } from "./loggerOptions";
import { LogColor, FontColor } from "./logColors";

const reset = "\x1b[0m";
const defaultColors: Record<number, FontColor> = {
    500: FontColor.Red,
    400: FontColor.Yellow,
    300: FontColor.Blue,
    200: FontColor.Green,
}

export function httpLogger(options: LoggerOptions) {
    return function (req: Request, res: Response, next: NextFunction) {
        const logFormat = options.format ? options.format : ':timestamp :method :url :status - :response-time ms'
        const colorizeLogs = options.color !== undefined ? options.color : true
        const colorOptions = options.colorOptions ? options.colorOptions : defaultColors
        const stream = process.stdout
        const startTime = process.hrtime();

        res.on('finish', () => {
            const elapsedTime = process.hrtime(startTime);
            const responseTime = (elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6).toFixed(2);

            const log = logFormat
                .replace(':timestamp', new Date().toISOString())
                .replace(':method', req.method)
                .replace(':url', req.originalUrl)
                .replace(':status', res.statusCode.toString())
                .replace(':response-time', responseTime);

            const coloredLog = colorizeLogs ? colorizeLog(log, res.statusCode, colorOptions) : log;
            stream.write(coloredLog + "\n");
        });

        next();
    };
}

function colorizeLog(log: string, statusCode: number, colorOptions: Record<number | string, FontColor>): string {
    let coloredLog = log
    Object.keys(colorOptions).forEach(code => {
        if (statusCode >= parseInt(code)) {
            const color = FontColor[colorOptions[parseInt(code)]] as keyof typeof FontColor
            coloredLog = `${LogColor[color]}${log}${reset}`
        }
    })
    return coloredLog
}

