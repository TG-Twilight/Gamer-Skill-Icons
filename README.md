<div align="left">
<a href="./src/README_zh-CN.md">
  <img src="https://img.shields.io/badge/Chinese-blue?style=for-the-badge&logo=readme&logoColor=white" alt="Chinese"/>
</a>&nbsp;|&nbsp;
<a href="./README.md">
  <img src="https://img.shields.io/badge/English-green?style=for-the-badge&logo=readme&logoColor=white" alt="English"/>
</a>&nbsp;|&nbsp;
<a href="https://zyc.su/" target="_blank">
  <img src="https://img.shields.io/badge/Author%20Blog-orange?style=for-the-badge&logo=firefox-browser&logoColor=white" alt="Author Blog"/>
</a>&nbsp;|&nbsp;
<a href="https://afdian.com/a/AdsRule" target="_blank">
  <img src="https://img.shields.io/badge/Sponsor%20Me-ffd700?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white&labelColor=ff9800" alt="Sponsor Me"/>
</a>
</div>

# 🍁R6 Operators Icons
<p align="center">
   <img src="https://raw.githubusercontent.com/TG-Twilight/R6-Operators-Icons/refs/heads/main/src/banner.webp">
</p>

[![GitHub stars](https://img.shields.io/github/stars/TG-Twilight/R6-Operators-Icons)](https://github.com/TG-Twilight/R6-Operators-Icons/stargazers)
[![GitHub license](https://img.shields.io/github/license/TG-Twilight/R6-Operators-Icons)](./LICENSE)

A public API and static asset library for Rainbow Six: Siege operator SVG icons, suitable for websites, bots, and creative projects.
Now you can showcase your favorite or skilled R6 operators on your [personal blog](https://zyc.su) just like people display their “Skill” badges!

---

## 🍁Features

- ⚡ **Simple API**: Get any operator SVG via URL.
- 🧩 **Batch Sprite**: Combine multiple icons into a single SVG sprite.
- 📦 **Self-hosted**: No external dependency required.

---

## 🍁Usage

### 1. Get a single operator SVG

```url
GET /icons?i=ash
```

Example:  
<p> 
  <img src="https://github.com/TG-Twilight/R6-Operators-Icons/blob/main/icons/fuze.svg" width="672"/>
</p>

---

### 2. Combine multiple icons into a single SVG

```url
GET /icons?i=ash,bandit,ace
```

---

### 3. Customize icons per row

```url
GET /icons?i=ash,bandit,ace&perline=2&radius=16
```

- `perline`: Number of icons per row (default: 15, max: 15)

---

### 4. Get all available operator IDs

```url
GET /icons
```

Returns a JSON list of all operator IDs.

---

## 🍁Examples

### Attackers (each icon 96×96)

[https://r6.zyc.su/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash](https://r6.zyc.su/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash)

<p>
  <img src="https://r6-operators-icons.vercel.app/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash" width="672"/>
</p>

### Defenders (each icon 96×96)

[https://r6.zyc.su/api/icons?i=recruit_red,rook,kapkan,mute,smoke,jager,azami](https://r6.zyc.su/api/icons?i=recruit_red,rook,kapkan,mute,smoke,jager,azami)

<p>
  <img src="https://r6.zyc.su/api/icons?i=recruit_red,rook,kapkan,mute,smoke,jager,azami" width="672"/>
</p>

---

## 🍁Self-host

Clone and run:

```bash
git clone https://github.com/TG-Twilight/R6-Operators-Icons.git
cd R6-Operators-Icons
npm install
npm run build
npm start
```

API will be available at `http://localhost:3000/icons?...`

---

## 🍁Directory Structure

```
/icons/         // All SVG icon files
/src/           // Source code (TypeScript)
/src/utils/     // SVG sprite logic
/src/routes/    // Express API routes
```

---

## 🍁Credits

- Operator icons originally from [@marcopixel/r6operators-website](https://github.com/marcopixel/r6operators-website)
- Many modifications and inspiration from [@syvixor/skills-icons](https://github.com/syvixor/skills-icons)

---

## 🍁LICENSE

MIT License © 2025-present [TG-Twilight](https://github.com/TG-Twilight)

---
