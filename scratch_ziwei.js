const fs = require('fs');

const baseData = {
  "紫微星": { destinyVibe: "帝王之氣，不怒而威", coreStrength: "頂級的領導力與資源調度能力，天生具備吸引貴人的磁場。", lifeChallenge: "你的傲慢與無法放下身段，將使你在低谷時眾叛親離。", hshFortuneAdvice: "你是天生的品牌核心。在 HSH，請專注於高端定位與品牌威信的建立，不要把精力消耗在瑣碎的行政流程上。" },
  "天機星": { destinyVibe: "神機妙算，參謀智囊", coreStrength: "極端敏銳的觀察力與邏輯運算能力，永遠能想出備案。", lifeChallenge: "你想得太多卻做得太少，神經質的內耗會拖垮你的執行力。", hshFortuneAdvice: "你是最強的軍師。適合在幕後策劃 HSH 的自動化流程與行銷策略，但記得找個執行力強的夥伴幫你落地。" },
  "太陽星": { destinyVibe: "光芒萬丈，無私付出", coreStrength: "極具渲染力的熱情與公眾影響力，能輕易帶動團隊士氣。", lifeChallenge: "過度燃燒自己照亮別人，最終只會換來疲憊與被理所當然的對待。", hshFortuneAdvice: "你是天生的發言人。適合負責 HSH 的公關、社群活動與住戶體驗，但請務必設立「服務界線」，別當爛好人。" },
  "武曲星": { destinyVibe: "剛毅果決，財富戰將", coreStrength: "驚人的執行力與對金錢的極度敏銳，能用最有效率的方式變現。", lifeChallenge: "你的功利主義與缺乏人情味，會讓你在關鍵時刻失去溫柔的支援。", hshFortuneAdvice: "你是最強的財務長。請主導 HSH 的成本控管與獲利模型，但記得在溝通時加點「人味」，別把租客當純粹的數字。" },
  "天同星": { destinyVibe: "福星高照，與世無爭", coreStrength: "極佳的協調能力與親和力，總能在衝突中找到平衡點。", lifeChallenge: "你的懶散與缺乏企圖心，會讓你在舒適圈裡溫水煮青蛙。", hshFortuneAdvice: "你是氣氛製造機。適合打造 HSH 的軟性文化與住戶關懷系統，但請給自己設定嚴格的 KPI，否則很容易淪為空談。" },
  "廉貞星": { destinyVibe: "次桃花星，亦正亦邪", coreStrength: "強大的外交手腕與極致的公關魅力，擅長在複雜的人際網中穿梭。", lifeChallenge: "情緒起伏極大，你的多疑與狂傲會親手毀掉你建立的關係網。", hshFortuneAdvice: "你是頂級的外交官。適合處理 HSH 的棘手客訴或異業結盟，但請把控好你的情緒炸彈，避免公關危機。" },
  "天府星": { destinyVibe: "南斗帝王，財庫之主", coreStrength: "穩重保守的管理能力與極強的蓄財能力，擅長守成與擴張。", lifeChallenge: "過度保守與計算，會讓你錯失需要承擔風險才能獲得的爆發性紅利。", hshFortuneAdvice: "你是最穩的營運長。請負責 HSH 的資產管理與長期穩定獲利，但也請適時開放一點創新實驗的空間。" },
  "太陰星": { destinyVibe: "溫潤如水，隱密蓄財", coreStrength: "細膩的感知力與極佳的房地產直覺，擅長透過長期積累致富。", lifeChallenge: "過度在意細節與他人的眼光，會讓你在決策時優柔寡斷、患得患失。", hshFortuneAdvice: "你是天生的包租公/婆。請專注於 HSH 的空間美學與隱蔽性資產配置，你的品味將是最大的溢價來源。" },
  "貪狼星": { destinyVibe: "慾望之神，八面玲瓏", coreStrength: "驚人的交際手腕與永不滿足的求知慾/物慾，能將人脈迅速變現。", lifeChallenge: "你的貪得無厭與缺乏專注力，會讓你什麼都想抓，最後什麼都抓不住。", hshFortuneAdvice: "你是最強的業務開發。適合為 HSH 拓展全新市場或發掘潛在投資標的，但請學會「聚焦」，別把戰線拉得太長。" },
  "巨門星": { destinyVibe: "暗黑之口，洞視真相", coreStrength: "強大的分析批判能力與口才，能一眼看穿事物的漏洞與本質。", lifeChallenge: "你那張刀子嘴與過度的猜忌心，會無意間刺傷身邊最親近的人。", hshFortuneAdvice: "你是最佳的查核官。適合負責 HSH 的法務合約檢視與風險控管，但請用「建議」取代「批判」，減少內部摩擦。" },
  "天相星": { destinyVibe: "宰相之才，公允端正", coreStrength: "絕佳的輔佐能力與極高的信任感，是所有人眼中最可靠的副手。", lifeChallenge: "缺乏開創的勇氣與過度依賴體制，會讓你永遠只能在別人的框架裡打轉。", hshFortuneAdvice: "你是完美的合夥人。適合掌握 HSH 的印信與行政大權，確保一切合規運作，但有時你也需要大膽提出破局的策略。" },
  "天梁星": { destinyVibe: "蔭星老大，逢凶化吉", coreStrength: "成熟穩重的特質與強大的危機處理能力，天生具備長輩緣與庇蔭力。", lifeChallenge: "你的愛管閒事與好為人師，會讓人覺得你倚老賣老、難以親近。", hshFortuneAdvice: "你是最強的危機處理專家。當 HSH 遇到重大公關或法律危機時，你就是最後的底牌。平時請退居二線，作為顧問存在即可。" },
  "七殺星": { destinyVibe: "開路先鋒，孤膽英雄", coreStrength: "無所畏懼的開創力與絕對的執行力，能在死局中殺出一條血路。", lifeChallenge: "你的衝動與缺乏耐心，往往會在打下江山後，因為不懂守成而迅速敗光。", hshFortuneAdvice: "你是最好的拓荒者。適合負責 HSH 全新案場的開發與初期建置，一旦軌道建立，請立刻交接給管理型人才，繼續你的下一場戰鬥。" },
  "破軍星": { destinyVibe: "破壞之王，顛覆傳統", coreStrength: "敢於打破一切舊有框架的魄力，能在徹底的破壞中找到重生的創新。", lifeChallenge: "你那為了反對而反對的叛逆，以及情緒化的暴走，會讓團隊處於長期的動盪不安。", hshFortuneAdvice: "你是顛覆性的創新者。適合負責 HSH 的老屋翻新或商業模式重構，但請務必搭配一個「天府/天相」型的夥伴來幫你收拾殘局與穩固後方。" }
};

const output = `// Auto-generated Zi Wei Dou Shu Dictionary
export interface ZiweiData {
  starName: string;
  destinyVibe: string;
  coreStrength: string;
  lifeChallenge: string;
  hshFortuneAdvice: string;
}

export const ZIWEI_DICT: Record<string, ZiweiData> = ${JSON.stringify(baseData, null, 2)};
`;

fs.writeFileSync('lib/data/ziweiData.ts', output);
console.log('ziweiData.ts generated successfully.');
