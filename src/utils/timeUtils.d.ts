import type { Time } from '../types';
export declare const timeToAngle: (time: Time) => {
    hourAngle: number;
    minuteAngle: number;
};
export declare const angleToTime: (angle: number, isHour: boolean) => number;
export declare const calculateAngleFromPosition: (mouseX: number, mouseY: number, centerX: number, centerY: number) => number;
export declare const getAMPM: (hours: number) => string;
export declare const to12HourFormat: (hours: number) => number;
export declare const getCurrentTime: () => Time;
