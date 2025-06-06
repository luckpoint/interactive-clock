// 時間を表す型定義
export interface Time {
  hours: number;   // 0-23の24時間形式で管理
  minutes: number; // 0-59
}

// 針の位置を表す型定義
export interface HandPosition {
  x: number;
  y: number;
}

// ドラッグ状態を管理する型定義
export interface DragState {
  isDragging: boolean;
  dragType: 'hour' | 'minute' | null;
}

// 時計のプロパティ
export interface ClockProps {
  time: Time;
  onTimeChange: (time: Time) => void;
} 