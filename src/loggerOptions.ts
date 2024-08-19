import { FontColor } from './logColors';


export interface LoggerOptions {
    /** The structure of the logs */ 
    format?: string,
    /** Whether the logs should get colored*/
    color?: boolean
    /** Definition of what color should be used based on the response code */
    colorOptions?: Record<number, FontColor>
    /** The output directory where the logs will be stored */
    outDir?: string 
    /** The output file where the logs will be recorded */
    outFile? : string
}
