import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SELLER_PRODUCTS = [
  { id: 1, name: "Смартфон Pro Max 14", price: 24990, stock: 12, sales: 48, status: "active", image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/ccaf294e-5f92-4448-af5a-02a3d1ea689b.jpg" },
  { id: 2, name: "Кожаная куртка мужская", price: 4500, stock: 5, sales: 22, status: "active", image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/b9a6c46f-185d-4896-a545-e53aa4068039.jpg" },
  { id: 3, name: "Наушники Wireless Pro", price: 3200, stock: 0, sales: 67, status: "out", image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg" },
  { id: 4, name: "Кресло офисное ErgoMax", price: 12900, stock: 3, sales: 11, status: "active", image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg" },
];

const ORDERS = [
  { id: "#TH-8821", product: "Смартфон Pro Max 14", buyer: "Алексей К.", amount: 24990, date: "09.06.2024", status: "delivered" },
  { id: "#TH-8820", product: "Кожаная куртка", buyer: "Мария В.", amount: 4500, date: "09.06.2024", status: "shipping" },
  { id: "#TH-8815", product: "Смартфон Pro Max 14", buyer: "Дмитрий Р.", amount: 24990, date: "08.06.2024", status: "delivered" },
  { id: "#TH-8810", product: "Кресло ErgoMax", buyer: "Ольга Н.", amount: 12900, date: "07.06.2024", status: "processing" },
  { id: "#TH-8804", product: "Кожаная куртка", buyer: "Иван С.", amount: 4500, date: "06.06.2024", status: "delivered" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  delivered: { label: "Доставлен", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  shipping: { label: "В пути", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  processing: { label: "Обрабатывается", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const TABS = ["Обзор", "Мои товары", "Заказы", "Финансы"] as const;
type Tab = typeof TABS[number];

const CATEGORY_ICONS = ["📱", "👗", "🚗", "🏠", "⚽", "💄", "👶", "🛋️", "🍕", "🐾", "🎨", "📚", "📦"];
const CATEGORIES = ["Электроника", "Одежда и обувь", "Авто", "Дом и сад", "Спорт", "Красота и здоровье", "Детские товары", "Мебель", "Еда и напитки", "Животные", "Хобби", "Книги", "Другое"];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Обзор");
  const [addOpen, setAddOpen] = useState(false);

  const totalRevenue = ORDERS.filter(o => o.status === "delivered").reduce((s, o) => s + o.amount, 0);
  const pendingRevenue = ORDERS.filter(o => o.status === "shipping" || o.status === "processing").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={18} />
              <span className="text-sm hidden sm:block">На маркетплейс</span>
            </button>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Store" size={14} className="text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                Кабинет продавца
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">А</div>
              <span className="hidden sm:block font-medium">Алексей К.</span>
            </div>
            <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setAddOpen(true)}>
              <Icon name="Plus" size={13} />
              Добавить товар
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-secondary p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Обзор" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Выручка (всего)", value: `₴${totalRevenue.toLocaleString("ru")}`, icon: "TrendingUp", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
                { label: "Ожидается", value: `₴${pendingRevenue.toLocaleString("ru")}`, icon: "Clock", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
                { label: "Активных товаров", value: String(SELLER_PRODUCTS.filter(p => p.status === "active").length), icon: "Package", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: "Всего продаж", value: String(SELLER_PRODUCTS.reduce((s, p) => s + p.sales, 0)), icon: "ShoppingCart", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon name={stat.icon as any} size={18} className={stat.color} />
                  </div>
                  <div className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Последние заказы</h2>
                <button onClick={() => setActiveTab("Заказы")} className="text-xs text-primary hover:underline">Все заказы →</button>
              </div>
              <div className="divide-y divide-border">
                {ORDERS.slice(0, 3).map((order) => (
                  <div key={order.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{order.product}</div>
                      <div className="text-xs text-muted-foreground">{order.id} · {order.buyer} · {order.date}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-semibold text-sm">₴{order.amount.toLocaleString("ru")}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[order.status].color}`}>
                        {STATUS_LABELS[order.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === "Мои товары" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Мои товары ({SELLER_PRODUCTS.length})</h2>
              <Button size="sm" className="gap-1 text-xs" onClick={() => setAddOpen(true)}>
                <Icon name="Plus" size={13} /> Добавить
              </Button>
            </div>
            <div className="grid gap-3">
              {SELLER_PRODUCTS.map((p) => (
                <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <img src={p.image} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {p.sales} продаж · Остаток: {p.stock} шт.
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-sm">₴{p.price.toLocaleString("ru")}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block
                      ${p.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {p.status === "active" ? "Активен" : "Нет в наличии"}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                      <Icon name="Pencil" size={13} />
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "Заказы" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Все заказы</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {ORDERS.map((order) => (
                  <div key={order.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{order.product}</div>
                      <div className="text-xs text-muted-foreground">{order.id} · {order.buyer} · {order.date}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-bold text-sm">₴{order.amount.toLocaleString("ru")}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[order.status].color}`}>
                        {STATUS_LABELS[order.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FINANCES ── */}
        {activeTab === "Финансы" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Финансы</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Доступно к выводу", value: `₴${totalRevenue.toLocaleString("ru")}`, icon: "Wallet", positive: true },
                { label: "В обработке", value: `₴${pendingRevenue.toLocaleString("ru")}`, icon: "RefreshCw", positive: null },
                { label: "Выведено всего", value: "₴18 500", icon: "ArrowUpRight", positive: false },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl border border-border p-5">
                  <Icon name={item.icon as any} size={20} className="text-muted-foreground mb-3" />
                  <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-3 text-sm">Вывод средств</h3>
              <div className="flex gap-2">
                <Input placeholder="Сумма к выводу" className="h-9 text-sm flex-1" type="number" />
                <Button className="h-9 text-xs px-4">
                  <Icon name="ArrowUpRight" size={14} className="mr-1" />
                  Вывести
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Средства зачисляются на карту в течение 1-3 рабочих дней</p>
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">Добавить товар</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Название товара</label>
              <Input placeholder="Введите название..." className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c, i) => (
                    <SelectItem key={i} value={String(i)}>{CATEGORY_ICONS[i]} {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Цена (₴)</label>
                <Input placeholder="0" type="number" className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Остаток (шт.)</label>
                <Input placeholder="0" type="number" className="h-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Описание</label>
              <textarea rows={3} placeholder="Описание товара..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors">
              <Icon name="Upload" size={20} className="mx-auto mb-1 opacity-50" />
              Загрузить фото
            </div>
            <Button className="w-full font-semibold" onClick={() => setAddOpen(false)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Разместить товар
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
