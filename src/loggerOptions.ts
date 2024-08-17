import { WriteStream } from 'tty';
import { LogColorKeys } from './logColors';

export interface LoggerOptions {
    format: string,
    stream: WriteStream,
    color: boolean
    colorOptions: Record<number, LogColorKeys>
}
