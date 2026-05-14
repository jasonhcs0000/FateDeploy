"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Scale, Star, Activity, Moon, Crown, SunDim, Compass, BookOpen, Quote, Circle, Fingerprint, Database, Search, Lock, X } from 'lucide-react';
import { calculateFullFate, searchGoldenNodes } from '@/lib/fateLogic';

export default function Home() {
  const [conceptionDate, setConceptionDate] = useState('2026-05-20');
  const [mode, setMode] = useState<'deploy' | 'parse'>('deploy');
  const [birthHour, setBirthHour] = useState<number>(0);
  const [fateData, setFateData] = useState<ReturnType<typeof calculateFullFate>>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [matrixText, setMatrixText] = useState("");
  
  const [goldenNodes, setGoldenNodes] = useState<any[]>([]);
  const [isSearchingNodes, setIsSearchingNodes] = useState(false);
  
  const [sealPopup, setSealPopup] = useState(false);

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
        <div className={`bg-black/40 backdrop-blur-md p-10 mb-12 text-center max-w-2xl mx-auto border-x-4 border-double shadow-[0_0_40px_rgba(79,70,229,0.3)] relative overflow-hidden group transition-colors duration-1000 ${mode === 'parse' ? 'border-red-900/50 shadow-[0_0_40px_rgba(153,27,27,0.3)]' : 'border-indigo-500/50'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10">
            <label className={`block text-xl mb-6 font-bold tracking-[0.2em] flex items-center justify-center font-[family-name:var(--font-noto-serif-tc)] transition-colors duration-1000 ${mode === 'parse' ? 'text-red-200' : 'text-indigo-200'}`}>
              <Database className="w-5 h-5 mr-3 opacity-60" /> {mode === 'parse' ? '定位命元降臨時刻' : '定位靈魂初始化時間點'}
            </label>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="date"
                className={`bg-black/60 border rounded-sm px-6 py-4 text-2xl outline-none focus:ring-2 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)] transition-all font-mono tracking-[0.1em] ${mode === 'parse' ? 'text-red-300 border-red-900/40 focus:ring-red-500 shadow-[inset_0_0_20px_rgba(153,27,27,0.2)]' : 'text-yellow-300 border-indigo-500/40 focus:ring-indigo-400'}`}
                value={conceptionDate}
                onChange={(e) => setConceptionDate(e.target.value)}
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
            <SealedCard title="紫微矩陣" icon={Star} message="星象觀測中，紫微斗數天機尚在編譯..." />

            {/* 3. Human Design */}
            <SealedCard title="人類圖" icon={Activity} message="能量場域掃描中，生命設計圖尚未顯影..." />

            {/* 4. Tarot */}
            <SealedCard title="塔羅大運" icon={Moon} message="命運之輪轉動緩慢，未來牌陣待緣而開..." />

            {/* 5. Mayan Tzolkin */}
            <SealedCard title="瑪雅曆法" icon={Compass} message="時空維度交錯，星系印記等待對齊..." />

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
            <SealedCard title="薩比恩占星" icon={Sparkles} message="黃道能量微弱，度數象徵尚未浮現..." />

            {/* 8. I-Ching */}
            <SealedCard title="易經卦象" icon={Scale} message="因緣未具，此卦象暫不可見。" />

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
    </div>
  );
}
