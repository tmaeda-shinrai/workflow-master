import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export interface RoutineEntry {
    id: string;
    entry_date: string; // YYYY-MM-DD
    time_slot: string;
    category_id: string;
    user_id?: string;
}

interface RoutineState {
    entries: RoutineEntry[];
    loading: boolean;
    fetchEntries: (startDate: Date, endDate: Date) => Promise<void>;
    addEntry: (entry: Omit<RoutineEntry, 'id'>) => Promise<void>;
    removeEntry: (date: string, timeSlot: string) => Promise<void>;
    updateEntry: (id: string, categoryId: string) => Promise<void>;
    getEntry: (date: string, timeSlot: string) => RoutineEntry | undefined;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
    entries: [],
    loading: false,
    fetchEntries: async (startDate, endDate) => {
        set({ loading: true });

        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('routine_entries')
            .select('*')
            .gte('entry_date', startStr)
            .lte('entry_date', endStr);

        if (error) {
            console.error('Erro ao buscar rotina:', error);
        } else {
            set({ entries: data || [] });
        }
        set({ loading: false });
    },
    addEntry: async (entry) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check availability locally first
        const existing = get().entries.find(
            e => e.entry_date === entry.entry_date && e.time_slot === entry.time_slot
        );

        if (existing) {
            // Update existing
            get().updateEntry(existing.id, entry.category_id);
        } else {
            // Insert new
            const tempId = crypto.randomUUID();
            const newEntry = { ...entry, id: tempId, user_id: user.id };

            set((state) => ({ entries: [...state.entries, newEntry] }));

            const { data, error } = await supabase
                .from('routine_entries')
                .insert([{
                    entry_date: entry.entry_date,
                    time_slot: entry.time_slot,
                    category_id: entry.category_id,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) {
                console.error('Erro ao adicionar entrada:', error);
                alert(`Erro ao salvar: ${error.message}`);
                set((state) => ({ entries: state.entries.filter(e => e.id !== tempId) }));
            } else if (data) {
                set((state) => ({
                    entries: state.entries.map(e => e.id === tempId ? data : e)
                }));
            }
        }
    },
    removeEntry: async (date, timeSlot) => {
        const entry = get().entries.find(e => e.entry_date === date && e.time_slot === timeSlot);
        if (!entry) return;

        set((state) => ({
            entries: state.entries.filter(e => e.id !== entry.id)
        }));

        const { error } = await supabase
            .from('routine_entries')
            .delete()
            .eq('id', entry.id);

        if (error) {
            console.error('Erro ao remover entrada:', error);
            alert(`Erro ao remover: ${error.message}`);
            // Revert mechanism could be improved here, but fetchEntries is safer
        }
    },
    updateEntry: async (id, categoryId) => {
        set((state) => ({
            entries: state.entries.map(e => e.id === id ? { ...e, category_id: categoryId } : e)
        }));

        const { error } = await supabase
            .from('routine_entries')
            .update({ category_id: categoryId })
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar entrada:', error);
            alert(`Erro ao atualizar: ${error.message}`);
        }
    },
    getEntry: (date, timeSlot) =>
        get().entries.find(e => e.entry_date === date && e.time_slot === timeSlot)
}));
