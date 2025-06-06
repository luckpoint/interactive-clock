"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"

// cn関数を直接定義（@/lib/utilsが見つからないため）
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// 多言語対応の翻訳定義
interface Translations {
  title: string
  hourHandInstruction: string
  minuteHandInstruction: string
  toggleTimeFormat: string
  resetButton: string
  twelveHourFormat: string
  twentyFourHourFormat: string
  twentyFourHourLabel: string
}

const translations: Record<string, Translations> = {
  en: {
    title: "Interactive Clock",
    hourHandInstruction: "🔴 Drag the red hand (hour hand) to set the time",
    minuteHandInstruction: "🔵 Drag the blue hand (minute hand) to set the minutes",
    toggleTimeFormat: "🕒",
    resetButton: "⏰ Reset to Current Time",
    twelveHourFormat: "12-Hour Format",
    twentyFourHourFormat: "24-Hour Format",
    twentyFourHourLabel: "24-Hour Format"
  },
  ja: {
    title: "インタラクティブ時計",
    hourHandInstruction: "🔴 赤い針（時針）をドラッグして時間を設定",
    minuteHandInstruction: "🔵 青い針（分針）をドラッグして分を設定",
    toggleTimeFormat: "🕒",
    resetButton: "⏰ 現在時刻にリセット",
    twelveHourFormat: "12時間表記",
    twentyFourHourFormat: "24時間表記",
    twentyFourHourLabel: "24時間表記"
  }
}

interface Time {
  hours: number // 0-23の24時間形式
  minutes: number // 0-59
}

