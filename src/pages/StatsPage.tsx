import { useMemo, useState } from 'react';
import { useRoutineStore } from '@/store/routineStore';
import { useCategoryStore } from '@/store/categoryStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, TrendingUp, BarChart as BarChartIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function StatsPage() {
    const { entries } = useRoutineStore();
    const { categories } = useCategoryStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    const currentMonthStr = format(currentDate, 'yyyy-MM'); // Filter by selected month

    const stats = useMemo(() => {
        // Calculate total hours per category
        const categoryHours: Record<string, number> = {};
        let totalHours = 0;

        entries.forEach(entry => {
            if (!entry.category_id) return;
            // Filter by the selected month stored in currentDate
            if (!entry.entry_date.startsWith(currentMonthStr)) return;

            categoryHours[entry.category_id] = (categoryHours[entry.category_id] || 0) + 0.5; // 30 min slots
            totalHours += 0.5;
        });

        // Format data for charts
        const chartData = Object.entries(categoryHours)
            .map(([categoryId, hours]) => {
                const category = categories.find(c => c.id === categoryId);
                return {
                    name: category?.name || 'Desconhecido',
                    hours: hours,
                    color: category?.color || '#cbd5e1'
                };
            })
            .sort((a, b) => b.hours - a.hours);

        // Calculate most frequent and active categories based on the filtered chartData
        const mostFrequent = chartData.length > 0 ? chartData[0].name : '-';
        const activeCategoriesCount = chartData.length;

        return {
            totalHours,
            chartData,
            mostFrequent,
            activeCategoriesCount
        };
    }, [entries, categories, currentMonthStr]);

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Estatísticas</h2>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-1 rounded-md shadow-sm border">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>&lt;</Button>
                    <span className="text-sm font-medium w-32 text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth}>&gt;</Button>
                </div>
            </div>

            {/* KFC Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-blue-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="p-2 bg-white/20 rounded-lg w-fit mb-4">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-4xl font-bold mb-1">{stats.totalHours}h</div>
                                <div className="text-sm text-blue-100">Tempo acumulado</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg w-fit mb-4">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-bold mb-1">{stats.mostFrequent}</div>
                                <div className="text-sm text-muted-foreground">Maior foco do mês</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg w-fit mb-4">
                                    <BarChartIcon className="w-5 h-5" />
                                </div>
                                <div className="text-4xl font-bold mb-1">{stats.activeCategoriesCount}</div>
                                <div className="text-sm text-muted-foreground">Tipos de tarefas realizadas</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Bar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <BarChartIcon className="w-4 h-4 text-blue-500" />
                            Carga por Atividade (Horas)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={20}>
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-purple-500" />
                            Distribuição Mensal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="hours"
                                    >
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function PieChartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    )
}
