# R6 Operators Icons 彩虹六号干员图标

[![GitHub stars](https://img.shields.io/github/stars/TG-Twilight/R6-Operators-Icons)](https://github.com/TG-Twilight/R6-Operators-Icons/stargazers)
[![GitHub license](https://img.shields.io/github/license/TG-Twilight/R6-Operators-Icons)](./LICENSE)

一个提供彩虹六号：围攻干员SVG图标的API和静态资源库，适用于网页、机器人和创意项目。

---

## 特性

- ⚡ **简单API**：通过URL即可获取任意干员SVG图标
- 🧩 **批量拼接**：可将多个图标合成一张SVG拼图
- 🎨 **圆角自定义**：支持自定义图标圆角
- 📦 **可自托管**：无需依赖外部服务
- 🌏 **中英文文档**：支持中英文说明

---

## 使用方式

### 1. 获取单个干员SVG图标

```url
GET /icons?i=ash
```

示例：  
<p> 
![ash](./icons/fuze.svg )
  <img src="./icons/fuze.svg" width="672"/>
</p>

---

### 2. 批量拼接多个图标为一个SVG

```url
GET /icons?i=ash,bandit,ace
```

---

### 3. 自定义每行图标数量与圆角

```url
GET /icons?i=ash,bandit,ace&perline=2&radius=16
```

- `perline`：每行图标数量（默认15，最大15）
- `radius`：图标背景圆角（0~100，默认25）

---

### 4. 获取全部可用干员ID

```url
GET /icons
```

返回所有干员ID的JSON列表。

---

## 示例

### 进攻方（每个图标96×96）

[https://r6-operators-icons.vercel.app/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash](https://r6-operators-icons.vercel.app/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash)

<p>
  <img src="https://r6-operators-icons.vercel.app/api/icons?i=recruit_blue,fuze,buck,blitz,montagne,nokk,ash" width="672"/>
</p>

### 防守方（每个图标96×96）

[https://r6-operators-icons.vercel.app/api/icons?i=rrecruit_red,rook,kapkan,mute,smoke,jager,azami](https://r6-operators-icons.vercel.app/api/icons?i=recruit_red,rook,kapkan,mute,smoke,jager,azami)

<p>
  <img src="https://r6-operators-icons.vercel.app/api/icons?i=recruit_red,rook,kapkan,mute,smoke,jager,azami" width="672"/>
</p>

---

## 自托管部署

克隆并运行：

```bash
git clone https://github.com/TG-Twilight/R6-Operators-Icons.git
cd R6-Operators-Icons
npm install
npm run build
npm start
```

API地址为 `http://localhost:3000/icons?...`

---

## 目录结构

```
/icons/         // 所有SVG图标文件
/src/           // 源代码（TypeScript）
/src/utils/     // SVG拼接逻辑
/src/routes/    // Express API 路由
```

---

## 鸣谢

- 干员图标取自 [@marcopixel/r6operators-website](https://github.com/marcopixel/r6operators-website)
- 做了很多修改，但灵感来自 [@syvixor/skills-icons](https://github.com/syvixor/skills-icons)

---

## LICENSE

MIT License © 2025-present [TG-Twilight](https://github.com/TG-Twilight)

---

## English

See [`README.md`](./README.md)
