export interface Translations {
  title: string
  hourHandInstruction: string
  minuteHandInstruction: string
  toggleTimeFormat: string
  resetButton: string
  twelveHourFormat: string
  twentyFourHourFormat: string
  twentyFourHourLabel: string
  toggleSecondHand: string
  showSecondHand: string
  hideSecondHand: string
  toggleClockMovement: string
  startClock: string
  stopClock: string
  selectThemeLabel: string
  help: string
  helpTitle: string
  helpContent: {
    basic: string
    dragHands: string
    editTime: string
    timeControls: string
    controls: string
    themes: string
  }
  close: string
}

export type Language = 'en' | 'ja'

export const translations: Record<Language, Translations> = {
  en: {
    title: "Fun Clock",
    hourHandInstruction: "🔴 Drag the hour hand to adjust time",
    minuteHandInstruction: "🔵 Drag the minute hand to adjust minutes",
    toggleTimeFormat: "Toggle Time Format",
    resetButton: "Reset",
    twelveHourFormat: "12 Hour Format",
    twentyFourHourFormat: "24 Hour Format",
    twentyFourHourLabel: "24 Hour Format",
    toggleSecondHand: "Toggle Second Hand",
    showSecondHand: "Show Second Hand",
    hideSecondHand: "Hide Second Hand",
    toggleClockMovement: "Toggle Clock Movement",
    startClock: "Start Clock",
    stopClock: "Stop Clock",
    selectThemeLabel: "Select {themeName} theme",
    help: "Help",
    helpTitle: "How to Use the Clock",
    helpContent: {
      basic: "This clock is fun, and you can play with it!",
      dragHands: "• Move the red hour hand and blue minute hand to change the time.",
      editTime: "• Tap the digital numbers twice to type the time.",
      timeControls: "• Tap the quick buttons like +1h or -5m to change time fast.",
      controls: "• Use the buttons to switch 12/24 hour or hide the second hand.",
      themes: "• Pick a picture theme you like from the menu at the top-right."
    },
    close: "Close"
  },
  ja: {
    title: "たのしいとけい",
    hourHandInstruction: "🔴 時針をドラッグして時間を調整",
    minuteHandInstruction: "🔵 分針をドラッグして分を調整",
    toggleTimeFormat: "時間表示切り替え",
    resetButton: "リセット",
    twelveHourFormat: "12時間表示",
    twentyFourHourFormat: "24時間表示",
    twentyFourHourLabel: "24時間表示",
    toggleSecondHand: "秒針の表示/非表示",
    showSecondHand: "秒針を表示",
    hideSecondHand: "秒針を非表示",
    toggleClockMovement: "時計の動作切り替え",
    startClock: "時計を開始",
    stopClock: "時計を停止",
    selectThemeLabel: "{themeName}テーマを選択",
    help: "ヘルプ",
    helpTitle: "とけいの つかいかた",
    helpContent: {
      basic: "このとけいは さわって あそべる とけいだよ！",
      dragHands: "• とけいのはり を うごかして じかん を かえよう",
      editTime: "• デジタルの じかん を 2かい タップして じかん を いれかえよう",
      timeControls: "• 『+1h』や『-5m』の ボタン で じかん を すぐ かえられるよ",
      controls: "• ボタンで 12じかん と 24じかん の きりかえ や びょうしん の けす/だす が できるよ",
      themes: "• みぎうえ の メニュー から すきな え を えらべるよ"
    },
    close: "とじる"
  },
}

export const detectLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const browserLang = navigator.language || navigator.languages?.[0] || "en"
    return browserLang.toLowerCase().startsWith("ja") ? "ja" : "en"
  }
  return "en"
}

export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.en
}