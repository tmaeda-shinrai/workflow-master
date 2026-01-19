import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useCategoryStore } from '@/store/categoryStore';
import { useRoutineStore } from '@/store/routineStore';

export default function DashboardLayout() {
    const { fetchCategories } = useCategoryStore();
    const { fetchEntries } = useRoutineStore();

    useEffect(() => {
        fetchCategories();
        // Fetch a broad range or current view. For simplicity, let's fetch current month +/- 1 month, or a fix range.
        // Ideally this should be dynamic based on CalendarPage view, but since layout is higher up, 
        // let's fetch a reasonable default range (e.g., this year) and let CalendarPage refetch if needed?
        // Actually, CalendarPage manages the date state. 
        // Maybe we should move fetchEntries to CalendarPage?
        // But StatsPage needs it too.
        // Fetch current year +/- 1 year to cover adjacent interactions and immediate history
        const start = new Date(new Date().getFullYear() - 1, 0, 1); // Start of previous year
        const end = new Date(new Date().getFullYear() + 1, 11, 31); // End of next year
        fetchEntries(start, end);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50/50 dark:bg-zinc-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="h-full p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
