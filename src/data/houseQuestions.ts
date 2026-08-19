import type { HouseId } from './houseTypes';

export interface HouseQuestionOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  house: HouseId;
}

export interface HouseQuestion {
  id: string;
  index: number;
  title: string;
  body: string;
  options: HouseQuestionOption[];
}

function makeOptions(
  a: string,
  b: string,
  c: string,
  d: string,
): HouseQuestionOption[] {
  return [
    { letter: 'A', text: a, house: 'courage' },
    { letter: 'B', text: b, house: 'wisdom' },
    { letter: 'C', text: c, house: 'patience' },
    { letter: 'D', text: d, house: 'composure' },
  ];
}

export const HOUSE_QUESTIONS: HouseQuestion[] = [
  {
    id: 'house-1',
    index: 1,
    title: '陌生的第一天',
    body: '開學第一天，你走進一間大家都不熟悉的教室，你最可能怎麼做？',
    options: makeOptions(
      '主動和旁邊的人打招呼，試著帶動氣氛。',
      '先觀察教室和同學，了解現在的情況。',
      '找到看起來需要幫忙的人，陪他一起行動。',
      '先確認老師的要求，思考怎麼做最有效率。',
    ),
  },
  {
    id: 'house-2',
    index: 2,
    title: '小組任務卡住了',
    body: '小組正在完成一項任務，但大家一直沒有進展，你會：',
    options: makeOptions(
      '鼓勵大家先試一次，做了再調整。',
      '分析問題出在哪裡，重新整理線索。',
      '詢問每個人的想法，讓大家重新合作。',
      '重新分配工作，讓適合的人負責適合的任務。',
    ),
  },
  {
    id: 'house-3',
    index: 3,
    title: '朋友被嘲笑',
    body: '你看到一位同學被別人嘲笑，你最可能：',
    options: makeOptions(
      '立刻站出來阻止。',
      '先了解事情的前因後果。',
      '陪伴被嘲笑的同學，讓他知道自己不是一個人。',
      '尋找最有效的方法，例如找老師或其他同學協助。',
    ),
  },
  {
    id: 'house-4',
    index: 4,
    title: '神祕寶箱',
    body: '你在校園裡發現一個上鎖的神祕寶箱，你最想：',
    options: makeOptions(
      '想辦法立刻打開它。',
      '研究鎖、文字和圖案中的線索。',
      '找朋友一起解開，大家共享發現。',
      '先思考寶箱可能帶來的好處或風險。',
    ),
  },
  {
    id: 'house-5',
    index: 5,
    title: '比賽即將開始',
    body: '班級要參加一場團體競賽，你會優先做什麼？',
    options: makeOptions(
      '提醒大家不要害怕，全力挑戰。',
      '研究比賽規則和可能的解法。',
      '確認每位隊員都知道自己的工作。',
      '制定策略，安排最有勝算的順序。',
    ),
  },
  {
    id: 'house-6',
    index: 6,
    title: '意見不同',
    body: '當你和同學的意見不同時，你比較常：',
    options: makeOptions(
      '直接說出自己的看法，勇敢面對衝突。',
      '用理由和證據討論哪個方法比較合理。',
      '尋找雙方都能接受的做法。',
      '判斷哪一個方案最能達成目標。',
    ),
  },
  {
    id: 'house-7',
    index: 7,
    title: '最想獲得的魔法能力',
    body: '你最想擁有哪一種魔法能力？',
    options: makeOptions(
      '在危險時保護別人的力量。',
      '看懂所有謎題和知識的力量。',
      '讓人們互相信任、共同合作的力量。',
      '看見機會並完成重要目標的力量。',
    ),
  },
  {
    id: 'house-8',
    index: 8,
    title: '大家都不想做的工作',
    body: '小組中有一項麻煩又不受歡迎的工作，你會：',
    options: makeOptions(
      '主動接下來，因為總要有人去做。',
      '想辦法改進流程，讓工作變簡單。',
      '和大家一起分擔，不讓某個人獨自完成。',
      '重新安排資源，找出效率最高的方法。',
    ),
  },
  {
    id: 'house-9',
    index: 9,
    title: '面對失敗',
    body: '你努力完成一件事情，最後卻失敗了，你會：',
    options: makeOptions(
      '再挑戰一次，不輕易認輸。',
      '分析失敗原因，找出新的方法。',
      '和夥伴互相鼓勵，再一起努力。',
      '調整目標與策略，改走另一條路。',
    ),
  },
  {
    id: 'house-10',
    index: 10,
    title: '團隊中的角色',
    body: '在小組裡，你最常成為哪一種人？',
    options: makeOptions(
      '第一個採取行動的人。',
      '提出問題與新點子的人。',
      '關心大家並維持合作的人。',
      '規劃方向和分配任務的人。',
    ),
  },
  {
    id: 'house-11',
    index: 11,
    title: '遇到不熟悉的挑戰',
    body: '老師交給你一項從來沒有做過的任務，你會：',
    options: makeOptions(
      '雖然有點害怕，還是願意先嘗試。',
      '先查資料，弄清楚方法和原理。',
      '找夥伴討論，一起完成。',
      '先訂出目標、步驟和時間。',
    ),
  },
  {
    id: 'house-12',
    index: 12,
    title: '你最重視的事情',
    body: '以下哪一句話最接近你的想法？',
    options: makeOptions(
      '重要的事情，需要有人勇敢站出來。',
      '理解事情的原因，比只知道答案更重要。',
      '真正的成功，是沒有人被團隊遺忘。',
      '有清楚的目標，才能把想法真正完成。',
    ),
  },
];
