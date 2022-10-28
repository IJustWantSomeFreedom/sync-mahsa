type EventsMap = Record<string, (...args: any[]) => any>

export class EventEmitter<TEventsMap extends EventsMap> {
    private events: { [key in keyof TEventsMap]?: TEventsMap[key][] } = {};

    private getEvent = <TEvent extends keyof TEventsMap>(event: TEvent): TEventsMap[TEvent][] => {
        return (this.events[event] ||= [])!
    }

    on = <TEvent extends keyof TEventsMap>(event: TEvent, callback: TEventsMap[TEvent]) => {
        const callbacks = this.getEvent(event)
        callbacks.push(callback)

        return () => {
            this.off(event, callback)
        }
    }

    off = <TEvent extends keyof TEventsMap>(event: TEvent, callback: TEventsMap[TEvent]) => {
        const callbacks = this.getEvent(event)

        const callbackIndex = callbacks.indexOf(callback)

        if (callbackIndex > -1) {
            callbacks.splice(callbackIndex, 1)
        }
    }

    emit = <TEvent extends keyof TEventsMap>(event: TEvent, ...args: Parameters<TEventsMap[TEvent]>) => {
        const callbacks = this.getEvent(event)

        return callbacks.map(callback => callback(...args))
    }

    clear = (event: keyof TEventsMap) => {
        this.getEvent(event).length = 0
    }
}