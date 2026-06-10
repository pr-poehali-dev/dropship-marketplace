import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ImportMethod = "url" | "csv" | "json" | "xml" | "manual";
type ImportStatus = "idle" | "parsing" | "preview" | "importing" | "done" | "error";

interface ParsedProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  stock: number;
  selected: boolean;
}

const MOCK_PARSED: ParsedProduct[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: ["Смартфон Samsung Galaxy", "Кроссовки Nike Air Max", "Ноутбук Lenovo IdeaPad", "Куртка зимняя мужская", "Наушники Sony WH", "Велосипед горный Trek", "Кресло игровое RGB", "Платье летнее женское", "Видеокарта RTX 4070", "Сумка кожаная через плечо", "Кофемашина DeLonghi", "Тренажёр беговая дорожка"][i % 12] + ` ${i + 1}`,
  price: Math.round((Math.random() * 50000 + 500) / 10) * 10,
  category: ["Электроника", "Одежда и обувь", "Спорт", "Мебель", "Авто", "Красота"][i % 6],
  description: "Товар высокого качества, сертифицирован, доставка по всей стране.",
  image: [
    "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/ccaf294e-5f92-4448-af5a-02a3d1ea689b.jpg",
    "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/b9a6c46f-185d-4896-a545-e53aa4068039.jpg",
    "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
  ][i % 3],
  stock: Math.floor(Math.random() * 100 + 1),
  selected: true,
}));

