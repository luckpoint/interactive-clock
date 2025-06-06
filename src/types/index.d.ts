export interface Time {
    hours: number;
    minutes: number;
}
export interface HandPosition {
    x: number;
    y: number;
}
export interface DragState {
    isDragging: boolean;
    dragType: 'hour' | 'minute' | null;
}
export interface ClockProps {
    time: Time;
    onTimeChange: (time: Time) => void;
}
