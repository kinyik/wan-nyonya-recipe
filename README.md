# 云惹坊 Wan Nyonya Recipe

一个真实在运营的娘惹糕品牌官网，客人可以在线选购，用 WhatsApp 一键下单，订单同时自动记进 Google Sheet。

🔗 **Live：** <https://wannyonya.com.my>

![首页](docs/screenshots/home.jpg)

## 解决什么问题

以前客人在 IG、WhatsApp 私讯问价钱，我一条一条回；订单散在聊天记录里，容易漏单、算错钱。

现在：

- 客人自己看产品、选口味和数量，网站自动算总价
- 按一下就打开 WhatsApp，订单内容、取货日期、客人资料都整理好了
- 同一张单同时写进 Google Sheet，有订单编号、状态栏，方便跟进和统计

## 功能

- **购物篮 + WhatsApp 一键下单**：讯息自动带上订单编号、明细、总价、取货/送货资料
- **订单自动记录到 Google Sheet**：每张单一行，状态下拉选单（新订单 → 已确认 → 已付款 → 已完成）
- **接单规则写进系统**：单盒提前 1 天、套餐提前 2 天订，日历按购物篮内容自动限制；未达最低消费不能下单
- **中 / English 切换**，手机优先的响应式设计
- **产品、价钱、营业资料都在 JSON 文件里**，改价不用碰代码
- **SEO + 分享预览图**：分享到 WhatsApp / Facebook 有标题、描述和图片

| 产品菜单 | 套餐 / 礼盒 |
| --- | --- |
| ![产品菜单](docs/screenshots/menu.jpg) | ![套餐礼盒](docs/screenshots/sets.jpg) |

## 下单流程

```
客人选产品 ──► 购物篮（检查最低消费、最早日期）
                 │
                 ├──► WhatsApp：整理好的订单讯息（含订单编号）
                 │
                 └──► 网站 /api/order（服务器）
                        ├─ 重新检查资料
                        ├─ 按 products.json 重算总价（不信任浏览器传来的金额）
                        └──► Google Apps Script ──► Google Sheet「订单」
```

## 技术

Next.js（App Router）· React · Tailwind CSS · TypeScript · Google Apps Script · Vercel

几个值得一提的细节：

- **服务器端验证**：订单经过网站自己的 `/api/order`，在服务器上检查资料并重算总价，Apps Script 网址和暗号只存在服务器环境变量里，不会出现在浏览器
- **金额用「仙」计算**：价钱有小数（RM9.90），一律换成整数再加总，避免 `9.9 × 3 = 29.700000000000003` 这种误差
- **防表格公式注入**：客人填的内容写进 Sheet 前会转成纯文字，`=`、`+` 开头的内容不会被当成公式执行；电话开头的 0 也不会被吃掉
- **WhatsApp 不被拦截**：在按键当下就打开 WhatsApp，存表在背景进行；就算 Google Sheet 暂时连不上，客人照样能下单
- **购物篮会记住**：关掉网页再回来，选好的产品还在

## 项目结构

```
app/
  page.tsx              一页式网站，9 个区块
  layout.tsx            字体、SEO 标题、分享卡
  api/order/route.ts    接收订单 → 检查 → 转发到 Google Sheet
  opengraph-image.jpg   分享预览图
components/             Navbar、Hero、ProductMenu、GiftSets、Cart……
data/
  products.json         产品、套餐、价钱、图片（改价只改这里）
  settings.json         WhatsApp 号码、提前天数、最低消费、营业时间
  i18n.json             中 / EN 文字
lib/order.ts            组合 WhatsApp 讯息、订单编号、总价
apps-script/            贴进 Google Sheet 的脚本和设定步骤
```

## 本地运行

```bash
npm install
cp .env.example .env.local   # 填上 Google Sheet 网址和暗号，见 apps-script/README.md
npm run dev                  # http://localhost:3000
```

部署在 Vercel：连接 GitHub 仓库，在 **Environment Variables** 填上 `ORDER_SHEET_URL` 和 `ORDER_SHEET_SECRET`，之后每次 push 就自动更新。

## 怎么做的

用 [Claude Code](https://claude.com/claude-code) 开发，分 4 步完成，每一步都单独提交：

1. 搭骨架：9 个区块、品牌视觉、中 / EN 切换
2. 购物篮 + WhatsApp 下单
3. 订单存进 Google Sheet
4. 换上真实资料、SEO、上线

我负责品牌、内容、接单规则、用户流程和测试；代码由 Claude Code 按我的指令编写。

## 结果

_（上线后更新真实数据，例如第一个月访客数、下单数）_
