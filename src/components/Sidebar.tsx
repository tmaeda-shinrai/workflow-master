import { NavLink } from 'react-router-dom';
import {
    CalendarDays,
    BarChart3,
    Tags,
    Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/utils';
import { CategoryDialog } from './CategoryDialog';

export function Sidebar() {
    const { categories } = useCategoryStore();

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <img src="/vite.svg" alt="Logo" className="w-6 h-6" /> {/* Placeholder logo */}
                    <div>
                        <h1 className="text-xl font-bold leading-none">WorkFlow</h1>
                    </div>
                </div>
            </div>

            <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-2 mt-2 mb-1">
                    NAVEGAÇÃO
                </div>

                <NavLink
                    to="/calendar"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                >
                    <CalendarDays className="w-4 h-4" />
                    Calendário
                </NavLink>

                <NavLink
                    to="/stats"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                >
                    <BarChart3 className="w-4 h-4" />
                    Estatísticas
                </NavLink>

                <div className="mt-8 flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Tags className="w-3 h-3" />
                        CATEGORIAS
                    </div>
                    <CategoryDialog>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-600">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </CategoryDialog>
                </div>

                <div className="space-y-1 mt-1">
                    {categories.map((cat) => (
                        <div key={cat.id} className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50 relative">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-sm text-foreground truncate flex-1">{cat.name}</span>

                            <CategoryDialog category={cat}>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1">
                                    <div className="w-1 h-1 bg-foreground/50 rounded-full" />
                                    <div className="w-1 h-1 bg-foreground/50 rounded-full mx-0.5" />
                                    <div className="w-1 h-1 bg-foreground/50 rounded-full" />
                                </Button>
                            </CategoryDialog>
                        </div>
                    ))}
                </div>
            </nav>

        </aside>
    );
}
