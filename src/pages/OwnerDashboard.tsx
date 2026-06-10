import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type UserRole = "owner" | "admin" | "moderator" | "seller";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  since: string;
}

const ROLE_LABELS: Record<UserRole, { label: string; color: string; bg: string }> = {
  owner:     { label: "Владелец",   color: "text-amber-700 dark:text-amber-400",  bg: "bg-amber-100 dark:bg-amber-900/30" },
  admin:     { label: "Админ",      color: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-100 dark:bg-blue-900/30" },
  moderator: { label: "Модератор",  color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  seller:    { label: "Продавец",   color: "text-green-700 dark:text-green-400",  bg: "bg-green-100 dark:bg-green-900/30" },
};

const INITIAL_STAFF: StaffMember[] = [
  { id: 1, name: "Вы (владелец)", email: "owner@tradehub.com", role: "owner", active: true, since: "01.01.2024" },
  { id: 2, name: "Сергей Андреев", email: "s.andreev@tradehub.com", role: "admin", active: true, since: "15.02.2024" },
  { id: 3, name: "Наталья Ким", email: "n.kim@tradehub.com", role: "moderator", active: true, since: "10.03.2024" },
  { id: 4, name: "Роман Ковалев", email: "r.kovalev@tradehub.com", role: "moderator", active: false, since: "22.04.2024" },
];

const PLATFORM_FEATURES = [
  { id: "dropship", label: "Дропшиппинг", desc: "Продавцы могут выставлять товары без склада", enabled: true },
  { id: "reviews", label: "Отзывы и рейтинги", desc: "Покупатели оставляют отзывы на товары", enabled: true },
  { id: "chat", label: "Чат продавец–покупатель", desc: "Встроенный мессенджер для переговоров", enabled: false },
  { id: "auction", label: "Аукционы", desc: "Продажа товаров через торги", enabled: false },
  { id: "promo", label: "Промокоды", desc: "Скидочные купоны для покупателей", enabled: true },
  { id: "analytics", label: "Расширенная аналитика", desc: "Детальные отчёты для продавцов", enabled: false },
  { id: "api", label: "Публичный API", desc: "Доступ к данным платформы по API", enabled: false },
  { id: "multistore", label: "Мультимагазин", desc: "Один продавец — несколько витрин", enabled: false },
];

const TABS = ["Обзор", "Финансы", "Пользователи", "Функции платформы", "Модерация"] as const;
type Tab = typeof TABS[number];

const PENDING_PRODUCTS = [
  { id: 1, name: "iPhone 16 Pro Max", seller: "TechStore", price: 89900, submitted: "10.06.2024" },
  { id: 2, name: "Платье вечернее", seller: "FashionLux", price: 3200, submitted: "10.06.2024" },
  { id: 3, name: "Велотренажёр X500", seller: "SportLife", price: 14500, submitted: "09.06.2024" },
];

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Обзор");
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [features, setFeatures] = useState(PLATFORM_FEATURES);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "moderator" as UserRole });
  const [pendingProducts, setPendingProducts] = useState(PENDING_PRODUCTS);
  const [depositOpen, setDepositOpen] = useState(false);
  const [balance, setBalance] = useState(284500);
  const [depositAmount, setDepositAmount] = useState("");

  const toggleFeature = (id: string) => {
    setFeatures(f => f.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const toggleStaff = (id: number) => {
    setStaff(s => s.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const changeRole = (id: number, role: UserRole) => {
    setStaff(s => s.map(m => m.id === id ? { ...m, role } : m));
  };

  const removeStaff = (id: number) => {
    setStaff(s => s.filter(m => m.id !== id));
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setStaff(s => [...s, {
      id: Date.now(), name: newUser.name, email: newUser.email,
      role: newUser.role, active: true, since: new Date().toLocaleDateString("ru")
    }]);
    setNewUser({ name: "", email: "", role: "moderator" });
    setAddUserOpen(false);
  };

  const handleDeposit = () => {
    const amt = parseInt(depositAmount);
    if (amt > 0) { setBalance(b => b + amt); setDepositAmount(""); setDepositOpen(false); }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Header */}
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
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
                <Icon name="Crown" size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                Панель владельца
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted-foreground">Баланс платформы</div>
              <div className="font-bold text-sm text-amber-600 dark:text-amber-400">₴{balance.toLocaleString("ru")}</div>
            </div>
            <button
              onClick={() => setDepositOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Icon name="Plus" size={13} />
              Пополнить
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-secondary p-1 rounded-xl overflow-x-auto w-fit max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
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
                { label: "Баланс платформы", value: `₴${balance.toLocaleString("ru")}`, icon: "Landmark", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
                { label: "Оборот (месяц)", value: "₴1.2M", icon: "BarChart3", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
                { label: "Продавцов", value: "8 412", icon: "Store", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: "Активных товаров", value: "124K", icon: "Package", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4 card-hover">
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon name={stat.icon as "Landmark"} size={18} className={stat.color} />
                  </div>
                  <div className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Быстрые действия</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: "UserPlus", label: "Добавить сотрудника", action: () => { setActiveTab("Пользователи"); setAddUserOpen(true); } },
                  { icon: "Zap", label: "Включить функцию", action: () => setActiveTab("Функции платформы") },
                  { icon: "ShieldCheck", label: "Модерация товаров", action: () => setActiveTab("Модерация") },
                  { icon: "PlusCircle", label: "Пополнить баланс", action: () => setDepositOpen(true) },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary/40 hover:bg-secondary/50 transition-all card-hover"
                  >
                    <Icon name={a.icon as "Zap"} size={22} className="text-primary" />
                    <span className="text-xs font-medium text-muted-foreground leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Staff overview */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Команда ({staff.length})</h2>
                <button onClick={() => setActiveTab("Пользователи")} className="text-xs text-primary hover:underline">Управление →</button>
              </div>
              <div className="divide-y divide-border">
                {staff.slice(0, 4).map((m) => (
                  <div key={m.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ROLE_LABELS[m.role].bg} ${ROLE_LABELS[m.role].color}`}>
                      {ROLE_LABELS[m.role].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FINANCES ── */}
        {activeTab === "Финансы" && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Финансы платформы</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Баланс платформы", value: `₴${balance.toLocaleString("ru")}`, sub: "Доступно к использованию", icon: "Landmark" },
                { label: "Оборот за месяц", value: "₴1 248 000", sub: "+18% к прошлому месяцу", icon: "TrendingUp" },
                { label: "Комиссия платформы", value: "₴62 400", sub: "5% от оборота", icon: "Percent" },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl border border-border p-5">
                  <Icon name={item.icon as "Landmark"} size={20} className="text-amber-500 mb-3" />
                  <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-semibold">Пополнение баланса</h3>
              <div className="grid sm:grid-cols-3 gap-2">
                {[5000, 10000, 50000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setBalance(b => b + amt); }}
                    className="p-3 rounded-lg border border-border hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-semibold transition-all"
                  >
                    +₴{amt.toLocaleString("ru")}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Другая сумма..."
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="h-9 text-sm flex-1"
                />
                <Button className="h-9 text-xs bg-amber-500 hover:bg-amber-400 text-white" onClick={handleDeposit}>
                  Пополнить
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">История транзакций</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { desc: "Комиссия с продаж", amount: "+₴12 400", date: "10.06.2024", type: "income" },
                  { desc: "Выплата продавцу TechDrop", amount: "-₴24 990", date: "09.06.2024", type: "expense" },
                  { desc: "Комиссия с продаж", amount: "+₴8 900", date: "08.06.2024", type: "income" },
                  { desc: "Выплата продавцу FashionHub", amount: "-₴4 500", date: "07.06.2024", type: "expense" },
                ].map((t, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{t.desc}</div>
                      <div className="text-xs text-muted-foreground">{t.date}</div>
                    </div>
                    <span className={`font-bold text-sm ${t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "Пользователи" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Команда и роли ({staff.length})
              </h2>
              <Button size="sm" className="gap-1 text-xs bg-primary" onClick={() => setAddUserOpen(true)}>
                <Icon name="UserPlus" size={13} /> Добавить
              </Button>
            </div>

            <div className="grid gap-3">
              {staff.map((member) => (
                <div key={member.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email} · с {member.since}</div>
                  </div>

                  {member.role !== "owner" ? (
                    <Select
                      value={member.role}
                      onValueChange={(v) => changeRole(member.id, v as UserRole)}
                    >
                      <SelectTrigger className={`h-7 w-32 text-xs border-0 ${ROLE_LABELS[member.role].bg} ${ROLE_LABELS[member.role].color}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">👑 Админ</SelectItem>
                        <SelectItem value="moderator">🛡 Модератор</SelectItem>
                        <SelectItem value="seller">🏪 Продавец</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${ROLE_LABELS.owner.bg} ${ROLE_LABELS.owner.color}`}>
                      👑 Владелец
                    </span>
                  )}

                  {member.role !== "owner" && (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={member.active}
                        onCheckedChange={() => toggleStaff(member.id)}
                      />
                      <button
                        onClick={() => removeStaff(member.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FEATURES ── */}
        {activeTab === "Функции платформы" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Функции платформы</h2>
            <p className="text-sm text-muted-foreground">Включайте и отключайте возможности для всех пользователей</p>
            <div className="grid gap-3">
              {features.map((feat) => (
                <div key={feat.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 transition-colors ${feat.enabled ? "bg-green-500" : "bg-border"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{feat.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{feat.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${feat.enabled ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {feat.enabled ? "Вкл" : "Выкл"}
                    </span>
                    <Switch checked={feat.enabled} onCheckedChange={() => toggleFeature(feat.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODERATION ── */}
        {activeTab === "Модерация" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                На модерации ({pendingProducts.length})
              </h2>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Icon name="CheckCircle2" size={48} className="mx-auto mb-3 opacity-30" />
                <p>Очередь на модерацию пуста</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pendingProducts.map((p) => (
                  <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon name="Package" size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.seller} · ₴{p.price.toLocaleString("ru")} · {p.submitted}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setPendingProducts(pp => pp.filter(x => x.id !== p.id))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-white text-xs font-semibold transition-colors"
                      >
                        <Icon name="Check" size={12} /> Одобрить
                      </button>
                      <button
                        onClick={() => setPendingProducts(pp => pp.filter(x => x.id !== p.id))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors"
                      >
                        <Icon name="X" size={12} /> Отклонить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD USER MODAL */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">Добавить сотрудника</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Имя</label>
              <Input value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} placeholder="Имя и фамилия" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} placeholder="email@example.com" type="email" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Роль</label>
              <Select value={newUser.role} onValueChange={v => setNewUser(u => ({ ...u, role: v as UserRole }))}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Администратор</SelectItem>
                  <SelectItem value="moderator">🛡 Модератор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full font-semibold mt-2" onClick={addUser}>
              <Icon name="UserPlus" size={15} className="mr-2" />
              Добавить в команду
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DEPOSIT MODAL */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">Пополнение баланса</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <div className="text-xs text-amber-700 dark:text-amber-400 mb-1">Текущий баланс</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                ₴{balance.toLocaleString("ru")}
              </div>
            </div>
            <Input
              placeholder="Сумма пополнения"
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              className="h-10 text-sm"
            />
            <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold" onClick={handleDeposit}>
              <Icon name="Plus" size={15} className="mr-2" />
              Пополнить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
