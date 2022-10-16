import { Workbox } from "workbox-window"

export {};

declare global {
    interface Window {
        workbox: Workbox;
    }
}