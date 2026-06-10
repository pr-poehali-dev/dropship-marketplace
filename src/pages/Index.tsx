import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGS = {
  ru: {
    siteName: "TradeHub",
    tagline: "Маркетплейс для дропшипперов",
    search: "Поиск товаров...",
    allCategories: "Все категории",
    addProduct: "Разместить товар",
    buyNow: "Купить",
    moreInfo: "Подробнее",
    paymentTitle: "Способы оплаты",
    close: "Закрыть",
    pay: "Оплатить",
    enterAmount: "Введите сумму",
    selectBank: "Выберите банк",
    priceFrom: "от",
    inStock: "В наличии",
    dropship: "Дропшиппинг",
    hot: "Хит",
    newLabel: "Новинка",
    categories: ["Все", "Электроника", "Одежда и обувь", "Авто", "Дом и сад", "Спорт", "Красота и здоровье", "Детские товары", "Мебель", "Еда и напитки", "Животные", "Хобби", "Книги", "Другое"],
    sortBy: "Сортировка",
    sortOptions: ["По умолчанию", "Дешевле", "Дороже", "Новинки"],
    footer: "Все права защищены",
    heroTitle: "Торговая площадка нового поколения",
    heroSub: "Выставляйте товары, принимайте оплату от любого банка, находите покупателей",
    heroBtn: "Начать торговать",
    statsItems: "товаров", statsSellers: "продавцов", statsOrders: "заказов",
    nameLabel: "Название товара", catLabel: "Категория", priceLabel: "Цена", oldPriceLabel: "Старая цена",
    descLabel: "Описание", photoLabel: "Загрузить фото товара", submitLabel: "Разместить товар",
    namePlaceholder: "Введите название...", catPlaceholder: "Выберите категорию", descPlaceholder: "Описание товара...",
    notFound: "Ничего не найдено",
  },
  uk: {
    siteName: "TradeHub",
    tagline: "Маркетплейс для дропшиперів",
    search: "Пошук товарів...",
    allCategories: "Всі категорії",
    addProduct: "Розмістити товар",
    buyNow: "Купити",
    moreInfo: "Детальніше",
    paymentTitle: "Способи оплати",
    close: "Закрити",
    pay: "Оплатити",
    enterAmount: "Введіть суму",
    selectBank: "Оберіть банк",
    priceFrom: "від",
    inStock: "В наявності",
    dropship: "Дропшипінг",
    hot: "Хіт",
    newLabel: "Новинка",
    categories: ["Всі", "Електроніка", "Одяг та взуття", "Авто", "Дім і сад", "Спорт", "Краса і здоров'я", "Дитячі товари", "Меблі", "Їжа та напої", "Тварини", "Хобі", "Книги", "Інше"],
    sortBy: "Сортування",
    sortOptions: ["За замовчуванням", "Дешевше", "Дорожче", "Новинки"],
    footer: "Усі права захищені",
    heroTitle: "Торговий майданчик нового покоління",
    heroSub: "Розміщуйте товари, приймайте оплату з будь-якого банку, знаходьте покупців",
    heroBtn: "Почати торгувати",
    statsItems: "товарів", statsSellers: "продавців", statsOrders: "замовлень",
    nameLabel: "Назва товару", catLabel: "Категорія", priceLabel: "Ціна", oldPriceLabel: "Стара ціна",
    descLabel: "Опис", photoLabel: "Завантажити фото товару", submitLabel: "Розмістити товар",
    namePlaceholder: "Введіть назву...", catPlaceholder: "Оберіть категорію", descPlaceholder: "Опис товару...",
    notFound: "Нічого не знайдено",
  },
  en: {
    siteName: "TradeHub",
    tagline: "Marketplace for Dropshippers",
    search: "Search products...",
    allCategories: "All Categories",
    addProduct: "List Product",
    buyNow: "Buy Now",
    moreInfo: "Details",
    paymentTitle: "Payment Methods",
    close: "Close",
    pay: "Pay",
    enterAmount: "Enter amount",
    selectBank: "Select bank",
    priceFrom: "from",
    inStock: "In Stock",
    dropship: "Dropship",
    hot: "Hot",
    newLabel: "New",
    categories: ["All", "Electronics", "Clothes & Shoes", "Auto", "Home & Garden", "Sports", "Beauty & Health", "Kids", "Furniture", "Food & Drinks", "Pets", "Hobbies", "Books", "Other"],
    sortBy: "Sort",
    sortOptions: ["Default", "Cheapest", "Most Expensive", "Newest"],
    footer: "All rights reserved",
    heroTitle: "Next-Generation Marketplace",
    heroSub: "List products, accept payments from any bank, find buyers worldwide",
    heroBtn: "Start Selling",
    statsItems: "products", statsSellers: "sellers", statsOrders: "orders",
    nameLabel: "Product name", catLabel: "Category", priceLabel: "Price", oldPriceLabel: "Old price",
    descLabel: "Description", photoLabel: "Upload product photo", submitLabel: "List Product",
    namePlaceholder: "Enter name...", catPlaceholder: "Select category", descPlaceholder: "Product description...",
    notFound: "Nothing found",
  },
  de: {
    siteName: "TradeHub",
    tagline: "Marktplatz für Dropshipper",
    search: "Produkte suchen...",
    allCategories: "Alle Kategorien",
    addProduct: "Produkt einstellen",
    buyNow: "Kaufen",
    moreInfo: "Details",
    paymentTitle: "Zahlungsmethoden",
    close: "Schließen",
    pay: "Bezahlen",
    enterAmount: "Betrag eingeben",
    selectBank: "Bank auswählen",
    priceFrom: "ab",
    inStock: "Auf Lager",
    dropship: "Dropship",
    hot: "Top",
    newLabel: "Neu",
    categories: ["Alle", "Elektronik", "Kleidung & Schuhe", "Auto", "Haus & Garten", "Sport", "Schönheit & Gesundheit", "Kinder", "Möbel", "Lebensmittel", "Tiere", "Hobbys", "Bücher", "Sonstiges"],
    sortBy: "Sortieren",
    sortOptions: ["Standard", "Günstigste", "Teuerste", "Neueste"],
    footer: "Alle Rechte vorbehalten",
    heroTitle: "Marktplatz der nächsten Generation",
    heroSub: "Produkte einstellen, Zahlungen von jeder Bank akzeptieren, Käufer finden",
    heroBtn: "Mit Verkauf starten",
    statsItems: "Produkte", statsSellers: "Verkäufer", statsOrders: "Bestellungen",
    nameLabel: "Produktname", catLabel: "Kategorie", priceLabel: "Preis", oldPriceLabel: "Alter Preis",
    descLabel: "Beschreibung", photoLabel: "Produktfoto hochladen", submitLabel: "Produkt einstellen",
    namePlaceholder: "Name eingeben...", catPlaceholder: "Kategorie wählen", descPlaceholder: "Produktbeschreibung...",
    notFound: "Nichts gefunden",
  },
  pl: {
    siteName: "TradeHub",
    tagline: "Marketplace dla dropshipperów",
    search: "Szukaj produktów...",
    allCategories: "Wszystkie kategorie",
    addProduct: "Dodaj produkt",
    buyNow: "Kup teraz",
    moreInfo: "Szczegóły",
    paymentTitle: "Metody płatności",
    close: "Zamknij",
    pay: "Zapłać",
    enterAmount: "Podaj kwotę",
    selectBank: "Wybierz bank",
    priceFrom: "od",
    inStock: "Na stanie",
    dropship: "Dropship",
    hot: "Hit",
    newLabel: "Nowość",
    categories: ["Wszystkie", "Elektronika", "Odzież i obuwie", "Auto", "Dom i ogród", "Sport", "Uroda i zdrowie", "Dla dzieci", "Meble", "Jedzenie", "Zwierzęta", "Hobby", "Książki", "Inne"],
    sortBy: "Sortuj",
    sortOptions: ["Domyślne", "Najtańsze", "Najdroższe", "Najnowsze"],
    footer: "Wszelkie prawa zastrzeżone",
    heroTitle: "Marketplace nowej generacji",
    heroSub: "Wystawiaj produkty, przyjmuj płatności z dowolnego banku, znajdź kupujących",
    heroBtn: "Zacznij sprzedawać",
    statsItems: "produktów", statsSellers: "sprzedawców", statsOrders: "zamówień",
    nameLabel: "Nazwa produktu", catLabel: "Kategoria", priceLabel: "Cena", oldPriceLabel: "Stara cena",
    descLabel: "Opis", photoLabel: "Prześlij zdjęcie produktu", submitLabel: "Dodaj produkt",
    namePlaceholder: "Podaj nazwę...", catPlaceholder: "Wybierz kategorię", descPlaceholder: "Opis produktu...",
    notFound: "Nic nie znaleziono",
  },
  fr: {
    siteName: "TradeHub",
    tagline: "Marketplace pour dropshippers",
    search: "Rechercher des produits...",
    allCategories: "Toutes catégories",
    addProduct: "Publier un produit",
    buyNow: "Acheter",
    moreInfo: "Détails",
    paymentTitle: "Modes de paiement",
    close: "Fermer",
    pay: "Payer",
    enterAmount: "Saisir le montant",
    selectBank: "Choisir la banque",
    priceFrom: "dès",
    inStock: "En stock",
    dropship: "Dropship",
    hot: "Populaire",
    newLabel: "Nouveau",
    categories: ["Tout", "Électronique", "Vêtements & Chaussures", "Auto", "Maison & Jardin", "Sport", "Beauté & Santé", "Enfants", "Mobilier", "Alimentation", "Animaux", "Loisirs", "Livres", "Autre"],
    sortBy: "Trier",
    sortOptions: ["Par défaut", "Moins cher", "Plus cher", "Récents"],
    footer: "Tous droits réservés",
    heroTitle: "Marketplace de nouvelle génération",
    heroSub: "Publiez des produits, acceptez les paiements de n'importe quelle banque",
    heroBtn: "Commencer à vendre",
    statsItems: "produits", statsSellers: "vendeurs", statsOrders: "commandes",
    nameLabel: "Nom du produit", catLabel: "Catégorie", priceLabel: "Prix", oldPriceLabel: "Ancien prix",
    descLabel: "Description", photoLabel: "Télécharger photo produit", submitLabel: "Publier le produit",
    namePlaceholder: "Saisir le nom...", catPlaceholder: "Choisir la catégorie", descPlaceholder: "Description du produit...",
    notFound: "Rien trouvé",
  },
};

