import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TimeSlot } from '@/components/Calendar/TimeSlot';
import { cn } from "@/lib/utils"; // Assuming cn utility is available

const TIME_SLOTS = Array.from({ length: 22 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7; // Start at 07:00
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
}).slice(1); // Start 07:30

// e.g. ["07:30", "08:00", ..., "18:00"] expanded to match design (~22 slots)

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get Monday of the current week
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday

    // Arrays for header
    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    const formattedRange = `${format(weekDays[0], 'dd MMM', { locale: ptBR })} - ${format(weekDays[4], 'dd MMM', { locale: ptBR })}`.toUpperCase();

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Minha Rotina</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevWeek}>&lt;</Button>
                    <span className="font-medium min-w-[150px] text-center">{formattedRange}</span>
                    <Button variant="outline" size="icon" onClick={handleNextWeek}>&gt;</Button>
                    <Button variant="outline" onClick={handleToday}>HOJE</Button>
                </div>
            </div>

            <div className="border rounded-xl bg-card flex-1 flex flex-col overflow-hidden shadow-sm">
                {/* Header Row - Added pr-3 to compensate scrollbar width */}
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] border-b border-border bg-slate-50/50 dark:bg-zinc-900/50 pr-3">
                    <div className="p-4 text-xs font-semibold text-muted-foreground flex items-center justify-center border-r">
                        HORA
                    </div>
                    {weekDays.map((date, i) => (
                        <div key={i} className="p-4 text-center border-r last:border-r-0">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">
                                {format(date, 'eee', { locale: ptBR })}
                            </div>
                            <div className={cn("text-xl font-bold", isSameDay(date, new Date()) && "text-blue-600")}>
                                {format(date, 'd')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scrollable Grid */}
                <div className="overflow-y-auto flex-1">
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr]">
                        {/* Time Column */}
                        <div className="border-r border-border bg-slate-50/30">
                            {TIME_SLOTS.map((time) => (
                                <div key={time} className="h-12 flex items-center justify-center text-xs text-muted-foreground font-medium border-b border-border/50">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {weekDays.map((date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            return (
                                <div key={dateStr} className="border-r border-border last:border-r-0">
                                    {TIME_SLOTS.map((time) => (
                                        <TimeSlot
                                            key={`${dateStr}-${time}`}
                                            dateLabel={dateStr}
                                            timeLabel={time}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
