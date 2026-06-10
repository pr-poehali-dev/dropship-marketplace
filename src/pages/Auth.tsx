import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Screen = "main" | "email-login" | "email-register" | "phone" | "success";

interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  provider: string;
  phone?: string;
}

const PROVIDERS = [
  {
    id: "google",
    label: "Войти через Google",
    icon: "🔵",
    color: "bg-white dark:bg-zinc-800 border border-border hover:bg-gray-50 dark:hover:bg-zinc-700 text-foreground",
    user: { name: "Александр Петров", email: "alex.petrov@gmail.com", avatar: "А", provider: "Google" },
  },
  {
    id: "facebook",
    label: "Войти через Facebook",
    icon: "📘",
    color: "bg-[#1877F2] hover:bg-[#166FE5] text-white border-transparent",
    user: { name: "Мария Сидорова", email: "maria.sidorova@fb.com", avatar: "М", provider: "Facebook" },
  },
  {
    id: "instagram",
    label: "Войти через Instagram",
    icon: "📸",
    color: "bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white border-transparent",
    user: { name: "Ирина Коваль", email: "irina.koval@ig.com", avatar: "И", provider: "Instagram" },
  },
];

export default function Auth() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("main");
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const simulateLoading = (cb: () => void) => {
    setLoading(true);
    setError("");
    setTimeout(() => { setLoading(false); cb(); }, 1200);
  };

  const handleProvider = (provider: typeof PROVIDERS[0]) => {
    simulateLoading(() => {
      setPendingUser(provider.user);
      setScreen("phone");
    });
  };

  const handleEmailLogin = () => {
    if (!email || !password) { setError("Заполните все поля"); return; }
    simulateLoading(() => {
      if (password.length < 6) { setError("Неверный пароль"); setLoading(false); return; }
      setPendingUser({ name: email.split("@")[0], email, avatar: email[0].toUpperCase(), provider: "Email" });
      setScreen("phone");
    });
  };

  const handleEmailRegister = () => {
    if (!name || !email || !password) { setError("Заполните все поля"); return; }
    if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
    simulateLoading(() => {
      setPendingUser({ name, email, avatar: name[0].toUpperCase(), provider: "Email" });
      setScreen("phone");
    });
  };

  const handleSendCode = () => {
    if (!phone || phone.length < 10) { setError("Введите корректный номер"); return; }
    setCodeSent(true);
    setError("");
  };

  const handleVerifyCode = () => {
    if (phoneCode.length < 4) { setError("Введите код из SMS"); return; }
    simulateLoading(() => {
      const user = { ...pendingUser!, phone };
      localStorage.setItem("tradehub_user", JSON.stringify(user));
      setScreen("success");
      setTimeout(() => navigate("/"), 1800);
    });
  };

  const handleSkipPhone = () => {
    localStorage.setItem("tradehub_user", JSON.stringify(pendingUser));
    setScreen("success");
    setTimeout(() => navigate("/"), 1800);
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 gradient-hero p-10 text-white">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="ShoppingBag" size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>TradeHub</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Торгуй без ограничений
          </h2>
          <p className="text-white/75 text-sm leading-relaxed">
            Профессиональная платформа для дропшипперов — выставляй тысячи товаров, принимай оплату от любого банка, управляй заказами.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[["120K+", "Товаров"], ["8K+", "Продавцов"], ["2M+", "Заказов"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>{n}</div>
              <div className="text-white/60 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Back button */}
          {screen !== "main" && screen !== "success" && (
            <button
              onClick={() => { setScreen("main"); setError(""); setCodeSent(false); setPhoneCode(""); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
          )}

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="ShoppingBag" size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>TradeHub</span>
          </div>

          {/* ── MAIN ── */}
          {screen === "main" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Войти или создать аккаунт</h1>
              <p className="text-sm text-muted-foreground mb-7">Выберите удобный способ входа</p>

              <div className="space-y-3 mb-6">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProvider(p)}
                    disabled={loading}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${p.color} ${loading ? "opacity-60" : ""}`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    {p.label}
                    {loading && <Icon name="Loader2" size={15} className="ml-auto animate-spin" />}
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground">или через email</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10 text-sm" onClick={() => setScreen("email-login")}>
                  <Icon name="LogIn" size={15} className="mr-1.5" /> Войти
                </Button>
                <Button className="h-10 text-sm" onClick={() => setScreen("email-register")}>
                  <Icon name="UserPlus" size={15} className="mr-1.5" /> Регистрация
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Регистрируясь, вы принимаете{" "}
                <span className="text-primary cursor-pointer hover:underline">Условия использования</span>
              </p>
            </>
          )}

          {/* ── EMAIL LOGIN ── */}
          {screen === "email-login" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Вход по email</h1>
              <p className="text-sm text-muted-foreground mb-7">Введите ваши данные</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="h-10" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Пароль</label>
                  <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" className="h-10" />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button className="w-full h-10 font-semibold" onClick={handleEmailLogin} disabled={loading}>
                  {loading ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="LogIn" size={16} className="mr-2" />}
                  Войти
                </Button>
                <button onClick={() => setScreen("email-register")} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
                  Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
                </button>
              </div>
            </>
          )}

          {/* ── EMAIL REGISTER ── */}
          {screen === "email-register" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Создать аккаунт</h1>
              <p className="text-sm text-muted-foreground mb-7">Заполните данные для регистрации</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Имя и фамилия</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" className="h-10" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="h-10" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Пароль (мин. 6 символов)</label>
                  <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" className="h-10" />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button className="w-full h-10 font-semibold" onClick={handleEmailRegister} disabled={loading}>
                  {loading ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="UserPlus" size={16} className="mr-2" />}
                  Создать аккаунт
                </Button>
                <button onClick={() => setScreen("email-login")} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
                  Уже есть аккаунт? <span className="text-primary">Войти</span>
                </button>
              </div>
            </>
          )}

          {/* ── PHONE ── */}
          {screen === "phone" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Привязка телефона</h1>
              <p className="text-sm text-muted-foreground mb-1">
                Аккаунт: <span className="font-medium text-foreground">{pendingUser?.name}</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-secondary rounded-full">{pendingUser?.provider}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">Номер нужен для безопасности и восстановления доступа</p>

              <div className="space-y-3">
                {!codeSent ? (
                  <>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Номер телефона</label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-secondary border border-border rounded-lg text-sm font-medium flex-shrink-0">
                          🇺🇦 +380
                        </div>
                        <Input
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="XX XXX XX XX"
                          className="h-10"
                          maxLength={9}
                        />
                      </div>
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button className="w-full h-10 font-semibold" onClick={handleSendCode}>
                      <Icon name="MessageSquare" size={15} className="mr-2" />
                      Отправить SMS-код
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-400">
                      ✓ Код отправлен на +380{phone}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Код из SMS</label>
                      <Input
                        value={phoneCode}
                        onChange={e => setPhoneCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="0000"
                        className="h-10 text-center text-xl tracking-widest"
                        maxLength={4}
                      />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button className="w-full h-10 font-semibold" onClick={handleVerifyCode} disabled={loading}>
                      {loading ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="CheckCircle" size={16} className="mr-2" />}
                      Подтвердить
                    </Button>
                  </>
                )}

                <button onClick={handleSkipPhone} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center pt-1">
                  Пропустить — добавить позже
                </button>
              </div>
            </>
          )}

          {/* ── SUCCESS ── */}
          {screen === "success" && (
            <div className="text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle2" size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Добро пожаловать!
              </h1>
              <p className="text-sm text-muted-foreground">
                {pendingUser?.name}, вы вошли через {pendingUser?.provider}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Перенаправляем на маркетплейс...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
