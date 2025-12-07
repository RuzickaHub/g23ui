# 🚀 Command Center Dashboard

Moderní dashboard aplikací s externími daty a automatickým deployem na GitHub Pages.

![Dashboard Preview](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200\&h=600\&fit=crop)

---

## ✨ Funkce

* 📁 **Externí data** – JSON soubor pro snadnou správu aplikací
* 🔍 **Vyhledávání** – rychlé vyhledávání v kategoriích a aplikacích
* 📱 **Responzivní design** – optimalizováno pro všechny obrazovky
* 🎨 **Moderní UI** – tmavý režim s akcenty
* 🔄 **Auto-deploy** – automatické nasazení při pushnutí
* ♿ **Přístupnost** – plná podpora klávesnice a screen readerů
* 💾 **Cache** – lokální ukládání dat pro rychlejší načítání

---

## 🏗️ Struktura projektu

```text
command-center-dashboard/
├── public/                # Statické soubory (index.html)
├── src/
│   ├── data/              # JSON datové soubory
│   │   └── dashboard-data.json
│   ├── js/                # JavaScript soubory
│   │   └── app.js
│   ├── css/               # CSS styly
│   │   └── style.css
│   └── assets/            # Obrázky a ikony
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml
├── package.json           # Závislosti
└── README.md              # Tento soubor
```

---

## 🚀 Rychlý start

### 1. Lokální vývoj

```bash
# Klonovat repozitář
git clone https://github.com/yourusername/command-center-dashboard.git
cd command-center-dashboard

# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

Otevřete `http://localhost:3000` ve svém prohlížeči.

---

### 2. Přidání vlastních aplikací

Upravte soubor `src/data/dashboard-data.json`:

```json
{
  "categories": [
    {
      "id": "your-category",
      "name": "Vaše kategorie",
      "icon": "https://example.com/icon.jpg",
      "description": "Popis kategorie"
    }
  ],
  "apps": [
    {
      "id": "your-app",
      "name": "Vaše aplikace",
      "url": "https://example.com",
      "icon": "https://example.com/icon.jpg",
      "category": "your-category",
      "description": "Popis aplikace"
    }
  ]
}
```

---

### 3. Build pro produkci

```bash
# Manuální build
npm run build

# Lokální testování buildu
npm run serve
```

---

## 🌐 Nasazení na GitHub Pages

1. **Pushněte kód na GitHub**

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Povolte GitHub Pages**

* Přejděte do **Settings → Pages**
* **Source:** GitHub Actions

✅ Auto-deploy je nastaven. Každý push do `main` větve spustí nasazení.

---

## 🛠️ Vývojové příkazy

| Příkaz           | Popis                       |
| ---------------- | --------------------------- |
| `npm run dev`    | Spustí vývojový server      |
| `npm run build`  | Sestaví produkční verzi     |
| `npm run deploy` | Nasazení na GitHub Pages    |
| `npm run lint`   | Kontrola kódu pomocí ESLint |
| `npm run format` | Formátování pomocí Prettier |
| `npm test`       | Spuštění testů              |

---

## 🔧 Konfigurace

### Datová struktura

* **Categories** – `id`, `name`, `icon`, `description`
* **Apps** – `id`, `name`, `url`, `icon`, `category`, `description`
* **Settings** – globální nastavení dashboardu

### Environment Variables

Nejsou vyžadovány. Veškerá konfigurace je v `src/js/app.js` v objektu `CONFIG`.

---

## 📱 Responzivní breakpointy

* **Mobile:** `< 768px` (2 sloupce)
* **Tablet:** `768px – 1023px` (4 sloupce)
* **Desktop:** `≥ 1024px` (6 sloupců)

---

## ♿ Přístupnost

Dashboard splňuje **WCAG 2.1 AA**:

* Plná klávesnicová navigace
* ARIA atributy
* Kontrastní barvy
* Podpora screen readerů

---

## 🔄 Cache strategie

* LocalStorage cache (5 minut)
* Lazy loading obrázků
* Service Worker (připraveno pro PWA)

---

## 🐛 Řešení problémů

### Data se nenačítají

* Zkontrolujte cestu k JSON souboru
* Ověřte syntaxi JSONu
* Zkontrolujte CORS policy

### GitHub Pages nefunguje

* Zkontrolujte nastavení Pages v **Settings**
* Ověřte workflow v **Actions**
* Zkontrolujte build logy

### Obrázky se nenačítají

* Zkontrolujte URL obrázků
* Ověřte CORS na zdroji obrázků
* Vyzkoušejte jiný CDN

---

## 🤝 Přispívání

1. Forkněte repozitář
2. Vytvořte feature branch: `git checkout -b feature/AmazingFeature`
3. Commitněte změny: `git commit -m 'Add some AmazingFeature'`
4. Pushněte branch: `git push origin feature/AmazingFeature`
5. Otevřete Pull Request

---

## 📄 Licence

Distribuováno pod **MIT licencí**. Viz soubor `LICENSE`.

---

## 👏 Poděkování

* Ikony: Font Awesome
* Obrázky: Unsplash
* Font: Inter
* Deployment: GitHub Actions

---

## 📞 Kontakt

**Vaše jméno**
@yourtwitter – [email@example.com](mailto:email@example.com)

Project Link: [https://github.com/yourusername/command-center-dashboard](https://github.com/yourusername/command-center-dashboard)

---

## 📄 LICENSE

```text
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🔧 Jak nasadit projekt (shrnutí)

1. Vytvořte všechny soubory podle uvedené struktury
2. Inicializujte Git a pushněte na GitHub
3. Nastavte **Settings → Pages → GitHub Actions**

Dashboard bude dostupný na:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

Projekt obsahuje kompletní základ pro moderní dashboard s externími daty,
responzivním designem a automatickým deployem.
