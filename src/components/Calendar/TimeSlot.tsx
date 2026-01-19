import { useState } from 'react';
import { useRoutineStore } from '@/store/routineStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TimeSlotProps {
    dateLabel: string; // "2024-01-19"
    timeLabel: string; // "07:30"
}

export function TimeSlot({ dateLabel, timeLabel }: TimeSlotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { getEntry, addEntry, removeEntry } = useRoutineStore();
    const { categories } = useCategoryStore();

    const entry = getEntry(dateLabel, timeLabel);
    const category = entry ? categories.find(c => c.id === entry.category_id) : null;

    const handleSelectCategory = (categoryId: string) => {
        addEntry({
            entry_date: dateLabel,
            time_slot: timeLabel,
            category_id: categoryId,
        });
        setIsOpen(false);
    };

    const handleRemoveCategory = () => {
        removeEntry(dateLabel, timeLabel);
        setIsOpen(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "h-12 border-b border-r border-border/50 text-xs p-1 transition-all hover:bg-slate-50 cursor-pointer relative group",
                        category ? "bg-opacity-20 hover:bg-opacity-30" : "bg-transparent"
                    )}
                    style={category ? { backgroundColor: `${category.color}20` } : {}}
                >
                    {category && (
                        <div className="w-full h-full rounded-sm border-l-2 pl-2 flex items-center" style={{ borderColor: category.color }}>
                            <span className="font-semibold truncate" style={{ color: category.color }}>{category.name}</span>
                        </div>
                    )}

                    {!category && (
                        <div className="hidden group-hover:flex items-center justify-center h-full text-slate-300">
                            +
                        </div>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-popover" align="start">
                <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground px-2 pb-2">
                        Selecionar Atividade
                    </div>
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-secondary cursor-pointer",
                                entry?.category_id === cat.id && "bg-secondary"
                            )}
                        >
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-sm flex-1">{cat.name}</span>
                            {entry?.category_id === cat.id && <Check className="w-3 h-3" />}
                        </div>
                    ))}
                    <div
                        onClick={handleRemoveCategory}
                        className="text-xs text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-sm cursor-pointer mt-2 border-t pt-2"
                    >
                        Remover Atividade
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
