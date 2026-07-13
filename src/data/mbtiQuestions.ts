// Hand-corrected from scripts/mbti-draft.json (raw extraction of
// mbti少年版測驗題.docx). See scripts/parse-mbti-docx.mjs for the extraction
// tool. Known source-document issues fixed here:
//  - Q14's paragraph had a stray glued leading "1" ("114朋友們吵架時...").
//  - Option B paragraphs inconsistently had a stray leading "B" glued to the
//    text; stripped throughout.
//  - The docx's own "《軸》維度・第 N 題" section headers are corrupted in
//    several spots and were not usable as anchors.
//  - The docx contains a verbatim duplicate of Q15 mislabeled "17" — dropped.
//  - The S/N axis only has 5 distinct questions in the source document
//    (should be 6 to match the other three axes) — this is a genuine gap in
//    the source docx, not a parsing artifact. Scoring is axis-length-aware
//    rather than hardcoded to 6, so this doesn't break the math, but it does
//    mean S/N strength is computed out of 5 instead of 6.
export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';
export type MbtiPole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MbtiQuestion {
  id: string;
  axis: MbtiAxis;
  text: string;
  optionA: { text: string; pole: MbtiPole };
  optionB: { text: string; pole: MbtiPole };
}

export const MBTI_AXIS_EXPLANATIONS: Record<MbtiAxis, string[]> = {
  EI: [
    '你喜歡和朋友一起玩還是獨自玩耍的方式',
    '在學校和家裡你如何獲得快樂和能量',
    '你在團體活動中的表現和感受',
  ],
  SN: [
    '你學習新知識和技能的最佳方式',
    '你對現實世界和想像世界的興趣',
    '你解決問題時的思維方式',
  ],
  TF: [
    '你如何處理與朋友的分歧和衝突',
    '你做決定時考慮的重要因素',
    '你如何幫助別人和表達關心',
  ],
  JP: [
    '你喜歡的日常生活安排方式',
    '你對計畫和靈活性的態度',
    '你完成任務和作業的習慣',
  ],
};

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // E / I
  {
    id: 'mbti-ei-1',
    axis: 'EI',
    text: '你喜歡怎樣和朋友們一起度過時間？',
    optionA: { text: '我喜歡和很多朋友一起玩耍和聊天', pole: 'E' },
    optionB: { text: '我喜歡和一兩個好朋友安靜地待在一起', pole: 'I' },
  },
  {
    id: 'mbti-ei-2',
    axis: 'EI',
    text: '放學後感到累的時候，什麼能讓你感覺更好？',
    optionA: { text: '和家人或朋友聊天玩耍', pole: 'E' },
    optionB: { text: '在自己房間裡安靜地休息', pole: 'I' },
  },
  {
    id: 'mbti-ei-3',
    axis: 'EI',
    text: '在學校遇到新同學時，你會怎麼做？',
    optionA: { text: '我會主動走過去和他們交朋友', pole: 'E' },
    optionB: { text: '我會等他們先和我說話', pole: 'I' },
  },
  {
    id: 'mbti-ei-4',
    axis: 'EI',
    text: '週末的時候你喜歡做什麼？',
    optionA: { text: '和朋友或家人一起出去玩', pole: 'E' },
    optionB: { text: '在家裡看書、畫畫或自己玩', pole: 'I' },
  },
  {
    id: 'mbti-ei-5',
    axis: 'EI',
    text: '你喜歡用什麼方式和朋友分享消息？',
    optionA: { text: '我喜歡打電話或視頻聊天', pole: 'E' },
    optionB: { text: '我更喜歡發短信或寫紙條', pole: 'I' },
  },
  {
    id: 'mbti-ei-6',
    axis: 'EI',
    text: '在課堂上或小組活動中，你通常怎麼表現？',
    optionA: { text: '我經常舉手發言，分享我的想法', pole: 'E' },
    optionB: { text: '我認真聽講，想好了再說話', pole: 'I' },
  },
  // S / N
  {
    id: 'mbti-sn-1',
    axis: 'SN',
    text: '學習新東西時，你喜歡哪種方式？',
    optionA: { text: '我喜歡通過實際例子一步步學習', pole: 'S' },
    optionB: { text: '我喜歡先瞭解整體概念，然後想像各種可能性', pole: 'N' },
  },
  {
    id: 'mbti-sn-2',
    axis: 'SN',
    text: '你喜歡和朋友聊什麼話題？',
    optionA: { text: '今天發生的有趣事情或學到的酷知識', pole: 'S' },
    optionB: { text: '未來的夢想和充滿想像力的想法', pole: 'N' },
  },
  {
    id: 'mbti-sn-3',
    axis: 'SN',
    text: '家庭旅行時，什麼最讓你興奮？',
    optionA: { text: '去我知道會很有趣的地方', pole: 'S' },
    optionB: { text: '探索我從未去過的新地方', pole: 'N' },
  },
  {
    id: 'mbti-sn-4',
    axis: 'SN',
    text: '做作業或專案時，你是怎麼工作的？',
    optionA: { text: '我會仔細完成每一步，檢查所有內容', pole: 'S' },
    optionB: { text: '我先考慮整體，然後開始', pole: 'N' },
  },
  {
    id: 'mbti-sn-5',
    axis: 'SN',
    text: '你最喜歡什麼類型的書或電影？',
    optionA: { text: '關於現實生活和可能真實發生的故事', pole: 'S' },
    optionB: { text: '有魔法和想像世界的奇幻故事', pole: 'N' },
  },
  // T / F
  {
    id: 'mbti-tf-1',
    axis: 'TF',
    text: '需要做選擇時，什麼幫助你決定？',
    optionA: { text: '我思考什麼最合理、最公平', pole: 'T' },
    optionB: { text: '我思考這會讓人們感覺如何', pole: 'F' },
  },
  {
    id: 'mbti-tf-2',
    axis: 'TF',
    text: '朋友犯錯誤時，你會怎麼做？',
    optionA: { text: '我幫助他們找出問題所在，想辦法解決', pole: 'T' },
    optionB: { text: '我讓他們感覺好一些，告訴他們沒關係', pole: 'F' },
  },
  {
    id: 'mbti-tf-3',
    axis: 'TF',
    text: '朋友們吵架時，你會怎麼做？',
    optionA: { text: '我試圖根據事實找出誰是對的', pole: 'T' },
    optionB: { text: '我試圖幫助大家和好，讓每個人都感覺好一些', pole: 'F' },
  },
  {
    id: 'mbti-tf-4',
    axis: 'TF',
    text: '朋友向你尋求幫助時，你怎麼幫助他們？',
    optionA: { text: '我給他們解決問題的好主意', pole: 'T' },
    optionB: { text: '我傾聽他們的感受，讓他們感到被支持', pole: 'F' },
  },
  {
    id: 'mbti-tf-5',
    axis: 'TF',
    text: '看其他同學時，你主要注意什麼？',
    optionA: { text: '他們有多聰明，擅長什麼', pole: 'T' },
    optionB: { text: '他們有多善良，是否努力嘗試', pole: 'F' },
  },
  {
    id: 'mbti-tf-6',
    axis: 'TF',
    text: '小組做決定時，什麼對你最重要？',
    optionA: { text: '確保規則對每個人都公平', pole: 'T' },
    optionB: { text: '確保考慮到每個人的感受', pole: 'F' },
  },
  // J / P
  {
    id: 'mbti-jp-1',
    axis: 'JP',
    text: '你喜歡怎樣安排你的一天？',
    optionA: { text: '我喜歡計畫要做什麼，然後按計劃進行', pole: 'J' },
    optionB: { text: '我喜歡保持靈活，看看會發生什麼', pole: 'P' },
  },
  {
    id: 'mbti-jp-2',
    axis: 'JP',
    text: '有未完成的作業時，你感覺如何？',
    optionA: { text: '我感到擔心，想要馬上完成', pole: 'J' },
    optionB: { text: '我不太擔心，可以稍後再做', pole: 'P' },
  },
  {
    id: 'mbti-jp-3',
    axis: 'JP',
    text: '你對計畫和承諾的看法是什麼？',
    optionA: { text: '計畫很重要，應該遵守', pole: 'J' },
    optionB: { text: '如果有更好的事情出現，計畫可以改變', pole: 'P' },
  },
  {
    id: 'mbti-jp-4',
    axis: 'JP',
    text: '學校組織旅行時，你更喜歡什麼？',
    optionA: { text: '提前計畫好所有事情', pole: 'J' },
    optionB: { text: '到了那裡再決定要做什麼', pole: 'P' },
  },
  {
    id: 'mbti-jp-5',
    axis: 'JP',
    text: '做學校專案時，你喜歡怎麼工作？',
    optionA: { text: '我從頭到尾按步驟有序完成', pole: 'J' },
    optionB: { text: '我從有趣的部分開始，想做什麼就做什麼', pole: 'P' },
  },
  {
    id: 'mbti-jp-6',
    axis: 'JP',
    text: '需要做決定時，你是什麼樣子的？',
    optionA: { text: '我仔細思考，然後堅持我的選擇', pole: 'J' },
    optionB: { text: '我喜歡保持選擇開放，稍後再決定', pole: 'P' },
  },
];
