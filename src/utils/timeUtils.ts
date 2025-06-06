import type { Time, HandPosition } from '../types';

// 時間を角度に変換（12時を0度として時計回り）
export const timeToAngle = (time: Time) => {
  // 分針の角度 (1分 = 6度)
  const minuteAngle = (time.minutes * 6) - 90; // -90度でSVG座標系に調整
  
  // 時針の角度 (1時間 = 30度、1分 = 0.5度)
  const hourAngle = ((time.hours % 12) * 30 + time.minutes * 0.5) - 90;
  
  return {
    hourAngle,
    minuteAngle
  };
};

// 角度を時間に変換
export const angleToTime = (angle: number, isHour: boolean): number => {
  // SVG座標系から時計座標系に変換（90度加算）
  let adjustedAngle = angle + 90;
  
  // 0-360度の範囲に正規化
  while (adjustedAngle < 0) adjustedAngle += 360;
  while (adjustedAngle >= 360) adjustedAngle -= 360;
  
  if (isHour) {
    // 時針: 1時間 = 30度
    return Math.round(adjustedAngle / 30) % 12;
  } else {
    // 分針: 1分 = 6度
    return Math.round(adjustedAngle / 6) % 60;
  }
};

// マウス位置から角度を計算
export const calculateAngleFromPosition = (
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number
): number => {
  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  
  // Math.atan2は-π～πの範囲で返すので、0～2πに変換
  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
  return angle;
};

// AM/PMを判定
export const getAMPM = (hours: number): string => {
  return hours < 12 ? 'AM' : 'PM';
};

// 12時間形式に変換
export const to12HourFormat = (hours: number): number => {
  if (hours === 0) return 12;
  if (hours > 12) return hours - 12;
  return hours;
};

// 現在時刻を取得
export const getCurrentTime = (): Time => {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes()
  };
}; 