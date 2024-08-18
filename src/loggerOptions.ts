import { FontColor } from './logColors';

export interface LoggerOptions {
    format?: string,
    color?: boolean
    colorOptions?: Record<number, FontColor>
}
