import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCategoryStore, Category } from "@/store/categoryStore"
import { Trash2 } from "lucide-react"

interface CategoryDialogProps {
    children: React.ReactNode
    category?: Category
}

const PRESET_COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#eab308", // yellow
    "#84cc16", // lime
    "#22c55e", // green
    "#10b981", // emerald
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#0ea5e9", // sky
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#a855f7", // purple
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#f43f5e", // rose
    "#71717a", // zinc
];

export function CategoryDialog({ children, category }: CategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [color, setColor] = useState(PRESET_COLORS[0])
    const { addCategory, updateCategory, removeCategory } = useCategoryStore()

    useEffect(() => {
        if (category) {
            setName(category.name)
            setColor(category.color)
        } else {
            setName("")
            setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
        }
    }, [category, open])

    const handleSave = () => {
        if (!name.trim()) return

        if (category) {
            updateCategory(category.id, { name, color })
        } else {
            addCategory({ name, color })
        }
        setOpen(false)
    }

    const handleDelete = () => {
        if (category) {
            removeCategory(category.id)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{category ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="Ex: Trabalho, Estudo..."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Cor
                        </Label>
                        <div className="col-span-3 flex flex-wrap gap-2">
                            {PRESET_COLORS.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${color === c ? "border-black dark:border-white scale-110" : "border-transparent"}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between w-full">
                    {category ? (
                        <Button variant="destructive" size="icon" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    ) : <div />}
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
