# 新希望學院新生特質傾向測驗

Firebase + React 網頁測驗，結合 12 題特質傾向測驗與少年版 MBTI（23 題），以 roguelike 探索地圖 + 卡片形式呈現，讓老師登入查看班級學生的分析總覽。

## 開發環境設定

```bash
npm install
cp .env.example .env   # 本機用 emulator 開發時，保留預設值即可
```

## 本機開發（搭配 Firebase Emulator）

需要兩個終端機視窗：

```bash
npm run emulators   # 啟動 Firestore + Auth + Hosting emulator（需要 Java 21+）
npm run dev          # 啟動 Vite dev server
```

Emulator UI：http://127.0.0.1:4000

`src/firebase/config.ts` 在 `DEV` 模式下預設會自動連上 emulator（`VITE_USE_FIREBASE_EMULATORS` 設為 `false` 可改連真正的 Firebase 專案）。

### 測試用輔助腳本（`scripts/`，不屬於正式建置流程）

- `seed-emulator.mjs`：在 emulator 內建立一位測試老師＋班級，並印出可在瀏覽器 console 用 `signInWithCustomToken` 登入的 token（不用真的 Google 帳號就能測老師端）。
- `check-submission.mjs`：查詢 emulator 裡目前的測驗作答紀錄，確認資料形狀正確。
- `check-rules.mjs`：對 `firestore.rules` 做防呆測試（不合法的作答格式、跨老師讀取等應被拒絕）。
- `parse-mbti-docx.mjs`：從 `mbti少年版測驗題.docx` 萃取原始段落文字，供人工校對成 `src/data/mbtiQuestions.ts`（已完成，僅留作未來重新核對用）。

## 測試

```bash
npm run test   # Vitest：學院／MBTI 計分邏輯的單元測試
```

## 部署

1. `firebase login`，然後 `firebase use --add` 選擇（或建立）你的正式 Firebase 專案，取代 `.firebaserc` 裡的 `demo-sortinghat`。
2. 在 Firebase Console 開啟 Firestore（原生模式）與 Authentication 的 Google 登入方式。
3. 在 `.env` 填入該專案的 Web App 設定值，並將 `VITE_USE_FIREBASE_EMULATORS` 設為 `false`。
4. `npm run build`
5. `firebase deploy --only firestore:rules,hosting`

## 已知限制（MVP 範圍）

- 老師端目前只有班級總覽，尚無單一學生詳細報告頁與 CSV 匯出（規劃見 `.claude` 目錄下的原始計畫檔）。
- 學生作答送出後不可修改；沒有 Cloud Function 在伺服器端重算分數，理論上可被瀏覽器 devtools 偽造格式正確但分數造假的結果，對課堂性格測驗風險低。
- MBTI 題組的 S/N 維度只有 5 題（來源 docx 本身缺少第 6 題），計分已依實際題數計算，不是寫死的 bug。
