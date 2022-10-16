import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault("Europe/London")

export class Timer {
    static delay = 0;

    static now() {
        const timeZone = dayjs.tz.guess()
        
        return dayjs.utc(dayjs()).tz(timeZone).valueOf() + this.delay
    }
}