import { Request, Response, NextFunction } from "express";
import { LoggerOptions } from "./loggerOptions";
import { LogColor, FontColor } from "./logColors";
import fs from "fs"
import path from "path";

// Used to reset the color of the application output
const reset = "\x1b[0m";

// Default log colors based on response code
const defaultColors: Record<number, FontColor> = {
    500: FontColor.Red,
    400: FontColor.Yellow,
    300: FontColor.Blue,
    200: FontColor.Green,
}

/**

 * [httpLogger Listens for any calls to an Express endpoint and logs the call with the provided options]

 * @param  {LoggerOptions} options [custom log options]

 * @return {void}       []

 */
export function httpLogger(options: LoggerOptions) {
    return function (req: Request, res: Response, next: NextFunction) {
        const logFormat = options.format ? options.format : ':timestamp :method :url :status - :response-time ms'
        const colorizeLogs = options.color !== undefined ? options.color : true
        const colorOptions = options.colorOptions ? options.colorOptions : defaultColors
        const logOutFile = options.outFile ? options.outFile : 'logs.txt'
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

            if (options.outDir) {
                validateOutDir(options.outDir)
                fs.appendFile(path.join(options.outDir, logOutFile), log, "utf-8", function (err) {
                    if (err) {
                        throw err
                    }
                })
            }
            stream.write(coloredLog + "\n");
        });

        next();
    };
}

/**

 * [validateOutDir Checks if the provided output folder exists, if not it creates it]

 * @param  {string} dir [output directory name]

 * @return {function}       []

 */
function validateOutDir(dir: string) {
    if (!fs.existsSync(dir)) {
        return fs.mkdirSync(dir);
    }
}

/**

 * [colorizeLog Checks the response status of the http call and returns the colored log based on the colorOptions]

 * @param  {string} log [log text]
 * @param  {number} statusCode [http response code]
 * @param  {Record<number | string, FontColor>}  colorOptions [log color options]

 * @return {void}       []

 */
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