const BANKS = [
  { id: "monobank", name: "Monobank", icon: "💳" },
  { id: "privatbank", name: "ПриватБанк", icon: "🏦" },
  { id: "sberbank", name: "Сбербанк", icon: "🏛" },
  { id: "tinkoff", name: "Т-Банк", icon: "💛" },
  { id: "alfabank", name: "Альфа-Банк", icon: "🔴" },
  { id: "visa", name: "Visa / Mastercard", icon: "💳" },
  { id: "paypal", name: "PayPal", icon: "🌐" },
  { id: "apple", name: "Apple Pay", icon: "🍎" },
  { id: "google", name: "Google Pay", icon: "🔵" },
  { id: "crypto", name: "Криптовалюта", icon: "₿" },
];

const PRODUCTS = [
  {
    id: 1, category: 1,
    name: { ru: "Смартфон Pro Max 14", uk: "Смартфон Pro Max 14", en: "Smartphone Pro Max 14", de: "Smartphone Pro Max 14", pl: "Smartfon Pro Max 14", fr: "Smartphone Pro Max 14" },
    price: 24990, oldPrice: 32000,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/ccaf294e-5f92-4448-af5a-02a3d1ea689b.jpg",
    seller: "TechDrop", rating: 4.9, reviews: 312, badge: "hot", dropship: true,
    desc: { ru: "Флагманский смартфон 2024 года. 256GB, 12GB RAM, AMOLED 6.7\"", uk: "Флагманський смартфон 2024 року. 256GB, 12GB RAM, AMOLED 6.7\"", en: "Flagship smartphone 2024. 256GB, 12GB RAM, AMOLED 6.7\"", de: "Flaggschiff-Smartphone 2024. 256GB, 12GB RAM, AMOLED 6.7\"", pl: "Flagowy smartfon 2024. 256GB, 12GB RAM, AMOLED 6.7\"", fr: "Smartphone phare 2024. 256GB, 12GB RAM, AMOLED 6.7\"" },
  },
  {
    id: 2, category: 2,
    name: { ru: "Кожаная куртка мужская", uk: "Шкіряна куртка чоловіча", en: "Men's Leather Jacket", de: "Herren Lederjacke", pl: "Kurtka skórzana męska", fr: "Veste en cuir homme" },
    price: 4500, oldPrice: 6800,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/b9a6c46f-185d-4896-a545-e53aa4068039.jpg",
    seller: "FashionHub", rating: 4.7, reviews: 89, badge: "new", dropship: true,
    desc: { ru: "Натуральная кожа, классический крой, размеры S-3XL", uk: "Натуральна шкіра, класичний крій, розміри S-3XL", en: "Genuine leather, classic cut, sizes S-3XL", de: "Echtes Leder, klassischer Schnitt, Größen S-3XL", pl: "Prawdziwa skóra, klasyczny krój, rozmiary S-3XL", fr: "Cuir véritable, coupe classique, tailles S-3XL" },
  },
  {
    id: 3, category: 5,
    name: { ru: "Велосипед горный X-Trail 29", uk: "Велосипед гірський X-Trail 29", en: "Mountain Bike X-Trail 29", de: "Mountainbike X-Trail 29", pl: "Rower górski X-Trail 29", fr: "VTT X-Trail 29" },
    price: 18500, oldPrice: null,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "SportDrop", rating: 4.8, reviews: 45, badge: null, dropship: true,
    desc: { ru: "21 скорость, алюминиевая рама, гидравлические тормоза", uk: "21 швидкість, алюмінієва рама, гідравлічні гальма", en: "21 speed, aluminum frame, hydraulic brakes", de: "21 Gänge, Aluminiumrahmen, hydraulische Bremsen", pl: "21 biegów, rama aluminiowa, hamulce hydrauliczne", fr: "21 vitesses, cadre aluminium, freins hydrauliques" },
  },
  {
    id: 4, category: 8,
    name: { ru: "Кресло офисное ErgoMax Pro", uk: "Крісло офісне ErgoMax Pro", en: "Ergonomic Office Chair ErgoMax Pro", de: "Ergonomischer Bürostuhl ErgoMax Pro", pl: "Fotel biurowy ErgoMax Pro", fr: "Fauteuil de bureau ErgoMax Pro" },
    price: 12900, oldPrice: 15000,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "FurniDrop", rating: 4.6, reviews: 201, badge: "hot", dropship: false,
    desc: { ru: "Поясничная поддержка, регулировка высоты, сетчатая спинка", uk: "Поперекова підтримка, регулювання висоти, сітчаста спинка", en: "Lumbar support, height adjustment, mesh back", de: "Lendenstütze, Höhenverstellung, Netzrücken", pl: "Podparcie lędźwiowe, regulacja wysokości, siatka", fr: "Soutien lombaire, réglage hauteur, dossier filet" },
  },
  {
    id: 5, category: 1,
    name: { ru: "Ноутбук UltraBook 15\" i7", uk: "Ноутбук UltraBook 15\" i7", en: "Laptop UltraBook 15\" i7", de: "Laptop UltraBook 15\" i7", pl: "Laptop UltraBook 15\" i7", fr: "Ordinateur portable UltraBook 15\" i7" },
    price: 54900, oldPrice: 62000,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "TechDrop", rating: 4.9, reviews: 156, badge: "new", dropship: true,
    desc: { ru: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, IPS дисплей", uk: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, IPS дисплей", en: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, IPS display", de: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, IPS Display", pl: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, ekran IPS", fr: "Intel Core i7-13th Gen, 16GB RAM, 512GB NVMe SSD, écran IPS" },
  },
  {
    id: 6, category: 6,
    name: { ru: "Сыворотка омолаживающая Retinol X", uk: "Сироватка омолоджувальна Retinol X", en: "Anti-Aging Serum Retinol X", de: "Anti-Aging-Serum Retinol X", pl: "Serum odmładzające Retinol X", fr: "Sérum anti-âge Retinol X" },
    price: 1890, oldPrice: 2400,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "BeautyPro", rating: 4.7, reviews: 430, badge: "hot", dropship: true,
    desc: { ru: "Концентрация ретинола 0.5%, гиалуроновая кислота, 30ml", uk: "Концентрація ретинолу 0.5%, гіалуронова кислота, 30ml", en: "Retinol 0.5%, hyaluronic acid, 30ml", de: "Retinol-Konzentration 0,5%, Hyaluronsäure, 30ml", pl: "Stężenie retinolu 0,5%, kwas hialuronowy, 30ml", fr: "Rétinol 0,5%, acide hyaluronique, 30ml" },
  },
  {
    id: 7, category: 3,
    name: { ru: "Видеорегистратор 4K Ultra Wide", uk: "Відеореєстратор 4K Ultra Wide", en: "Dash Cam 4K Ultra Wide", de: "Dashcam 4K Ultra Wide", pl: "Wideorejestrator 4K Ultra Wide", fr: "Dashcam 4K Ultra Wide" },
    price: 3200, oldPrice: 4100,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "AutoDrop", rating: 4.5, reviews: 67, badge: null, dropship: true,
    desc: { ru: "Разрешение 4K, угол 170°, ночное видение, GPS", uk: "Роздільна здатність 4K, кут 170°, нічне бачення, GPS", en: "4K resolution, 170° angle, night vision, GPS", de: "4K-Auflösung, 170°-Winkel, Nachtsicht, GPS", pl: "Rozdzielczość 4K, kąt 170°, nocne widzenie, GPS", fr: "Résolution 4K, angle 170°, vision nocturne, GPS" },
  },
  {
    id: 8, category: 7,
    name: { ru: "Конструктор LEGO Technic 42150", uk: "Конструктор LEGO Technic 42150", en: "LEGO Technic 42150 Set", de: "LEGO Technic 42150 Set", pl: "Zestaw LEGO Technic 42150", fr: "Set LEGO Technic 42150" },
    price: 5600, oldPrice: 6900,
    image: "https://cdn.poehali.dev/projects/b8b7fd36-3e30-4dca-9bec-2feeb4358b8d/files/9619a901-5b76-4ecf-9956-b14946afefc3.jpg",
    seller: "KidsDrop", rating: 4.9, reviews: 88, badge: "new", dropship: false,
    desc: { ru: "1823 детали, возраст 10+, сборная модель гоночного авто", uk: "1823 деталі, вік 10+, збірна модель гоночного авто", en: "1823 pieces, age 10+, racing car model", de: "1823 Teile, ab 10 Jahren, Rennwagen-Modell", pl: "1823 elementy, wiek 10+, model samochodu wyścigowego", fr: "1823 pièces, dès 10 ans, modèle de voiture de course" },
  },
];

type LangKey = keyof typeof LANGS;

const CATEGORY_ICONS = ["🛍️", "📱", "👗", "🚗", "🏠", "⚽", "💄", "👶", "🛋️", "🍕", "🐾", "🎨", "📚", "📦"];

export default function Index() {
  const [lang, setLang] = useState<LangKey>("ru");
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [sortBy, setSortBy] = useState(0);
  const [payProduct, setPayProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [detailProduct, setDetailProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  const t = LANGS[lang];

  const toggleDark = () => {
    setDark((d) => {
      if (!d) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return !d;
    });
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategory > 0) list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name[lang].toLowerCase().includes(q) ||
          p.desc[lang].toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q)
      );
    }
    if (sortBy === 1) list.sort((a, b) => a.price - b.price);
    if (sortBy === 2) list.sort((a, b) => b.price - a.price);
    if (sortBy === 3) list.sort((a, b) => b.id - a.id);
    return list;
  }, [activeCategory, search, sortBy, lang]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("ru-RU").format(p);

  const currency =
    lang === "en" ? "$" : lang === "de" || lang === "fr" ? "€" : lang === "pl" ? "zł" : "₴";

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="ShoppingBag" size={18} className="text-primary-foreground" />
            </div>
            <span
              className="font-bold text-xl text-primary dark:text-blue-400 hidden sm:block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.siteName}
            </span>
          </div>

          <div className="flex-1 relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={lang} onValueChange={(v) => setLang(v as LangKey)}>
              <SelectTrigger className="h-9 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">🇷🇺 RU</SelectItem>
                <SelectItem value="uk">🇺🇦 UK</SelectItem>
                <SelectItem value="en">🇬🇧 EN</SelectItem>
                <SelectItem value="de">🇩🇪 DE</SelectItem>
                <SelectItem value="pl">🇵🇱 PL</SelectItem>
                <SelectItem value="fr">🇫🇷 FR</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              title="Тема"
            >
              <Icon name={dark ? "Sun" : "Moon"} size={16} />
            </button>

            <Button
              size="sm"
              className="h-9 text-xs hidden sm:flex gap-1"
              onClick={() => setAddOpen(true)}
            >
              <Icon name="Plus" size={14} />
              {t.addProduct}
            </Button>

            {/* Dashboard dropdown */}
            <div className="relative group">
              <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors" title="Кабинеты">
                <Icon name="LayoutDashboard" size={16} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden">
                <button
                  onClick={() => navigate("/seller")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-secondary text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="Store" size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Кабинет продавца</div>
                    <div className="text-[10px] text-muted-foreground">Товары, заказы, выручка</div>
                  </div>
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={() => navigate("/owner")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-secondary text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="Crown" size={14} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Панель владельца</div>
                    <div className="text-[10px] text-muted-foreground">Финансы, команда, функции</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="gradient-hero text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 animate-fade-in">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.heroTitle}
            </h1>
            <p className="text-white/80 text-base mb-5 max-w-xl">{t.heroSub}</p>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 px-6 h-11 text-sm"
            >
              <Icon name="Rocket" size={16} className="mr-2" />
              {t.heroBtn}
            </Button>
          </div>
          <div className="flex gap-8 text-center">
            {[
              { n: "120K+", label: t.statsItems },
              { n: "8K+", label: t.statsSellers },
              { n: "2M+", label: t.statsOrders },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl font-bold text-amber-400"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.n}
                </div>
                <div className="text-white/70 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {t.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${activeCategory === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
              >
                <span>{CATEGORY_ICONS[i]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} {t.statsItems}
          </span>
          <div className="flex gap-2 flex-wrap">
            {t.sortOptions.map((s, i) => (
              <button
                key={i}
                onClick={() => setSortBy(i)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all
                  ${sortBy === i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">{t.notFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, idx) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border card-hover overflow-hidden flex flex-col animate-fade-in"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badge === "hot" && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        🔥 {t.hot}
                      </span>
                    )}
                    {product.badge === "new" && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✨ {t.newLabel}
                      </span>
                    )}
                    {product.dropship && (
                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        📦 {t.dropship}
                      </span>
                    )}
                  </div>
                  {product.oldPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col gap-2">
                  <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-foreground">
                    {product.name[lang]}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.desc[lang]}</p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="Star" size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-foreground">{product.rating}</span>
                    <span>({product.reviews})</span>
                    <span className="ml-auto text-primary dark:text-blue-400 font-medium text-[10px]">{product.seller}</span>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-1">
                    <div>
                      <div className="font-bold text-base text-foreground">
                        {currency}{formatPrice(product.price)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-xs line-through text-muted-foreground">
                          {currency}{formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDetailProduct(product)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Icon name="Eye" size={14} />
                      </button>
                      <button
                        onClick={() => setPayProduct(product)}
                        className="px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        {t.buyNow}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PAYMENT MODAL */}
      <Dialog open={!!payProduct} onOpenChange={() => { setPayProduct(null); setSelectedBank(""); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">
              {t.paymentTitle}
            </DialogTitle>
          </DialogHeader>
          {payProduct && (
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-secondary rounded-lg">
                <img src={payProduct.image} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{payProduct.name[lang]}</p>
                  <p className="text-lg font-bold text-primary dark:text-blue-400 mt-1">
                    {currency}{formatPrice(payProduct.price)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{t.selectBank}:</p>
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all
                      ${selectedBank === bank.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                      }`}
                  >
                    <span className="text-xl">{bank.icon}</span>
                    <span className="text-xs font-medium leading-tight">{bank.name}</span>
                  </button>
                ))}
              </div>
              <Button
                className="w-full font-semibold"
                disabled={!selectedBank}
                onClick={() => { setPayProduct(null); setSelectedBank(""); }}
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                {t.pay}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DETAIL MODAL */}
      <Dialog open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-xl leading-tight"
            >
              {detailProduct?.name[lang]}
            </DialogTitle>
          </DialogHeader>
          {detailProduct && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                <img src={detailProduct.image} className="w-full h-full object-cover" alt="" />
              </div>
              <p className="text-sm text-muted-foreground">{detailProduct.desc[lang]}</p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <Icon name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                  <strong>{detailProduct.rating}</strong> ({detailProduct.reviews})
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">{t.inStock} ✓</span>
                <span className="text-primary dark:text-blue-400 font-medium">{detailProduct.seller}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <div className="text-2xl font-bold">{currency}{formatPrice(detailProduct.price)}</div>
                  {detailProduct.oldPrice && (
                    <div className="text-sm line-through text-muted-foreground">
                      {currency}{formatPrice(detailProduct.oldPrice)}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => { setDetailProduct(null); setPayProduct(detailProduct); }}
                  className="font-semibold"
                >
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  {t.buyNow}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD PRODUCT MODAL */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">
              {t.addProduct}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.nameLabel}</label>
              <Input placeholder={t.namePlaceholder} className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.catLabel}</label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder={t.catPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {t.categories.slice(1).map((c, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {CATEGORY_ICONS[i + 1]} {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t.priceLabel}</label>
                <Input placeholder="0" type="number" className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t.oldPriceLabel}</label>
                <Input placeholder="0" type="number" className="h-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.descLabel}</label>
              <textarea
                rows={3}
                placeholder={t.descPlaceholder}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors">
              <Icon name="Upload" size={20} className="mx-auto mb-2 opacity-50" />
              {t.photoLabel}
            </div>
            <Button
              className="w-full font-semibold"
              onClick={() => setAddOpen(false)}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              {t.submitLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Icon name="ShoppingBag" size={12} className="text-primary-foreground" />
            </div>
            <span
              className="font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.siteName}
            </span>
            <span>— {t.tagline}</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map((p) => (
              <span key={p} className="text-xs border border-border rounded px-2 py-1 text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">© 2024 {t.siteName}. {t.footer}</span>
        </div>
      </footer>
    </div>
  );
}