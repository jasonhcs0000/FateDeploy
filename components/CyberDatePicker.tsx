import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, addYears, subYears, setYear, setMonth, getDaysInMonth, startOfMonth, getDay, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CyberDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  className?: string;
  themeColor?: 'indigo' | 'red';
}

export const CyberDatePicker: React.FC<CyberDatePickerProps> = ({ value, onChange, className, themeColor = 'indigo' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [currentMonth, setCurrentMonth] = useState(parseISO(value || new Date().toISOString().split('T')[0]));
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const currentYear = currentMonth.getFullYear();
  const startDecadeYear = Math.floor(currentYear / 10) * 10;
  const decadeYears = Array.from({ length: 12 }, (_, i) => startDecadeYear - 1 + i);
  const monthsList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (view === 'days') setCurrentMonth(subMonths(currentMonth, 1));
    else if (view === 'months') setCurrentMonth(subYears(currentMonth, 1));
    else if (view === 'years') setCurrentMonth(subYears(currentMonth, 10));
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (view === 'days') setCurrentMonth(addMonths(currentMonth, 1));
    else if (view === 'months') setCurrentMonth(addYears(currentMonth, 1));
    else if (view === 'years') setCurrentMonth(addYears(currentMonth, 10));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    onChange(format(today, 'yyyy-MM-dd'));
    setCurrentMonth(today);
    setIsOpen(false);
  };

  const openPicker = () => {
    if (!isOpen) setView('days');
    setIsOpen(!isOpen);
  };

  const activeDateObj = parseISO(value);

  const isRed = themeColor === 'red';
  const shadowColor = isRed ? 'shadow-[inset_0_0_20px_rgba(153,27,27,0.2)]' : 'shadow-[inset_0_0_20px_rgba(79,70,229,0.2)]';
  const ringColor = isRed ? 'focus:ring-red-500' : 'focus:ring-indigo-400';
  const borderColor = isRed ? 'border-red-900/40' : 'border-indigo-500/40';
  const textColor = isRed ? 'text-red-300' : 'text-yellow-300';
  
  return (
    <div className="relative" ref={popoverRef}>
      {/* Native Input Field for Mobile */}
      <div className={`md:hidden relative flex items-center justify-between min-w-full bg-black/60 border rounded-sm outline-none focus-within:ring-2 ${ringColor} ${shadowColor} ${borderColor} ${textColor} transition-all font-mono ${className}`}>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-xl outline-none appearance-none color-scheme-dark"
        />
      </div>

      {/* Custom Input Field for Desktop */}
      <button 
        type="button"
        onClick={openPicker}
        className={`hidden md:flex items-center justify-between min-w-[220px] bg-black/60 border rounded-sm px-6 py-4 text-2xl outline-none focus:ring-2 ${ringColor} ${shadowColor} ${borderColor} ${textColor} transition-all font-mono tracking-[0.1em] ${className}`}
      >
        <span>{value}</span>
        <Calendar className={`w-6 h-6 ml-4 flex-shrink-0 ${isRed ? 'text-red-500/60' : 'text-indigo-500/60'}`} />
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-4 left-1/2 -translate-x-1/2 w-80 bg-black/80 backdrop-blur-md border border-indigo-500/30 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-4">
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.8\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")' }}></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className={`flex justify-between items-center mb-6 ${isRed ? 'text-red-200' : 'text-indigo-200'}`}>
              <button type="button" onClick={handlePrev} className="p-1 hover:text-purple-400 hover:bg-white/5 rounded transition-colors"><ChevronLeft size={24} /></button>
              
              <div className="flex items-center gap-2 text-xl font-bold tracking-widest font-[family-name:var(--font-noto-serif-tc)]">
                
                {view === 'days' && (
                  <>
                    <button type="button" onClick={() => setView('years')} className="hover:text-purple-300 hover:bg-white/5 rounded px-2 py-1 transition-colors" title="切換至年份選擇">
                      {format(currentMonth, 'yyyy')} 年
                    </button>
                    <button type="button" onClick={() => setView('months')} className="hover:text-purple-300 hover:bg-white/5 rounded px-2 py-1 transition-colors" title="切換至月份選擇">
                      {format(currentMonth, 'MM')} 月
                    </button>
                  </>
                )}

                {view === 'months' && (
                  <button type="button" onClick={() => setView('years')} className="hover:text-purple-300 hover:bg-white/5 rounded px-2 py-1 transition-colors" title="切換至年份選擇">
                    {format(currentMonth, 'yyyy')} 年
                  </button>
                )}

                {view === 'years' && (
                  <div className="px-2 py-1 tracking-widest">
                    {startDecadeYear} - {startDecadeYear + 9}
                  </div>
                )}

              </div>

              <button type="button" onClick={handleNext} className="p-1 hover:text-purple-400 hover:bg-white/5 rounded transition-colors"><ChevronRight size={24} /></button>
            </div>

            {/* Days Grid */}
            {view === 'days' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-bold py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = isSameDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), activeDateObj);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className={`
                          h-10 w-full flex items-center justify-center rounded-sm text-sm font-mono transition-all duration-500
                          ${isSelected 
                            ? `bg-purple-600/90 text-white shadow-[0_0_20px_rgba(147,51,234,0.9)] animate-pulse border border-purple-400` 
                            : `text-gray-300 hover:bg-indigo-900/50 hover:text-indigo-200 border border-transparent`}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Months Grid */}
            {view === 'months' && (
              <div className="grid grid-cols-3 gap-3 mb-4 h-[240px] items-center">
                {monthsList.map((m, i) => {
                  const isCurrentMonth = currentMonth.getMonth() === i;
                  return (
                    <button
                      key={m} type="button"
                      onClick={() => {
                        setCurrentMonth(setMonth(currentMonth, i));
                        setView('days');
                      }}
                      className={`h-12 w-full flex items-center justify-center rounded-sm text-sm font-[family-name:var(--font-noto-serif-tc)] tracking-widest transition-all duration-300 ${isCurrentMonth ? 'text-purple-300 border border-purple-500/50 bg-purple-900/20' : 'text-gray-300 hover:bg-indigo-900/50 hover:text-indigo-200 border border-transparent'}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years Grid */}
            {view === 'years' && (
              <div className="grid grid-cols-3 gap-3 mb-4 h-[240px] items-center">
                {decadeYears.map((y) => {
                  const isOut = y < startDecadeYear || y > startDecadeYear + 9;
                  return (
                    <button
                      key={y} type="button"
                      onClick={() => {
                        setCurrentMonth(setYear(currentMonth, y));
                        setView('months');
                      }}
                      className={`h-12 w-full flex items-center justify-center rounded-sm text-base font-mono transition-all duration-300 ${y === currentYear ? 'text-purple-300 border border-purple-500/50 bg-purple-900/20' : 'text-gray-300 hover:bg-indigo-900/50 hover:text-indigo-200 border border-transparent'} ${isOut ? 'opacity-30' : ''}`}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-white/10 font-[family-name:var(--font-noto-serif-tc)] text-sm">
              <button 
                type="button" 
                onClick={setToday}
                className="px-4 py-2 text-indigo-300 hover:text-purple-300 hover:bg-indigo-900/30 rounded transition-colors tracking-widest"
              >
                [ 定位當下 ]
              </button>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors tracking-widest"
              >
                [ 重啟部署 ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
