-- シンプルなデバッグスクリプト

on ensureChatGPTFocus()
	tell application "ChatGPT"
		activate
	end tell
	delay 1
end ensureChatGPTFocus

-- 基本的な要素検索
on findBasicElements()
	log "=== 基本要素検索開始 ==="
	tell application "System Events"
		tell application process "ChatGPT"
			try
				set fWin to front window
				set allElements to entire contents of fWin
				
				log "総要素数: " & (count of allElements)
				
				-- AXGroupを詳しく調べる
				set groupCount to 0
				repeat with elem in allElements
					try
						if role of elem is "AXGroup" then
							set groupCount to groupCount + 1
							set groupInfo to "Group " & groupCount & ": "
							try
								set groupInfo to groupInfo & "desc=" & (description of elem) & " "
							end try
							try
								set groupInfo to groupInfo & "title=" & (title of elem) & " "
							end try
							try
								set groupInfo to groupInfo & "help=" & (help of elem)
							end try
							log groupInfo
						end if
					on error
						-- エラー無視
					end try
				end repeat
				
			on error errMsg
				log "エラー: " & errMsg
			end try
		end tell
	end tell
end findBasicElements

-- 右クリックテスト
on testSimpleRightClick()
	log "=== 右クリックテスト開始 ==="
	tell application "System Events"
		tell application process "ChatGPT"
			try
				-- 画面中央で右クリック
				set mousePos to current mouse position
				log "マウス位置: " & (item 1 of mousePos) & ", " & (item 2 of mousePos)
				
				right click at mousePos
				delay 2
				
				-- 全要素を再チェック
				set fWin to front window
				set allElements to entire contents of fWin
				
				repeat with elem in allElements
					try
						set elemRole to role of elem
						if elemRole is "AXMenu" then
							log "メニュー発見!"
							try
								log "メニューdesc: " & (description of elem)
							end try
						end if
					on error
						-- エラー無視
					end try
				end repeat
				
				-- ESCで閉じる
				key code 53
				
			on error errMsg
				log "右クリックエラー: " & errMsg
			end try
		end tell
	end tell
end testSimpleRightClick

-- メイン処理
on run
	my ensureChatGPTFocus()
	my findBasicElements()
	my testSimpleRightClick()
	log "=== 解析完了 ==="
end run
