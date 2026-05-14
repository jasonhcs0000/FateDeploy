"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Scale, Star, Activity, Moon, Crown, SunDim, Compass, BookOpen, Quote, Circle, Fingerprint, Database, Search, Lock, X, Settings, Hexagon } from 'lucide-react';
import { calculateFullFate, searchGoldenNodes } from '@/lib/fateLogic';
import { CyberDatePicker } from '@/components/CyberDatePicker';

export default function Home() {
  const [conceptionDate, setConceptionDate] = useState('2026-05-20');
  const [mode, setMode] = useState<'deploy' | 'parse'>('parse');
  const [birthHour, setBirthHour] = useState<number>(0);
  const [fateData, setFateData] = useState<ReturnType<typeof calculateFullFate>>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [matrixText, setMatrixText] = useState("");
  
  const [goldenNodes, setGoldenNodes] = useState<any[]>([]);
  const [isSearchingNodes, setIsSearchingNodes] = useState(false);
  
  const [sealPopup, setSealPopup] = useState(false);
  const [sabianPopup, setSabianPopup] = useState(false);
  const [tarotPopup, setTarotPopup] = useState(false);
  const [hdPopup, setHdPopup] = useState(false);
  const [ichingPopup, setIchingPopup] = useState(false);
  const [ziweiPopup, setZiweiPopup] = useState(false);

  const HexagramVisual = ({ lines, size = 'sm' }: { lines: number[], size?: 'sm'|'lg' }) => {
    const h = size === 'lg' ? 'h-2 mb-1.5' : 'h-1 mb-[2px]';
    const w = size === 'lg' ? 'w-10' : 'w-6';
    return (
      <div className={`flex flex-col-reverse items-center ${w}`}>
        {lines.map((l, i) => (
          <div key={i} className={`flex w-full ${h} justify-between text-current`}>
            {l === 1 ? (
              <div className="w-full bg-current rounded-[1px]"></div>
            ) : (
              <>
                <div className="w-[45%] bg-current rounded-[1px]"></div>
                <div className="w-[45%] bg-current rounded-[1px]"></div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const SealedCard = ({ title, icon: Icon, message }: { title: string, icon: any, message: string }) => (
    <div 
      onClick={() => setSealPopup(true)}
      className="glass-card relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 cursor-pointer min-h-[160px]"
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md bg-black/40 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
        <Lock className="w-8 h-8 text-indigo-400/50 mb-3 animate-pulse drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        <div className="text-indigo-300 font-bold tracking-[0.2em] text-sm animate-pulse font-[family-name:var(--font-noto-serif-tc)]">
          天機解析中，敬請期待
        </div>
        <div className="absolute bottom-4 text-[10px] text-indigo-400/0 group-hover:text-indigo-400/80 tracking-widest transition-all duration-500">
          靜候時空座標校準完畢 (Coming Soon)
        </div>
      </div>
      
      <div className="opacity-20 blur-[3px] pointer-events-none p-6 relative z-0 h-full">
        <Icon className="absolute -right-4 -top-4 w-32 h-32 opacity-20 text-indigo-500" />
        <h2 className="text-sm mb-4 flex items-center text-indigo-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)]">
          <Icon className="w-4 h-4 mr-2" /> {title}
        </h2>
        <div className="text-base font-bold text-indigo-300 tracking-wider font-[family-name:var(--font-noto-serif-tc)] leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    // Oriental Matrix decoding effect
    setIsDecoding(true);
    let iterations = 0;
    const orientalChars = '乾坤震巽坎離艮兌甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥';
    const interval = setInterval(() => {
      setMatrixText(Array.from({length: 12}, () => orientalChars.charAt(Math.floor(Math.random() * orientalChars.length))).join(' '));
      iterations++;
      if (iterations > 18) {
        clearInterval(interval);
        setFateData(calculateFullFate(conceptionDate, mode, birthHour));
        setIsDecoding(false);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [conceptionDate, mode, birthHour]);

  const handleSearchNodes = () => {
    setIsSearchingNodes(true);
    setTimeout(() => {
      const nodes = searchGoldenNodes(conceptionDate, 365);
      setGoldenNodes(nodes);
      setIsSearchingNodes(false);
    }, 800);
  };

  return (
    <div className="p-6 md:p-12 font-mono text-gray-200 relative min-h-screen">
      {/* Dynamic Mode Background */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-colors duration-1000 -z-10 ${
          mode === 'parse' 
            ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(69,10,10,0.5),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.8),transparent_60%)]' 
            : 'bg-[radial-gradient(circle_at_20%_20%,rgba(30,41,59,0.3),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(49,46,129,0.35),transparent_60%)]'
        }`}
      />

      {/* Background Bagua decoration */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none rounded-full border-[20px] border-dashed flex items-center justify-center transition-colors duration-1000 ${mode === 'parse' ? 'border-red-900' : 'border-indigo-400'}`}>
        <div className={`w-[600px] h-[600px] rounded-full border-[10px] flex items-center justify-center transition-colors duration-1000 ${mode === 'parse' ? 'border-red-800' : 'border-indigo-300'}`}>
          <div className="text-[300px] leading-none">☯</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <Fingerprint className={`w-16 h-16 mx-auto mb-4 opacity-70 transition-colors duration-1000 ${mode === 'parse' ? 'text-red-500' : 'text-indigo-500'}`} />
          <h1 className="font-[family-name:var(--font-noto-serif-tc)] text-6xl md:text-8xl font-black mb-2 tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-indigo-100 via-indigo-300 to-indigo-600 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]">
            【天命部署】
          </h1>
          <div className="text-2xl font-bold tracking-[0.3em] text-indigo-300/80 mb-6 font-[family-name:var(--font-noto-serif-tc)]">
            萬象調律
          </div>
          
          <button 
            onClick={() => setMode(mode === 'deploy' ? 'parse' : 'deploy')}
            className={`flex items-center justify-center mx-auto mb-6 transition-colors duration-500 group ${mode === 'parse' ? 'text-red-400 hover:text-red-300' : 'text-indigo-400 hover:text-indigo-300'}`}
          >
            <div className={`text-4xl font-sans group-hover:rotate-180 transition-transform duration-700 ${mode === 'parse' ? 'drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]' : 'drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]'}`}>☯</div>
            <span className="ml-3 text-sm tracking-widest border-b border-dashed border-current pb-1">
              {mode === 'deploy' ? '切換至：既有命元解析' : '切換至：未來天命部署'}
            </span>
          </button>

          <p className={`font-mono text-sm md:text-base animate-pulse flex items-center justify-center tracking-widest ${mode === 'parse' ? 'text-red-400' : 'text-yellow-400'}`}>
            <span className={`w-2 h-2 rounded-full mr-3 animate-ping ${mode === 'parse' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
            天機解析中...
          </p>
        </header>

        {/* Main Interaction */}
        <div className={`bg-black/40 backdrop-blur-md p-10 mb-12 text-center max-w-2xl mx-auto border-x-4 border-double shadow-[0_0_40px_rgba(79,70,229,0.3)] relative z-50 group transition-colors duration-1000 ${mode === 'parse' ? 'border-red-900/50 shadow-[0_0_40px_rgba(153,27,27,0.3)]' : 'border-indigo-500/50'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10">
            <label className={`block text-xl mb-6 font-bold tracking-[0.2em] flex items-center justify-center font-[family-name:var(--font-noto-serif-tc)] transition-colors duration-1000 ${mode === 'parse' ? 'text-red-200' : 'text-indigo-200'}`}>
              <Database className="w-5 h-5 mr-3 opacity-60" /> {mode === 'parse' ? '定位命元降臨時刻' : '定位靈魂初始化時間點'}
            </label>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CyberDatePicker
                value={conceptionDate}
                onChange={setConceptionDate}
                themeColor={mode === 'parse' ? 'red' : 'indigo'}
                className="w-full sm:w-auto"
              />
              {mode === 'parse' && (
                <select 
                  className="bg-black/60 border border-red-900/40 rounded-sm px-6 py-4 text-2xl text-red-300 outline-none focus:ring-2 focus:ring-red-500 shadow-[inset_0_0_20px_rgba(153,27,27,0.2)] transition-all font-[family-name:var(--font-noto-serif-tc)] tracking-[0.1em] cursor-pointer"
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                >
                  {["子時 (23-01)", "丑時 (01-03)", "寅時 (03-05)", "卯時 (05-07)", "辰時 (07-09)", "巳時 (09-11)", "午時 (11-13)", "未時 (13-15)", "申時 (15-17)", "酉時 (17-19)", "戌時 (19-21)", "亥時 (21-23)"].map((label, idx) => (
                    <option key={idx} value={idx} className="bg-black text-red-200 text-lg">{label}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="h-24 mt-8 flex items-center justify-center">
              {isDecoding ? (
                <div className={`text-3xl font-bold tracking-[0.3em] bg-clip-text text-transparent animate-pulse font-[family-name:var(--font-noto-serif-tc)] ${mode === 'parse' ? 'bg-gradient-to-r from-red-400 to-orange-200' : 'bg-gradient-to-r from-yellow-400 to-yellow-200'}`}>
                  {matrixText}
                </div>
              ) : fateData && (
                <div className="space-y-4 w-full animate-fade-in-up">
                  <div>
                    <span className={`text-sm tracking-[0.2em] block mb-1 ${mode === 'parse' ? 'text-red-300/60' : 'text-indigo-300/60'}`}>
                      {mode === 'parse' ? '命元降臨紀錄' : '載體降臨預期'}
                    </span>
                    <span className={`font-bold text-3xl tracking-wider metallic-gloss ${mode === 'parse' ? 'text-red-200 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]' : 'text-indigo-200 drop-shadow-[0_0_10px_rgba(165,180,252,0.8)]'}`}>
                      {fateData.birthDate}
                    </span>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className={`text-sm font-bold tracking-widest px-5 py-2 border ${mode === 'parse' ? 'text-red-200 bg-red-900/40 border-red-900/30' : 'text-indigo-200 bg-indigo-900/40 border-indigo-500/30'}`}>
                      {fateData.lunarStr}
                    </div>
                    <div className={`text-sm font-bold tracking-widest stamp-seal rotate-[-2deg] ${mode === 'parse' ? 'border-red-600 text-red-500' : ''}`}>
                      {fateData.naYin}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {fateData && !isDecoding && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in">
            
            {/* 1. Bazi */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-500">
              <Scale className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-yellow-500" />
              <h2 className="text-sm mb-4 flex items-center text-yellow-500/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)]">
                <Scale className="w-4 h-4 mr-2" /> 八字架構
              </h2>
              <div className="text-3xl font-[family-name:var(--font-noto-serif-tc)] text-yellow-400 mb-2 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] metallic-gloss">{fateData.bazi.weightStr}</div>
              <div className="text-sm font-bold text-yellow-300/80 mb-3 tracking-widest">{fateData.bazi.baziStr}</div>
              <p className="text-yellow-100/80 text-sm tracking-wide leading-relaxed border-t border-yellow-500/20 pt-3">{fateData.bazi.desc}</p>
            </div>

            {/* 2. Zi Wei */}
            <div 
              onClick={() => setZiweiPopup(true)}
              className="glass-card p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 cursor-pointer"
            >
              <Star className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-indigo-500 group-hover:opacity-10 transition-opacity" />
              <h2 className="text-sm mb-4 flex items-center text-indigo-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Star className="w-4 h-4 mr-2" /> 紫微矩陣
              </h2>
              <div className="text-3xl font-[family-name:var(--font-noto-serif-tc)] text-indigo-300 mb-2 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)] metallic-gloss relative z-10">
                {fateData.ziwei.star}
              </div>
              <div className="text-sm font-bold text-indigo-300/80 mb-3 tracking-widest relative z-10">命宮：{fateData.ziwei.mingGongZhi}</div>
              <p className="text-indigo-200/80 text-sm tracking-wide leading-relaxed border-t border-indigo-500/20 pt-3 relative z-10 line-clamp-2">
                {fateData.ziwei.data.destinyVibe}
              </p>
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-500"></div>
            </div>

            {/* 3. Human Design */}
            <div 
              onClick={() => setHdPopup(true)}
              className="glass-card p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500 cursor-pointer"
            >
              <Activity className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-cyan-500 group-hover:opacity-10 transition-opacity" />
              <h2 className="text-sm mb-4 flex items-center text-cyan-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Activity className="w-4 h-4 mr-2" /> 人類圖
              </h2>
              <div className="text-xl font-bold mb-1 text-cyan-300 tracking-wider font-[family-name:var(--font-noto-serif-tc)] relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {fateData.humanDesign.typeData.type}
              </div>
              <div className="text-xs font-mono text-cyan-500/60 mb-3 tracking-widest relative z-10">
                人生角色：{fateData.humanDesign.profileData.profile}
              </div>
              <p className="text-cyan-100/80 text-sm tracking-wide leading-relaxed border-t border-cyan-500/20 pt-3 relative z-10 line-clamp-2">
                策略：{fateData.humanDesign.typeData.strategy}
              </p>
              <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-500"></div>
            </div>

            {/* 4. Tarot */}
            <div 
              onClick={() => setTarotPopup(true)}
              className="glass-card p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500 cursor-pointer"
            >
              <Moon className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-amber-500 group-hover:opacity-10 transition-opacity" />
              <h2 className="text-sm mb-4 flex items-center text-amber-500/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Moon className="w-4 h-4 mr-2" /> 塔羅靈魂數
              </h2>
              <div className="text-xl font-bold mb-1 text-amber-400 tracking-wider font-[family-name:var(--font-noto-serif-tc)] relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {fateData.tarot.data.archetype}
              </div>
              <div className="text-xs font-mono text-amber-500/60 mb-3 tracking-widest relative z-10">
                靈魂密碼：{fateData.tarot.soulNumber}
              </div>
              <p className="text-amber-100/80 text-sm tracking-wide leading-relaxed border-t border-amber-500/20 pt-3 relative z-10 line-clamp-2">
                {fateData.tarot.data.power}
              </p>
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500"></div>
            </div>

            {/* 5. Mayan Tzolkin */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
                <Settings className="w-[150%] h-[150%] text-purple-400 animate-spin" style={{ animationDuration: '60s' }} />
              </div>
              <Compass className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-purple-500" />
              <h2 className="text-sm mb-4 flex items-center text-purple-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Compass className="w-4 h-4 mr-2" /> 瑪雅曆法
              </h2>
              <div className="text-xl font-bold mb-1 text-purple-300 tracking-wider font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                {fateData.mayan.title}
              </div>
              <div className="text-xs font-mono text-purple-400/60 mb-3 tracking-widest relative z-10">
                {fateData.mayan.kin}
              </div>
              <p className="text-purple-100/80 text-sm tracking-wide leading-relaxed border-t border-purple-500/20 pt-3 relative z-10">
                {fateData.mayan.desc}
              </p>
            </div>

            {/* 6. Onomancy (Kept functional as requested) */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500">
              <BookOpen className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-indigo-500" />
              <h2 className="text-sm mb-4 flex items-center text-indigo-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)]">
                <BookOpen className="w-4 h-4 mr-2" /> 姓名學
              </h2>
              <div className="text-xl font-bold mb-3 text-indigo-300 tracking-wider metallic-gloss font-[family-name:var(--font-noto-serif-tc)]">{fateData.onomancy.zodiac}年出生</div>
              <p className="text-indigo-100/80 text-sm tracking-wide leading-relaxed border-t border-indigo-500/20 pt-3">{fateData.onomancy.desc}</p>
            </div>

            {/* 7. Sabian Symbols */}
            <div 
              onClick={() => setSabianPopup(true)}
              className="glass-card p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
            >
              <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-blue-500 group-hover:opacity-10 transition-opacity" />
              <h2 className="text-sm mb-4 flex items-center text-blue-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Sparkles className="w-4 h-4 mr-2" /> 薩比恩占星
              </h2>
              <div className="text-xl font-bold mb-1 text-blue-300 tracking-wider font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                太陽經緯：{fateData.astrology.sabian}
              </div>
              <p className="text-blue-100/80 text-sm tracking-wide leading-relaxed border-t border-blue-500/20 pt-3 relative z-10 line-clamp-2">
                {fateData.astrology.data.title}
              </p>
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500"></div>
            </div>

            {/* 8. I-Ching */}
            <div 
              onClick={() => setIchingPopup(true)}
              className="glass-card p-6 relative overflow-hidden group hover:border-rose-500/50 transition-all duration-500 cursor-pointer active:scale-[0.98] active:border-rose-400"
            >
              <Hexagon className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.04] text-rose-500 group-hover:opacity-10 transition-opacity group-hover:animate-spin" style={{ animationDuration: '20s' }} />
              <h2 className="text-sm mb-4 flex items-center text-rose-400/80 font-bold tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)] relative z-10">
                <Hexagon className="w-4 h-4 mr-2" /> 梅花易數
              </h2>
              <div className="flex items-end justify-between relative z-10 mb-2">
                <div className="text-xl font-bold text-rose-300 tracking-wider font-[family-name:var(--font-noto-serif-tc)] drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                  {fateData.iching.transformedHexagram}
                </div>
                <div className="text-rose-400/60 pb-1">
                  <HexagramVisual lines={fateData.iching.transformedLines} size="sm" />
                </div>
              </div>
              <div className="text-xs font-mono text-rose-500/80 mb-3 tracking-widest relative z-10">
                今日戰術：{fateData.iching.transformedData.strategy}
              </div>
              <p className="text-rose-100/80 text-sm tracking-wide leading-relaxed border-t border-rose-500/20 pt-3 relative z-10 line-clamp-2">
                {(fateData.iching.transformedData as any).decisionAdvice || (fateData.iching.transformedData as any).hshBusinessAdvice}
              </p>
              {fateData.iching.warning && (
                <div className="mt-2 w-2 h-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)] rounded-full animate-ping absolute bottom-4 right-4 z-10"></div>
              )}
              <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition-colors duration-500"></div>
            </div>

          </div>
        )}




        {/* Footer */}
        <footer className="mt-24 pb-12 text-center text-xs text-indigo-500/40 tracking-[0.3em]">
          <p>本系統僅供命理建模參考，天命終歸本心。</p>
        </footer>
      </div>

      {/* Sealed Popup Modal */}
      {sealPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in bg-black/80 backdrop-blur-sm">
          <div className="bg-[#05050a] border border-indigo-500/40 p-8 max-w-md w-full relative shadow-[0_0_40px_rgba(79,70,229,0.2)]">
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-indigo-400/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-indigo-400/50 m-2"></div>
            
            <button 
              onClick={() => setSealPopup(false)}
              className="absolute top-4 right-4 text-indigo-400/60 hover:text-indigo-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <Lock className="w-12 h-12 text-indigo-400 mb-6 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
              <h3 className="text-xl font-bold text-indigo-200 mb-4 tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)]">
                緣分未至
              </h3>
              <p className="text-indigo-300/80 tracking-widest leading-relaxed text-sm">
                此功能正由命理架構師加速部署中。<br/><br/>
                目前系統專注於「八字架構」與「姓名學」的權威性驗算，請靜候後續開放。
              </p>
              
              <button 
                onClick={() => setSealPopup(false)}
                className="mt-8 px-8 py-3 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/60 hover:border-indigo-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                確認返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sabian Deep Dive Modal */}
      {sabianPopup && fateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in bg-black/80 backdrop-blur-md">
          <div className="bg-[#05050f] border border-blue-500/40 p-8 max-w-lg w-full relative shadow-[0_0_60px_rgba(59,130,246,0.2)] overflow-hidden">
            {/* Background Spinning Zodiac Ring */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <SunDim className="w-[180%] h-[180%] text-blue-400 animate-spin" style={{ animationDuration: '60s' }} />
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-blue-400/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-400/50 m-2"></div>
            
            <button 
              onClick={() => setSabianPopup(false)}
              className="absolute top-4 right-4 text-blue-400/60 hover:text-blue-300 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4 relative z-10">
              <Sparkles className="w-10 h-10 text-blue-400 mb-4 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
              <h3 className="text-xl font-bold text-blue-200 mb-3 tracking-[0.2em] font-[family-name:var(--font-noto-serif-tc)]">
                {fateData.astrology.data.title}
              </h3>
              <div className="text-sm font-bold tracking-widest text-blue-400/80 mb-6 border border-blue-500/30 px-4 py-1 bg-blue-900/20">
                太陽經緯：{fateData.astrology.sabian}
              </div>
              
              <div className="text-left space-y-5 w-full">
                <div>
                  <h4 className="text-xs tracking-[0.3em] text-blue-500/80 mb-2 border-b border-blue-500/20 pb-1">深層意義</h4>
                  <p className="text-blue-100/90 tracking-wide leading-relaxed text-sm">
                    {fateData.astrology.data.deepMeaning}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs tracking-[0.3em] text-blue-500/80 mb-2 border-b border-blue-500/20 pb-1">靈魂進化建議</h4>
                  <p className="text-blue-200 tracking-wide leading-relaxed text-sm font-bold">
                    {fateData.astrology.data.advice}
                  </p>
                </div>
                {fateData.astrology.warning && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-sm">
                    <p className="text-red-300 tracking-wide text-xs leading-relaxed font-bold">
                      {fateData.astrology.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSabianPopup(false)}
                className="mt-8 px-8 py-3 bg-blue-900/40 border border-blue-500/30 text-blue-300 hover:bg-blue-800/60 hover:border-blue-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                收攏星象
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarot Deep Dive Modal */}
      {tarotPopup && fateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in bg-black/85 backdrop-blur-md">
          <div className="bg-[#0a0500] border border-amber-500/40 p-8 max-w-lg w-full relative shadow-[0_0_60px_rgba(245,158,11,0.15)] overflow-hidden">
            {/* Background Abstract Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Moon className="w-96 h-96 text-amber-500" />
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-500/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-500/50 m-2"></div>
            
            <button 
              onClick={() => setTarotPopup(false)}
              className="absolute top-4 right-4 text-amber-500/60 hover:text-amber-400 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4 relative z-10 font-[family-name:var(--font-noto-serif-tc)]">
              <div className="text-amber-500 mb-2 tracking-[0.3em] text-xs font-sans">TAROT SOUL NUMBER</div>
              <h3 className="text-3xl font-black text-amber-400 mb-2 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                {fateData.tarot.data.archetype}
              </h3>
              <div className="text-xs font-bold tracking-widest text-amber-600/80 mb-6 border-b border-amber-500/20 pb-2 px-8">
                靈魂原型解碼
              </div>
              
              <div className="text-left space-y-6 w-full">
                <div className="bg-amber-900/10 p-4 border border-amber-500/10">
                  <h4 className="text-xs font-sans tracking-[0.3em] text-amber-500/80 mb-2">天賦強項 (POWER)</h4>
                  <p className="text-amber-100/90 tracking-wide leading-relaxed text-sm">
                    {fateData.tarot.data.power}
                  </p>
                </div>
                
                <div className="bg-red-950/20 p-4 border border-red-500/20 border-l-2 border-l-red-500 shadow-[inset_0_0_15px_rgba(220,38,38,0.05)]">
                  <h4 className="text-xs font-sans tracking-[0.3em] text-red-400/90 mb-2 flex items-center">
                    <span className="mr-2">⚔️</span> 情緒盲點 (SHADOW)
                  </h4>
                  <p className="text-red-200/90 tracking-wide leading-relaxed text-sm font-medium">
                    {fateData.tarot.data.shadow}
                  </p>
                </div>
                
                <div className="bg-indigo-950/20 p-4 border border-indigo-500/20">
                  <h4 className="text-xs font-sans tracking-[0.3em] text-indigo-400/80 mb-2">靈魂進化建議 (MISSION)</h4>
                  <p className="text-indigo-200 tracking-wide leading-relaxed text-sm font-bold">
                    {fateData.tarot.data.mission}
                  </p>
                </div>

                {fateData.tarot.warning && (
                  <div className="mt-4 p-3 bg-orange-950/40 border border-orange-500/30 rounded-sm flex items-start">
                    <p className="text-orange-300 tracking-wide text-xs leading-relaxed font-bold">
                      {fateData.tarot.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setTarotPopup(false)}
                className="mt-8 px-8 py-3 bg-amber-900/20 border border-amber-500/30 text-amber-500 hover:bg-amber-900/40 hover:border-amber-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                收攏牌面
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Human Design Modal */}
      {hdPopup && fateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in bg-black/85 backdrop-blur-md">
          <div className="bg-[#000a0a] border border-cyan-500/40 p-8 max-w-lg w-full relative shadow-[0_0_60px_rgba(34,211,238,0.15)] overflow-hidden">
            {/* Background Abstract Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Activity className="w-96 h-96 text-cyan-500" />
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/50 m-2"></div>
            
            <button 
              onClick={() => setHdPopup(false)}
              className="absolute top-4 right-4 text-cyan-500/60 hover:text-cyan-400 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4 relative z-10 font-[family-name:var(--font-noto-serif-tc)]">
              <div className="text-cyan-500 mb-2 tracking-[0.3em] text-xs font-sans">HUMAN DESIGN DEBUG LOG</div>
              <h3 className="text-3xl font-black text-cyan-400 mb-2 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                {fateData.humanDesign.typeData.type}
              </h3>
              <div className="text-xs font-bold tracking-widest text-cyan-600/80 mb-6 border-b border-cyan-500/20 pb-2 px-8">
                {fateData.humanDesign.profileData.profile}
              </div>
              
              <div className="text-left space-y-4 w-full">
                {/* 1. Strategy & Signature */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cyan-900/10 p-3 border border-cyan-500/10">
                    <h4 className="text-[10px] font-sans tracking-[0.2em] text-cyan-500/80 mb-1">人生策略 (STRATEGY)</h4>
                    <p className="text-cyan-100/90 tracking-wide text-sm font-bold">
                      {fateData.humanDesign.typeData.strategy}
                    </p>
                  </div>
                  <div className="bg-cyan-900/10 p-3 border border-cyan-500/10">
                    <h4 className="text-[10px] font-sans tracking-[0.2em] text-cyan-500/80 mb-1">成功標籤 (SIGNATURE)</h4>
                    <p className="text-cyan-100/90 tracking-wide text-sm font-bold">
                      {fateData.humanDesign.typeData.signature}
                    </p>
                  </div>
                </div>

                {/* 2. Profile Desc */}
                <div className="bg-cyan-900/10 p-4 border border-cyan-500/20">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-cyan-400/80 mb-2">角色特質 (PROFILE)</h4>
                  <p className="text-cyan-200/90 tracking-wide leading-relaxed text-sm">
                    {fateData.humanDesign.profileData.desc}
                  </p>
                </div>
                
                {/* 3. Not-Self (Red accent for error) */}
                <div className="bg-red-950/20 p-4 border border-red-500/20 border-l-2 border-l-red-500 shadow-[inset_0_0_15px_rgba(220,38,38,0.05)]">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-red-400/90 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span> 非我主題 (NOT-SELF)
                  </h4>
                  <p className="text-red-200/90 tracking-wide leading-relaxed text-sm font-medium">
                    {fateData.humanDesign.typeData.notSelf}
                  </p>
                </div>
                
                {/* 4. Environment Vibe */}
                <div className="bg-indigo-950/20 p-4 border border-indigo-500/20">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-indigo-400/80 mb-2">環境共振建議 (ENVIRONMENT VIBE)</h4>
                  <p className="text-indigo-200 tracking-wide leading-relaxed text-sm">
                    {(fateData.humanDesign.typeData as any).environmentVibe || (fateData.humanDesign.typeData as any).spaceDeploy}
                  </p>
                </div>

                {/* 5. Resonance Warning */}
                {fateData.humanDesign.warning && (
                  <div className="mt-2 p-3 bg-orange-950/40 border border-orange-500/30 rounded-sm flex items-start">
                    <p className="text-orange-300 tracking-wide text-xs leading-relaxed font-bold">
                      {fateData.humanDesign.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setHdPopup(false)}
                className="mt-6 px-8 py-3 bg-cyan-900/20 border border-cyan-500/30 text-cyan-500 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                關閉除錯紀錄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IChing Deep Dive Modal */}
      {ichingPopup && fateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0505] border border-rose-500/40 p-8 max-w-lg w-full relative shadow-[0_0_60px_rgba(244,63,94,0.2)] overflow-hidden">
            {/* Background Spinning Taiji */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <div className="text-[300px] leading-none animate-spin" style={{ animationDuration: '60s' }}>☯</div>
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-rose-400/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-rose-400/50 m-2"></div>
            
            <button 
              onClick={() => setIchingPopup(false)}
              className="absolute top-4 right-4 text-rose-400/60 hover:text-rose-300 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Hexagon className="w-8 h-8 text-rose-500 mr-3 opacity-80" />
                <h3 className="text-2xl font-black text-rose-200 tracking-[0.3em] font-[family-name:var(--font-noto-serif-tc)] drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  【梅花易數】
                </h3>
              </div>

              <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-rose-400/60 text-xs mb-2 tracking-widest">本卦</span>
                  <div className="text-rose-500/80">
                    <HexagramVisual lines={fateData.iching.originalLines} size="lg" />
                  </div>
                  <span className="text-rose-200 text-lg font-bold mt-2 font-[family-name:var(--font-noto-serif-tc)]">{fateData.iching.hexagram}</span>
                </div>
                
                <div className="flex flex-col items-center text-rose-500/50 pt-4">
                  <span className="text-[10px] tracking-widest mb-1 bg-rose-950/40 px-2 py-0.5 rounded-sm">動爻: {fateData.iching.changingLine}</span>
                  <div className="w-16 border-t border-dashed border-rose-500/40 relative">
                    <div className="absolute -right-1 -top-1.5 border-t-[6px] border-b-[6px] border-l-[8px] border-y-transparent border-l-rose-500/40"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-rose-400/60 text-xs mb-2 tracking-widest">變卦</span>
                  <div className="text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]">
                    <HexagramVisual lines={fateData.iching.transformedLines} size="lg" />
                  </div>
                  <span className="text-rose-200 text-lg font-bold mt-2 font-[family-name:var(--font-noto-serif-tc)] drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">{fateData.iching.transformedHexagram}</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Strategy */}
                <div className="bg-rose-950/20 p-4 border border-rose-500/20 border-l-2 border-l-rose-500 shadow-[inset_0_0_15px_rgba(225,29,72,0.05)]">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-rose-400/90 mb-2 flex items-center">
                    <span className="mr-2">🎯</span> 今日戰術 (STRATEGY)
                  </h4>
                  <p className="text-rose-100/90 tracking-wide leading-relaxed text-sm font-bold">
                    {fateData.iching.transformedData.strategy}
                  </p>
                </div>
                
                {/* Warning */}
                <div className="bg-rose-950/20 p-4 border border-rose-500/20 border-l-2 border-l-rose-700 shadow-[inset_0_0_15px_rgba(225,29,72,0.05)]">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-rose-500 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span> 風險提示 (WARNING)
                  </h4>
                  <p className="text-rose-200/90 tracking-wide leading-relaxed text-sm">
                    {fateData.iching.transformedData.warning}
                  </p>
                </div>
                
                {/* 3. Decision Advice */}
                <div className="bg-rose-950/10 p-4 border border-rose-500/10">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-rose-400/60 mb-2">決策戰略建議 (DECISION STRATEGY)</h4>
                  <p className="text-rose-200/80 tracking-wide leading-relaxed text-sm">
                    {(fateData.iching.transformedData as any).decisionAdvice || (fateData.iching.transformedData as any).hshBusinessAdvice}
                  </p>
                </div>

                {/* Resonance Warning */}
                {fateData.iching.warning && (
                  <div className="mt-2 p-3 bg-rose-950/60 border border-rose-500/50 rounded-sm flex items-start animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                    <p className="text-rose-200 tracking-wide text-xs leading-relaxed font-bold">
                      {fateData.iching.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIchingPopup(false)}
                className="mt-6 px-8 py-3 bg-rose-900/20 border border-rose-500/30 text-rose-500 hover:bg-rose-900/40 hover:border-rose-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                關閉戰術面板
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
      {/* Zi Wei Dou Shu Modal */}
      {ziweiPopup && fateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#050510] border border-indigo-500/40 p-8 max-w-lg w-full relative shadow-[0_0_80px_rgba(99,102,241,0.2)] overflow-hidden animate-scale-up">
            {/* Spinning Twelve Houses Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none" style={{ animation: 'spin 120s linear infinite' }}>
              <div className="w-[600px] h-[600px] border-[1px] border-indigo-400 rounded-full flex items-center justify-center relative">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="absolute w-[600px] h-[1px] bg-indigo-400" style={{ transform: `rotate(${i * 30}deg)` }}></div>
                ))}
                <div className="w-[300px] h-[300px] border-[1px] border-indigo-400 rounded-full absolute"></div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-indigo-500/50 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-indigo-500/50 m-2"></div>
            
            <button 
              onClick={() => setZiweiPopup(false)}
              className="absolute top-4 right-4 text-indigo-500/60 hover:text-indigo-400 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4 relative z-10 font-[family-name:var(--font-noto-serif-tc)]">
              <div className="text-indigo-500 mb-2 tracking-[0.3em] text-xs font-sans">ZI WEI DOU SHU MATRIX</div>
              <h3 className="text-4xl font-black text-indigo-300 mb-2 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(165,180,252,0.6)]">
                {fateData.ziwei.star}
              </h3>
              <div className="text-sm font-bold tracking-widest text-indigo-400/80 mb-6 border-b border-indigo-500/20 pb-2 px-8">
                命宮位置：{fateData.ziwei.mingGongZhi}
              </div>
              
              <div className="text-left space-y-4 w-full">
                {/* 1. Destiny Vibe */}
                <div className="bg-indigo-950/20 p-4 border border-indigo-500/20">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-indigo-400/80 mb-2">命格氣場 (DESTINY VIBE)</h4>
                  <p className="text-indigo-200 tracking-wide leading-relaxed text-sm font-bold">
                    {fateData.ziwei.data.destinyVibe}
                  </p>
                </div>

                {/* 2. Core Strength */}
                <div className="bg-indigo-950/20 p-4 border border-indigo-500/20">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-indigo-400/80 mb-2">核心競爭力 (CORE STRENGTH)</h4>
                  <p className="text-indigo-100/90 tracking-wide leading-relaxed text-sm">
                    {fateData.ziwei.data.coreStrength}
                  </p>
                </div>
                
                {/* 3. Life Challenge */}
                <div className="bg-rose-950/20 p-4 border border-rose-500/30 border-l-2 border-l-rose-500 shadow-[inset_0_0_15px_rgba(225,29,72,0.05)]">
                  <h4 className="text-[10px] font-sans tracking-[0.2em] text-rose-400/90 mb-2 flex items-center">
                    <span className="mr-2">⚔️</span> 人生絆腳石 (LIFE CHALLENGE)
                  </h4>
                  <p className="text-rose-200/90 tracking-wide leading-relaxed text-sm font-medium">
                    {fateData.ziwei.data.lifeChallenge}
                  </p>
                </div>

                {/* 4. Resonance Warning */}
                {fateData.ziwei.warning && (
                  <div className="mt-2 p-3 bg-red-950/60 border border-red-500/50 rounded-sm flex items-start animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)] relative">
                    <div className="absolute inset-0 border border-red-500/30 animate-ping rounded-sm"></div>
                    <p className="text-red-200 tracking-wide text-sm leading-relaxed font-bold relative z-10">
                      {fateData.ziwei.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setZiweiPopup(false)}
                className="mt-6 px-8 py-3 bg-indigo-900/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/40 hover:border-indigo-400 transition-all text-sm tracking-widest font-bold w-full"
              >
                收攏星盤
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