export default function InteractiveClock() {
  const [time, setTime] = useState<Time>({ hours: 10, minutes: 10 })
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null)
  const [is24HourMode, setIs24HourMode] = useState<boolean>(false) // 24時間表記モード
  const [language, setLanguage] = useState<string>('en') // デフォルトは英語
  const clockRef = useRef<SVGSVGElement>(null)
  const prevMinuteRef = useRef<number>(10) // 前回の分の値を追跡
  const prevHourAngleRef = useRef<number>(0) // 前回の時間針の角度を追跡

  // ブラウザの言語設定を検出
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'
      const langCode = browserLang.toLowerCase().startsWith('ja') ? 'ja' : 'en'
      setLanguage(langCode)
    }
    
    detectLanguage()
  }, [])

  // 現在の翻訳を取得
  const t = translations[language] || translations.en

  // timeが外部から変更された時にrefを同期
  useEffect(() => {
    prevMinuteRef.current = time.minutes
    const currentHourAngle = ((time.hours % 12) * 30 + time.minutes * 0.5) % 360
    prevHourAngleRef.current = currentHourAngle
  }, [time.minutes, time.hours])

  const angleToMinute = (angle: number): number => {
    // 入力角度が時計座標系であることを前提として処理
    const normalizedAngle = (angle + 360) % 360
    return Math.round(normalizedAngle / 6) % 60
  }

  // 時間針の角度から時間と分を計算（12時を通過した際のAM/PM切り替えも検出）
  const angleToHourAndMinute = useCallback((angle: number): { hours: number; minutes: number } => {
    // 時計座標系の角度を正規化
    const normalizedAngle = (angle + 360) % 360
    
    // 時間針の角度から総分数を計算（1度 = 2分）
    const totalMinutes = Math.round(normalizedAngle * 2) % 720 // 12時間 = 720分
    
    // 時間と分に分解
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    // 前回の角度との差分で12時を通過したかを判定
    const prevAngle = prevHourAngleRef.current
    const currentAngle = normalizedAngle
    
    // 12時を通過したかを検出（角度の差分が大きい場合）
    const crossedTwelve = Math.abs(currentAngle - prevAngle) > 180
    let newHours = time.hours
    
    if (crossedTwelve) {
      if (prevAngle > 180 && currentAngle < 180) {
        // 右回り（11時から12時への通過）
        const currentHour24 = time.hours
        if (currentHour24 === 11) newHours = 12  // 11AM → 12PM
        else if (currentHour24 === 23) newHours = 0  // 11PM → 12AM
        else newHours = currentHour24 + 1
      } else if (prevAngle < 180 && currentAngle > 180) {
        // 左回り（12時から11時への通過）
        const currentHour24 = time.hours
        if (currentHour24 === 12) newHours = 11  // 12PM → 11AM
        else if (currentHour24 === 0) newHours = 23  // 12AM → 11PM
        else newHours = currentHour24 - 1
      } else {
        // 通常のAM/PM切り替え
        const isCurrentlyPM = time.hours >= 12
        newHours = isCurrentlyPM ? hours : hours + 12
      }
    } else {
      // 12時を通過していない通常の動き
      const isCurrentlyPM = time.hours >= 12
      if (isCurrentlyPM && hours < 12) {
        newHours = hours + 12
      } else if (!isCurrentlyPM && hours === 12) {
        newHours = 0
      } else if (!isCurrentlyPM && hours < 12) {
        newHours = hours
      } else {
        newHours = hours
      }
    }
    
    // 24時間の範囲内に収める
    newHours = ((newHours % 24) + 24) % 24
    
    // 前回の角度を更新
    prevHourAngleRef.current = normalizedAngle
    
    return { hours: newHours, minutes }
  }, [time.hours])

  // 時間から角度への変換
  const hourToAngle = (hour: number, minute: number): number => {
    const hourAngle = (hour % 12) * 30 + minute * 0.5
    return hourAngle - 90 // SVGの座標系に合わせて調整
  }

  const minuteToAngle = (minute: number): number => {
    return minute * 6 - 90 // SVGの座標系に合わせて調整
  }

  // マウス位置から角度を計算し、時計座標系に変換
  const getAngleFromPosition = (clientX: number, clientY: number): number => {
    if (!clockRef.current) return 0

    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = clientX - centerX
    const deltaY = clientY - centerY

    // Math.atan2は数学座標系（右が0度）で角度を返す
    const mathAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    
    // 数学座標系から時計座標系に変換（12時が0度、時計回りが正）
    // mathAngle: 右=0度, 上=-90度, 左=±180度, 下=90度
    // clockAngle: 上=0度, 右=90度, 下=180度, 左=270度
    let clockAngle = (mathAngle + 90 + 360) % 360
    
    return clockAngle
  }

  // 分針の回転方向を検出して時間を更新
  const updateTimeWithMinuteRotation = useCallback((newMinute: number) => {
    const prevMinute = prevMinuteRef.current
    
    // 12の位置（0分）を通過したかを検出
    const crossedTwelve = 
      (prevMinute >= 55 && newMinute <= 5) || // 右回り（59→0）
      (prevMinute <= 5 && newMinute >= 55)    // 左回り（0→59）
    
    if (crossedTwelve) {
      setTime((prev) => {
        let newHours = prev.hours
        
        if (prevMinute >= 55 && newMinute <= 5) {
          // 右回り: 時間を進める
          newHours = (prev.hours + 1) % 24
        } else if (prevMinute <= 5 && newMinute >= 55) {
          // 左回り: 時間を戻す
          newHours = prev.hours - 1
          if (newHours < 0) newHours = 23
        }
        
        return { ...prev, hours: newHours, minutes: newMinute }
      })
    } else {
      // 通常の分の更新
      setTime((prev) => ({ ...prev, minutes: newMinute }))
    }
    
    // 前回の分の値を更新
    prevMinuteRef.current = newMinute
  }, [])

  // ドラッグ開始
  const handleMouseDown = useCallback((hand: "hour" | "minute") => {
    setIsDragging(hand)
  }, [])

  // ドラッグ中
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const angle = getAngleFromPosition(e.clientX, e.clientY)

      if (isDragging === "hour") {
        const { hours, minutes } = angleToHourAndMinute(angle)
        setTime((prev) => ({ ...prev, hours, minutes }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        updateTimeWithMinuteRotation(newMinute)
      }
    },
    [isDragging, time.hours, updateTimeWithMinuteRotation, angleToHourAndMinute],
  )

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // タッチイベント対応
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return

      const touch = e.touches[0]
      const angle = getAngleFromPosition(touch.clientX, touch.clientY)

      if (isDragging === "hour") {
        const { hours, minutes } = angleToHourAndMinute(angle)
        setTime((prev) => ({ ...prev, hours, minutes }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        updateTimeWithMinuteRotation(newMinute)
      }
    },
    [isDragging, time.hours, updateTimeWithMinuteRotation, angleToHourAndMinute],
  )

  const hourAngle = hourToAngle(time.hours, time.minutes)
  const minuteAngle = minuteToAngle(time.minutes)

  // AM/PM判定と表示用時間の計算
  const isAM = time.hours < 12
  const displayHour = is24HourMode ? time.hours : (time.hours % 12 === 0 ? 12 : time.hours % 12)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-800 mb-2 flex items-center justify-center gap-3 tracking-wide">
          🕐 {t.title}
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
      </div>

      {/* アナログ時計 */}
      <div className="relative mb-8">
        <svg
          ref={clockRef}
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="mx-auto cursor-pointer select-none drop-shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* 時計の影 */}
          <circle cx="165" cy="165" r="150" fill="rgba(0,0,0,0.1)" />
          
          {/* 時計の外枠 */}
          <circle cx="160" cy="160" r="150" fill="white" stroke="#e2e8f0" strokeWidth="3" />

          {/* 時計の数字 */}
          {Array.from({ length: 12 }, (_, i) => {
            const number = i === 0 ? 12 : i
            const angle = i * 30 - 90
            const x = 160 + 120 * Math.cos((angle * Math.PI) / 180)
            const y = 160 + 120 * Math.sin((angle * Math.PI) / 180)

            return (
              <text
                key={number}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xl font-bold fill-gray-800"
              >
                {number}
              </text>
            )
          })}

          {/* 時間の目盛り */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30
            const x1 = 160 + 140 * Math.cos(((angle - 90) * Math.PI) / 180)
            const y1 = 160 + 140 * Math.sin(((angle - 90) * Math.PI) / 180)
            const x2 = 160 + 125 * Math.cos(((angle - 90) * Math.PI) / 180)
            const y2 = 160 + 125 * Math.sin(((angle - 90) * Math.PI) / 180)

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="2" />
          })}

          {/* 分の目盛り */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 === 0) return null // 時間の目盛りと重複を避ける

            const angle = i * 6
            const x1 = 160 + 140 * Math.cos(((angle - 90) * Math.PI) / 180)
            const y1 = 160 + 140 * Math.sin(((angle - 90) * Math.PI) / 180)
            const x2 = 160 + 133 * Math.cos(((angle - 90) * Math.PI) / 180)
            const y2 = 160 + 133 * Math.sin(((angle - 90) * Math.PI) / 180)

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="1" />
          })}

          {/* 分針 */}
          <line
            x1="160"
            y1="160"
            x2={160 + 110 * Math.cos((minuteAngle * Math.PI) / 180)}
            y2={160 + 110 * Math.sin((minuteAngle * Math.PI) / 180)}
            stroke="#3b82f6"
            strokeWidth="5"
            strokeLinecap="round"
            className={cn(
              "cursor-pointer transition-all duration-150 drop-shadow-sm",
              isDragging === "minute" ? "stroke-blue-600" : "hover:stroke-blue-600",
            )}
            onMouseDown={() => handleMouseDown("minute")}
            onTouchStart={() => handleMouseDown("minute")}
          />

          {/* 時針 */}
          <line
            x1="160"
            y1="160"
            x2={160 + 80 * Math.cos((hourAngle * Math.PI) / 180)}
            y2={160 + 80 * Math.sin((hourAngle * Math.PI) / 180)}
            stroke="#ef4444"
            strokeWidth="7"
            strokeLinecap="round"
            className={cn(
              "cursor-pointer transition-all duration-150 drop-shadow-sm",
              isDragging === "hour" ? "stroke-red-600" : "hover:stroke-red-600",
            )}
            onMouseDown={() => handleMouseDown("hour")}
            onTouchStart={() => handleMouseDown("hour")}
          />

          {/* 中心の円 */}
          <circle cx="160" cy="160" r="10" fill="#374151" className="drop-shadow-sm" />
        </svg>
      </div>

      {/* デジタル表示 */}
      <div className="bg-white/80 backdrop-blur-md text-gray-800 rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg mb-6">
        <div className="text-9xl font-light font-mono mb-2 tracking-wider">
          {displayHour.toString().padStart(2, "0")}:{time.minutes.toString().padStart(2, "0")}
        </div>
        {!is24HourMode && (
          <div className="text-3xl font-light opacity-70 tracking-wide">{isAM ? "AM" : "PM"}</div>
        )}
        {is24HourMode && (
          <div className="text-xl font-light opacity-70 tracking-wide">{t.twentyFourHourLabel}</div>
        )}
      </div>

      {/* 操作説明 */}
      <div className="text-center text-gray-700 mb-6 bg-white/60 backdrop-blur-md rounded-xl p-4 border border-gray-200/40 shadow-sm">
        <p className="mb-2 flex items-center justify-center gap-2 text-base font-light">
          {t.hourHandInstruction}
        </p>
        <p className="flex items-center justify-center gap-2 text-base font-light">
          {t.minuteHandInstruction}
        </p>
      </div>

      {/* ボタンエリア */}
      <div className="flex gap-4 flex-wrap justify-center">
        {/* 24時間/12時間表記切り替えボタン */}
        <button
          onClick={() => setIs24HourMode(!is24HourMode)}
          className="bg-white/70 hover:bg-white/90 text-gray-700 font-light py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
        >
          {t.toggleTimeFormat} {is24HourMode ? t.twelveHourFormat : t.twentyFourHourFormat}
        </button>

        {/* リセットボタン */}
        <button
          onClick={() => {
            const now = new Date()
            setTime({
              hours: now.getHours(),
              minutes: now.getMinutes(),
            })
          }}
          className="bg-white/70 hover:bg-white/90 text-gray-700 font-light py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
        >
          {t.resetButton}
        </button>
      </div>
    </div>
  )
}
