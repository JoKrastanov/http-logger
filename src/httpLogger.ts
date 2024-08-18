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

export function httpLogger(options: LoggerOptions = { format: ':timestamp :method :url :status - :response-time ms', color: true, colorOptions: defaultColors }) {
    return function (req: Request, res: Response, next: NextFunction) {
        const stream = process.stdout
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
            stream.write(coloredLog + "\n");
        });

        next();
    };
}

function colorizeLog(log: string, statusCode: number, colorOptions: Record<number, FontColor>): string {
    let coloredLog = log
    Object.keys(colorOptions).forEach(code => {
        if (statusCode >= parseInt(code)) {
            const color = FontColor[colorOptions[parseInt(code)]] as keyof typeof FontColor
            coloredLog = `${LogColor[color]}${log}${reset}`
        }
    })
    return coloredLog
}

