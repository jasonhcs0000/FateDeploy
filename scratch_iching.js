const fs = require('fs');

const baseData = {
  "乾為天": { strategy: "全軍出擊", warning: "剛愎自用，過於強勢", decisionAdvice: "今日適合發布重大決策，不要猶豫，展現你的統御力。" },
  "坤為地": { strategy: "按兵不動", warning: "盲目行動，缺乏耐心", decisionAdvice: "今日適合退居幕後，傾聽他人意見，厚德載物方能長久。" },
  "水雷屯": { strategy: "穩紮穩打", warning: "操之過急，根基未穩", decisionAdvice: "萬事起頭難，今日應專注於基礎建設與資源盤點，不宜擴張。" },
  "山水蒙": { strategy: "尋求導師", warning: "自作聰明，忽視專業", decisionAdvice: "面對未知，今日適合向更有經驗的顧問請益，釐清盲點。" },
  "水天需": { strategy: "靜待時機", warning: "焦躁不安，提前消耗", decisionAdvice: "資源尚未到位，今日適合積蓄能量，等待最佳切入點。" },
  "天水訟": { strategy: "化解衝突", warning: "意氣之爭，兩敗俱傷", decisionAdvice: "有潛在的合約或人事糾紛，今日應以退為進，尋求和解。" },
  "地水師": { strategy: "建立紀律", warning: "群龍無首，紀律渙散", decisionAdvice: "今日適合檢視合約細節或優化內部流程，強化團隊執行力。" },
  "水地比": { strategy: "結盟互利", warning: "孤軍奮戰，排斥合作", decisionAdvice: "今日適合尋找合作夥伴或進行跨部門協作，互利共榮。" },
  "風天小畜": { strategy: "累積資源", warning: "好高騖遠，眼高手低", decisionAdvice: "目前力量尚小，今日適合做細部的優化與微小成果的累積。" },
  "天澤履": { strategy: "如履薄冰", warning: "僭越職權，觸犯規則", decisionAdvice: "今日行事需謹慎，依循既有規範與階級行事，避免惹怒關鍵人物。" },
  "地天泰": { strategy: "全面擴張", warning: "安於現狀，錯失良機", decisionAdvice: "局勢極佳，今日適合推進停滯的專案，上下溝通順暢無阻。" },
  "天地否": { strategy: "防守保本", warning: "盲目樂觀，無視風險", decisionAdvice: "大環境不佳，今日不宜發動新企劃，請鎖緊預算，安度低谷。" },
  "天火同人": { strategy: "尋找同好", warning: "內部不合，理念分歧", decisionAdvice: "今日適合舉辦團隊會議或建立社群，凝聚共識，擴大影響力。" },
  "火天大有": { strategy: "展現成果", warning: "驕兵必敗，炫耀招忌", decisionAdvice: "資源豐沛，今日適合對外展示實力，進行行銷或成果發表。" },
  "地山謙": { strategy: "保持低調", warning: "過度自信，引人注目", decisionAdvice: "今日的成功來自於你的退讓與謙遜，請將舞台讓給團隊。" },
  "雷地豫": { strategy: "預先準備", warning: "耽於安樂，毫無防備", decisionAdvice: "今日適合制定未來計畫或舉辦動員大會，為即將到來的機會做準備。" },
  "澤雷隨": { strategy: "順勢而為", warning: "固執己見，逆勢操作", decisionAdvice: "今日不宜強出頭，請跟隨市場趨勢或高層決策，順水推舟。" },
  "山風蠱": { strategy: "徹底改革", warning: "苟且偷安，諱疾忌醫", decisionAdvice: "內部存在陳年舊疾，今日適合雷厲風行地整頓流程，除舊佈新。" },
  "地澤臨": { strategy: "親自督導", warning: "高高在上，脫離第一線", decisionAdvice: "今日適合走入基層或親自面對客戶，掌握最真實的營運狀況。" },
  "風地觀": { strategy: "洞察局勢", warning: "短視近利，見樹不見林", decisionAdvice: "今日適合進行市場調查或高層次策略思考，看清全貌再行動。" },
  "火雷噬嗑": { strategy: "果斷執法", warning: "優柔寡斷，姑息養奸", decisionAdvice: "今日必須展現魄力，解決阻礙進度的毒瘤或不合規的行為。" },
  "山火賁": { strategy: "包裝行銷", warning: "虛有其表，缺乏實質", decisionAdvice: "今日適合處理品牌形象、簡報設計或空間美化，提升視覺說服力。" },
  "山地剝": { strategy: "及時停損", warning: "死不認錯，越陷越深", decisionAdvice: "局勢不利，今日適合裁撤不良專案或清理冗餘資產，保存實力。" },
  "地雷復": { strategy: "重新出發", warning: "急於求成，腳步混亂", decisionAdvice: "生機重現，今日適合重啟曾被擱置的計畫，以微小的步伐試水溫。" },
  "天雷無妄": { strategy: "回歸初心", warning: "心存僥倖，投機取巧", decisionAdvice: "今日請堅持正道，不合理的捷徑往往是陷阱，按部就班即可獲利。" },
  "山天大畜": { strategy: "持續深耕", warning: "半途而廢，缺乏恆心", decisionAdvice: "今日適合進行深度的專業進修或大量資源的囤積，為未來爆發做準備。" },
  "山雷頤": { strategy: "謹言慎行", warning: "禍從口出，病從口入", decisionAdvice: "今日在溝通上需特別小心，避免因言語不當引發公關危機。" },
  "澤風大過": { strategy: "扛起重任", warning: "壓力過載，瞬間崩潰", decisionAdvice: "今日將面臨超出常規的挑戰，必須具備非凡的膽識才能渡過難關。" },
  "坎為水": { strategy: "靈活應變", warning: "深陷泥沼，無法自拔", decisionAdvice: "今日危機四伏，請保持如水般的彈性，見招拆招，切忌硬碰硬。" },
  "離為火": { strategy: "發揮影響力", warning: "熱度消退，後繼無力", decisionAdvice: "今日適合成為眾人焦點，你的熱情與願景將能成功感染團隊與客戶。" },
  "澤山咸": { strategy: "真誠溝通", warning: "虛情假意，缺乏共鳴", decisionAdvice: "今日適合進行一對一深度對談或建立新的業務聯繫，憑直覺行事。" },
  "雷風恆": { strategy: "堅持到底", warning: "朝三暮四，隨意變更", decisionAdvice: "今日不宜改變既定策略，持續執行重複但有效的 SOP 才是致勝關鍵。" },
  "天山遯": { strategy: "戰略撤退", warning: "死纏爛打，不甘放手", decisionAdvice: "今日面對不可抗力之阻礙，請果斷退出戰局，保留核心資源。" },
  "雷天大壯": { strategy: "強勢推進", warning: "有勇無謀，橫衝直撞", decisionAdvice: "今日氣勢如虹，適合以絕對優勢輾壓對手，但仍需恪守商業規範。" },
  "火地晉": { strategy: "積極晉升", warning: "急功近利，得罪小人", decisionAdvice: "今日是展露頭角的好時機，適合爭取升遷、爭取新專案或擴展版圖。" },
  "地火明夷": { strategy: "韜光養晦", warning: "鋒芒太露，成為標靶", decisionAdvice: "今日環境極度險惡，請隱藏真實意圖與實力，暗中進行佈局。" },
  "風火家人": { strategy: "穩固內部", warning: "後院起火，攘外必先安內", decisionAdvice: "今日請將重心放回團隊內部建設或家族事務，內部團結才能對外作戰。" },
  "火澤睽": { strategy: "求同存異", warning: "互相猜忌，信任破裂", decisionAdvice: "今日容易出現意見分歧，請專注於共同利益，而非糾結於細節差異。" },
  "水山蹇": { strategy: "反求諸己", warning: "怨天尤人，原地踏步", decisionAdvice: "今日前方困難重重，與其強行突破，不如停下來精進自己的專業能力。" },
  "雷水解": { strategy: "迅速行動", warning: "拖泥帶水，錯失良機", decisionAdvice: "危機已過，今日適合立刻執行原先被擱置的決策，掃除一切障礙。" },
  "山澤損": { strategy: "先捨後得", warning: "斤斤計較，因小失大", decisionAdvice: "今日適合進行前期投資或給予客戶折扣，長遠來看將帶來更大的回報。" },
  "風雷益": { strategy: "乘勝追擊", warning: "猶豫不決，錯失風口", decisionAdvice: "今日局勢極為有利，請大膽投入資源，擴張事業版圖。" },
  "澤天夬": { strategy: "果斷決裂", warning: "優柔寡斷，後患無窮", decisionAdvice: "今日適合斬斷不健康的合作關係或公開宣告新政策，必須態度堅決。" },
  "天風姤": { strategy: "防微杜漸", warning: "被表面吸引，忽視潛在危機", decisionAdvice: "今日會遇到意外的機遇或人物，請保持警覺，天上掉下來的可能是陷阱。" },
  "澤地萃": { strategy: "匯聚資源", warning: "資源分散，各自為政", decisionAdvice: "今日適合舉辦大型活動或進行資金募集，將分散的力量集中運用。" },
  "地風升": { strategy: "循序漸進", warning: "一步登天，跌入深淵", decisionAdvice: "今日事業處於上升期，請按照既定步伐穩健攀升，累積信譽與實績。" },
  "澤水困": { strategy: "堅守底線", warning: "病急亂投醫，失去原則", decisionAdvice: "今日處於極度困乏之境，請保持冷靜與樂觀，等待外部救援或局勢反轉。" },
  "水風井": { strategy: "建立系統", warning: "枯竭乾涸，缺乏維護", decisionAdvice: "今日適合優化基礎建設或自動化系統，這將為未來提供源源不絕的價值。" },
  "澤火革": { strategy: "徹底轉型", warning: "墨守成規，慘遭淘汰", decisionAdvice: "今日是變革的最佳時機，請勇敢推翻舊有模式，引進全新的營運思維。" },
  "火風鼎": { strategy: "穩固三方", warning: "失去平衡，全盤皆輸", decisionAdvice: "今日適合確立新的組織架構或三方合作模式，確保權力與利益的平衡。" },
  "震為雷": { strategy: "臨危不亂", warning: "驚慌失措，做出錯誤決策", decisionAdvice: "今日將有突發事件震驚全局，請保持絕對冷靜，危機中往往藏有轉機。" },
  "艮為山": { strategy: "靜止不動", warning: "妄動招損，徒勞無功", decisionAdvice: "今日無論外界如何喧囂，請保持不動如山，現在不是採取行動的時機。" },
  "風山漸": { strategy: "按部就班", warning: "急躁躍進，破壞節奏", decisionAdvice: "今日任何進展都必須遵循正確的程序，像樹木生長般穩定累積。" },
  "雷澤歸妹": { strategy: "看清現實", warning: "不按牌理出牌，名不正言不順", decisionAdvice: "今日的進展可能充滿妥協與無奈，請接受現實的缺陷，先求有再求好。" },
  "雷火豐": { strategy: "把握巔峰", warning: "極盛而衰，樂極生悲", decisionAdvice: "今日處於資源與聲望的頂峰，請盡情發揮，同時也要開始為未來的衰退做準備。" },
  "火山旅": { strategy: "客隨主便", warning: "反客為主，引發衝突", decisionAdvice: "今日處於陌生領域或出差狀態，請保持低調謙遜，遵守當地的遊戲規則。" },
  "巽為風": { strategy: "無孔不入", warning: "隨風搖擺，毫無主見", decisionAdvice: "今日適合透過柔性溝通或地下管道推動事情，像風一樣潛移默化。" },
  "兌為澤": { strategy: "以言動人", warning: "巧言令色，失去誠信", decisionAdvice: "今日適合進行談判、演講或公關活動，用你的言語魅力說服眾人。" },
  "風水渙": { strategy: "化解僵局", warning: "軍心渙散，組織瓦解", decisionAdvice: "今日適合透過精神喊話或共同願景，重新凝聚因危機而渙散的團隊士氣。" },
  "水澤節": { strategy: "建立規範", warning: "過度限制，扼殺創意", decisionAdvice: "今日適合制定預算限制或操作規範，在有限的框架內發揮最大效益。" },
  "風澤中孚": { strategy: "以誠信為本", warning: "弄虛作假，信譽掃地", decisionAdvice: "今日的任何合約或承諾都必須建立在絕對的誠信之上，這是最好的通行證。" },
  "雷山小過": { strategy: "謹慎微調", warning: "過度擴張，無法收場", decisionAdvice: "今日只適合處理細節問題或進行小幅度的修改，千萬不可做出重大決策。" },
  "水火既濟": { strategy: "防患未然", warning: "功成名就，麻痺大意", decisionAdvice: "今日事情看似完美達成，但請立刻檢視潛在的漏洞，防止盛極而衰。" },
  "火水未濟": { strategy: "保持希望", warning: "放棄希望，功虧一簣", decisionAdvice: "今日事情尚未明朗，雖然混亂但充滿無限可能，請咬緊牙關撐到最後一刻。" }
};

const output = `// Auto-generated I Ching Dictionary
export interface IChingData {
  hexagramName: string;
  strategy: string;
  warning: string;
  decisionAdvice: string;
}

export const ICHING_DICT: Record<string, IChingData> = ${JSON.stringify(baseData, null, 2)};
`;

fs.writeFileSync('lib/data/ichingData.ts', output);
console.log('ichingData.ts generated successfully.');
