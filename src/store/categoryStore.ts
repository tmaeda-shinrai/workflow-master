import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Category {
    id: string;
    name: string;
    color: string;
    user_id?: string;
}

interface CategoryState {
    categories: Category[];
    loading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loading: false,
    fetchCategories: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar categorias:', error);
        } else {
            set({ categories: data || [] });
        }
        set({ loading: false });
    },
    addCategory: async (category) => {
        // Optimistic update
        const tempId = crypto.randomUUID();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const newCategory = { ...category, id: tempId, user_id: user.id };

        set((state) => ({ categories: [...state.categories, newCategory] }));

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: category.name, color: category.color, user_id: user.id }])
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar categoria:', error);
            // Rollback
            set((state) => ({ categories: state.categories.filter(c => c.id !== tempId) }));
        } else if (data) {
            // Replace temp ID with real ID
            set((state) => ({
                categories: state.categories.map(c => c.id === tempId ? data : c)
            }));
        }
    },
    updateCategory: async (id, updates) => {
        set((state) => ({
            categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        }));

        const { error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar categoria:', error);
            // Could implement rollback here by refetching or keeping previous state
            get().fetchCategories();
        }
    },
    removeCategory: async (id) => {
        const previous = get().categories;
        set((state) => ({
            categories: state.categories.filter(c => c.id !== id)
        }));

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao remover categoria:', error);
            set({ categories: previous });
        }
    },
}));
