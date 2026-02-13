'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface CalendarProps {
    onSelect: (date: Date, time: string) => void;
}

export function Calendar({ onSelect }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1);
    const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

    const handleSelect = (day: number, time: string) => {
        const date = new Date(2026, 1, day); // Feb 2026
        setSelectedDate(day);
        setSelectedTime(time);
        onSelect(date, time);
    };

    return (
        <div className="bg-white border border-border rounded-4xl p-8 shadow-sm space-y-10">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold tracking-tight">Select Date & Time</h3>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-50 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-black uppercase tracking-widest px-4">February 2026</span>
                    <button className="p-2 bg-slate-50 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground py-2">{day}</div>
                ))}
                {currentMonthDays.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-2xl flex items-center justify-center font-bold text-sm transition-all border ${selectedDate === day ? 'bg-primary text-primary-foreground border-primary shadow-saas' : 'bg-slate-50 text-slate-600 border-transparent hover:border-border hover:bg-white'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {selectedDate && (
                <div className="space-y-6 pt-6 border-t border-border border-dashed animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Available Slots</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => handleSelect(selectedDate, time)}
                                className={`py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedTime === time ? 'bg-primary text-primary-foreground border-primary shadow-saas' : 'bg-white text-slate-600 border-border hover:border-primary hover:text-primary'}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