const FORMAT_EXAMPLES = {
  csv: `name,price,category,description,stock
"Смартфон Samsung A54",12990,"Электроника","128GB, 6GB RAM",50
"Кроссовки Nike Air",3499,"Одежда и обувь","Размеры 36-46",120
"Ноутбук Lenovo i5",34990,"Электроника","15.6 дюймов SSD 256GB",25`,
  json: `[
  {
    "name": "Смартфон Samsung A54",
    "price": 12990,
    "category": "Электроника",
    "description": "128GB, 6GB RAM",
    "stock": 50
  },
  {
    "name": "Кроссовки Nike Air",
    "price": 3499,
    "category": "Одежда и обувь",
    "stock": 120
  }
]`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <name>Смартфон Samsung A54</name>
    <price>12990</price>
    <category>Электроника</category>
    <stock>50</stock>
  </product>
  <product>
    <name>Кроссовки Nike Air</name>
    <price>3499</price>
    <category>Одежда и обувь</category>
    <stock>120</stock>
  </product>
</products>`,
};

export default function BulkImport() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<ImportMethod>("url");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [url, setUrl] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [progress, setProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [showExample, setShowExample] = useState<"csv" | "json" | "xml" | null>(null);

  const selectedCount = products.filter(p => p.selected).length;

  const simulateParse = () => {
    setStatus("parsing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setProducts(MOCK_PARSED);
          setStatus("preview");
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 120);
  };

  const handleImport = () => {
    setStatus("importing");
    setProgress(0);
    const total = selectedCount;
    let done = 0;
    const interval = setInterval(() => {
      done += Math.ceil(Math.random() * 8);
      const pct = Math.min((done / total) * 100, 100);
      setProgress(pct);
      setImportedCount(Math.min(done, total));
      if (pct >= 100) {
        clearInterval(interval);
        setImportedCount(total);
        setStatus("done");
      }
    }, 80);
  };

  const toggleAll = (val: boolean) => setProducts(p => p.map(x => ({ ...x, selected: val })));
  const toggleOne = (id: number) => setProducts(p => p.map(x => x.id === id ? { ...x, selected: !x.selected } : x));

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFileContent(ev.target?.result as string);
    reader.readAsText(file);
  };

  const METHODS: { id: ImportMethod; icon: string; label: string; desc: string }[] = [
    { id: "url", icon: "Link", label: "Ссылка на каталог", desc: "Prom, Rozetka, OLX, AliExpress" },
    { id: "csv", icon: "Table2", label: "CSV файл", desc: "Excel, Google Sheets" },
    { id: "json", icon: "Braces", label: "JSON", desc: "API, выгрузки из CRM" },
    { id: "xml", icon: "FileCode2", label: "XML / YML", desc: "Яндекс.Маркет, прайс-листы" },
    { id: "manual", icon: "ClipboardList", label: "Вставить текст", desc: "Скопировать из таблицы" },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm hidden sm:block">На маркетплейс</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Upload" size={14} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
              Массовый импорт товаров
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── IDLE / METHOD SELECT ── */}
        {(status === "idle" || status === "error") && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Загрузить товары
              </h1>
              <p className="text-sm text-muted-foreground">Импортируй до 10 000 товаров за один раз из любого источника</p>
            </div>

            {/* Method select */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all
                    ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <Icon name={m.icon as "Link"} size={20} className={method === m.id ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-xs font-semibold mt-2">{m.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* URL input */}
            {method === "url" && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-1">Ссылка на каталог или магазин</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Вставьте ссылку на каталог товаров — мы автоматически считаем все позиции
                  </p>
                  <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://prom.ua/catalog/... или любой другой магазин"
                    className="h-10 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["prom.ua", "rozetka.com.ua", "olx.ua", "aliexpress.com", "amazon.com"].map(src => (
                    <button
                      key={src}
                      onClick={() => setUrl(`https://${src}/catalog/electronics`)}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
                    >
                      {src}
                    </button>
                  ))}
                </div>
                <Button
                  className="h-10 font-semibold w-full sm:w-auto"
                  onClick={simulateParse}
                  disabled={!url}
                >
                  <Icon name="Search" size={15} className="mr-2" />
                  Считать товары по ссылке
                </Button>
              </div>
            )}

            {/* CSV */}
            {method === "csv" && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-1">CSV файл</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Загрузите файл .csv — обязательные колонки: <code className="bg-secondary px-1 rounded">name, price</code>
                  </p>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Icon name="Upload" size={28} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Перетащите файл или нажмите для выбора</p>
                    <p className="text-xs text-muted-foreground mt-1">Поддерживается .csv, .tsv</p>
                    <input ref={fileRef} type="file" accept=".csv,.tsv" className="hidden" onChange={handleFileRead} />
                  </div>
                  {fileContent && <p className="text-xs text-green-600 dark:text-green-400">✓ Файл загружен</p>}
                </div>
                <button
                  onClick={() => setShowExample(showExample === "csv" ? null : "csv")}
                  className="text-xs text-primary hover:underline"
                >
                  {showExample === "csv" ? "Скрыть пример" : "Показать пример формата"}
                </button>
                {showExample === "csv" && (
                  <pre className="bg-secondary rounded-lg p-3 text-xs overflow-x-auto">{FORMAT_EXAMPLES.csv}</pre>
                )}
                <Button className="h-10 font-semibold w-full sm:w-auto" onClick={simulateParse} disabled={!fileContent}>
                  <Icon name="Table2" size={15} className="mr-2" />
                  Загрузить CSV
                </Button>
              </div>
            )}

            {/* JSON */}
            {method === "json" && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm mb-1">JSON</h3>
                <p className="text-xs text-muted-foreground">Вставьте JSON-массив товаров или загрузите файл</p>
                <textarea
                  rows={8}
                  value={fileContent}
                  onChange={e => setFileContent(e.target.value)}
                  placeholder={FORMAT_EXAMPLES.json}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={() => setShowExample(showExample === "json" ? null : "json")}
                  className="text-xs text-primary hover:underline"
                >
                  {showExample === "json" ? "Скрыть пример" : "Показать пример формата"}
                </button>
                {showExample === "json" && (
                  <pre className="bg-secondary rounded-lg p-3 text-xs overflow-x-auto">{FORMAT_EXAMPLES.json}</pre>
                )}
                <Button className="h-10 font-semibold w-full sm:w-auto" onClick={simulateParse} disabled={!fileContent}>
                  <Icon name="Braces" size={15} className="mr-2" />
                  Обработать JSON
                </Button>
              </div>
            )}

            {/* XML */}
            {method === "xml" && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm mb-1">XML / YML (Яндекс.Маркет)</h3>
                <p className="text-xs text-muted-foreground">Загрузите XML файл или вставьте содержимое</p>
                <textarea
                  rows={8}
                  value={fileContent}
                  onChange={e => setFileContent(e.target.value)}
                  placeholder={FORMAT_EXAMPLES.xml}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={() => setShowExample(showExample === "xml" ? null : "xml")}
                  className="text-xs text-primary hover:underline"
                >
                  {showExample === "xml" ? "Скрыть пример" : "Показать пример формата"}
                </button>
                {showExample === "xml" && (
                  <pre className="bg-secondary rounded-lg p-3 text-xs overflow-x-auto">{FORMAT_EXAMPLES.xml}</pre>
                )}
                <Button className="h-10 font-semibold w-full sm:w-auto" onClick={simulateParse} disabled={!fileContent}>
                  <Icon name="FileCode2" size={15} className="mr-2" />
                  Обработать XML
                </Button>
              </div>
            )}

            {/* Manual paste */}
            {method === "manual" && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm mb-1">Вставить из таблицы</h3>
                <p className="text-xs text-muted-foreground">Скопируйте строки из Excel или Google Sheets и вставьте сюда. Первая строка — заголовки.</p>
                <textarea
                  rows={10}
                  value={fileContent}
                  onChange={e => setFileContent(e.target.value)}
                  placeholder={"name\tprice\tcategory\nСмартфон Samsung\t12990\tЭлектроника\nКроссовки Nike\t3499\tОдежда"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button className="h-10 font-semibold w-full sm:w-auto" onClick={simulateParse} disabled={!fileContent}>
                  <Icon name="ClipboardList" size={15} className="mr-2" />
                  Распознать товары
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── PARSING ── */}
        {status === "parsing" && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Обрабатываем данные...</h2>
            <p className="text-sm text-muted-foreground mb-6">Читаем товары, проверяем форматы, извлекаем данные</p>
            <div className="w-64 bg-secondary rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {status === "preview" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Найдено {products.length} товаров
                </h2>
                <p className="text-xs text-muted-foreground">Выберите товары для размещения на маркетплейсе</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">Выбрано: {selectedCount}</span>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toggleAll(true)}>Все</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toggleAll(false)}>Снять</Button>
                <Button
                  className="h-9 text-sm font-semibold gap-1.5"
                  disabled={selectedCount === 0}
                  onClick={handleImport}
                >
                  <Icon name="Upload" size={15} />
                  Разместить {selectedCount}
                </Button>
              </div>
            </div>

            <div className="grid gap-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => toggleOne(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${p.selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${p.selected ? "bg-primary border-primary" : "border-border"}`}
                  >
                    {p.selected && <Icon name="Check" size={12} className="text-primary-foreground" />}
                  </div>
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.category} · {p.description}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-sm">₴{p.price.toLocaleString("ru")}</div>
                    <div className="text-xs text-muted-foreground">{p.stock} шт.</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-4 flex justify-center">
              <Button
                className="h-11 px-8 text-sm font-semibold shadow-lg gap-2"
                disabled={selectedCount === 0}
                onClick={handleImport}
              >
                <Icon name="Rocket" size={16} />
                Разместить {selectedCount} товаров
              </Button>
            </div>
          </div>
        )}

        {/* ── IMPORTING ── */}
        {status === "importing" && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Размещаем товары...</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Обработано: <span className="font-semibold text-foreground">{importedCount}</span> из <span className="font-semibold">{selectedCount}</span>
            </p>
            <div className="w-72 bg-secondary rounded-full h-3 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>
        )}

        {/* ── DONE ── */}
        {status === "done" && (
          <div className="flex flex-col items-center justify-center py-20 animate-scale-in text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
              <Icon name="CheckCircle2" size={40} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Готово! {importedCount} товаров размещено
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Все товары добавлены в ваш магазин и видны покупателям
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button onClick={() => navigate("/seller")} className="gap-1.5 font-semibold">
                <Icon name="Store" size={15} />
                Мои товары
              </Button>
              <Button variant="outline" onClick={() => { setStatus("idle"); setUrl(""); setFileContent(""); setProducts([]); }} className="gap-1.5">
                <Icon name="RefreshCw" size={15} />
                Импортировать ещё
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="gap-1.5">
                <Icon name="Home" size={15} />
                На маркетплейс
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}