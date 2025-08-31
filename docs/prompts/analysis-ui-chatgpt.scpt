-- 詳細なChatGPT UI解析スクリプト

on logMessage(message)
	log message
end logMessage

on ensureChatGPTFocus()
	tell application "ChatGPT"
		activate
	end tell
	delay 1
end ensureChatGPTFocus

-- 要素の詳細情報を安全に取得
on getElementDetails(elem)
	set details to "{"
	try
		set details to details & "role: " & (role of elem as string) & ", "
	end try
	try
		set details to details & "description: " & (description of elem as string) & ", "
	end try
	try
		set details to details & "title: " & (title of elem as string) & ", "
	end try
	try
		set details to details & "value: " & (value of elem as string) & ", "
	end try
  try
      tell application "System Events"
          if exists attribute "AXHelp" of elem then
              set helpText to value of attribute "AXHelp" of elem
              if helpText is not missing value then ¬
                  set details to details & "help: " & helpText & ", "
          end if
      end tell
	end try
	try
		set details to details & "subrole: " & (subrole of elem as string) & ", "
	end try
	if details ends with ", " then
		set details to text 1 thru -3 of details
	end if
	set details to details & "}"
	return details
end getElementDetails

-- 画像関連の要素を検索
on findImageRelatedElements()
	my logMessage("=== 画像関連要素検索開始 ===")
	tell application "System Events"
		tell application process "ChatGPT"
			try
				set fWin to front window
				set allElements to entire contents of fWin
				my logMessage("詳細検索対象要素数: " & (count of allElements))
				set candidateCount to 0
				repeat with elem in allElements
					try
						set elemRole to role of elem
						set elemDesc to ""
						try
							set elemDesc to description of elem
						end try
						set elemTitle to ""
						try
							set elemTitle to title of elem
						end try
						set elemSubrole to ""
						try
							set elemSubrole to subrole of elem
						end try
						set isCandidate to false
						if elemRole is "AXGroup" and (elemDesc contains "image" or elemTitle contains "image" or elemDesc contains "clock" or elemTitle contains "clock") then
							set isCandidate to true
						end if
						if elemRole is "AXButton" and (elemDesc contains "image" or elemTitle contains "image") then
							set isCandidate to true
						end if
						if elemRole is "AXStaticText" and (elemDesc contains "image" or elemTitle contains "image" or elemDesc contains "generated" or elemTitle contains "generated") then
							set isCandidate to true
						end if
						if isCandidate then
							set candidateCount to candidateCount + 1
							try
								set detailStr to my getElementDetails(elem)
							on error
								set detailStr to "取得失敗"
							end try
							my logMessage("候補要素 " & candidateCount & ": " & detailStr)
							try
								set childElements to UI elements of elem
								if (count of childElements) > 0 then
									my logMessage("  子要素数: " & (count of childElements))
									repeat with childElem in childElements
										try
											set childDetail to my getElementDetails(childElem)
										on error
											set childDetail to "取得失敗"
										end try
										my logMessage("    子: " & childDetail)
									end repeat
								end if
							end try
						end if
					end try
				end repeat
				my logMessage("候補要素数: " & candidateCount)
			on error errMsg
				my logMessage("検索エラー: " & errMsg)
			end try
		end tell
	end tell
end findImageRelatedElements

-- 中央座標にある要素を探す
on findClickableAtPosition()
	my logMessage("=== クリック可能要素検索 ===")
	tell application "System Events"
		tell application process "ChatGPT"
			try
				set fWin to front window
				set screenBounds to bounds of fWin
				set testX to (item 1 of screenBounds) + 400
				set testY to (item 2 of screenBounds) + 300
				my logMessage("テスト座標: " & testX & ", " & testY)
				set allElements to entire contents of fWin
				repeat with elem in allElements
					try
						set elemPos to position of elem
						set elemSize to size of elem
						set elemX1 to item 1 of elemPos
						set elemY1 to item 2 of elemPos
						set elemX2 to elemX1 + (item 1 of elemSize)
						set elemY2 to elemY1 + (item 2 of elemSize)
						if testX ≥ elemX1 and testX ≤ elemX2 and testY ≥ elemY1 and testY ≤ elemY2 then
							try
								set elemText to my getElementDetails(elem)
							on error
								set elemText to "詳細取得エラー"
							end try
							my logMessage("座標にある要素: " & elemText)
						end if
					end try
				end repeat
			on error errMsg
				my logMessage("座標検索エラー: " & errMsg)
			end try
		end tell
	end tell
end findClickableAtPosition

-- メイン実行
on run
	my ensureChatGPTFocus()
	my logMessage("=== 詳細UI解析開始 ===")
	my findImageRelatedElements()
	my findClickableAtPosition()
	-- my testRightClickSafely()
	my logMessage("=== 詳細UI解析完了 ===")
	display notification "詳細UI解析完了" with title "ChatGPT UI解析"
end run
