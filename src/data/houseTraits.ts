import type { HouseId } from './houseTypes';

export interface HouseTrait {
  house: HouseId;
  keywords: string;
  description: string;
}

export const HOUSE_TRAITS: Record<HouseId, HouseTrait> = {
  gryffindor: {
    house: 'gryffindor',
    keywords: '勇氣、行動、正義、願意挑戰',
    description:
      '你可能願意在困難時站出來，也願意嘗試沒做過的事情。',
  },
  ravenclaw: {
    house: 'ravenclaw',
    keywords: '好奇、思考、創意、分析',
    description:
      '你可能喜歡了解事情的原因，也常提出新的想法和問題。',
  },
  hufflepuff: {
    house: 'hufflepuff',
    keywords: '合作、忠誠、公平、耐心',
    description:
      '你可能重視團隊中的每一個人，也願意完成不顯眼但重要的工作。',
  },
  slytherin: {
    house: 'slytherin',
    keywords: '目標、策略、領導、資源整合',
    description:
      '你可能善於規劃、掌握機會，並思考如何有效完成任務。',
  },
};

export const SORTING_DECLARATION = [
  '每一個人都同時擁有四個學院的力量。',
  '分院結果並不是替你貼上固定標籤，而是讓你看見自己目前最常使用的能力。你也可以在未來的學習中，練習其他學院的力量。',
  '用雷文克勞思考，用史萊哲林規劃，用赫夫帕夫合作，用葛來分多行動。',
];
