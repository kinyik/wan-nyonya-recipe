# 订单存进 Google Sheet：设定步骤

客人在网站按「用 WhatsApp 确认订单」时，网站会同时把订单交给自己的 `/api/order`。
`/api/order` 在服务器上检查资料、按 `data/products.json` 重算总价，再转发给这份 Apps Script，写进 Google Sheet 的一行。

```
客人浏览器 ──► 网站 /api/order（检查 + 重算总价）──► Google Apps Script ──► Google Sheet「订单」
         └──► WhatsApp（订单讯息，两边用同一个订单编号）
```

## 一次性设定（约 10 分钟，按钮名称以英文界面为准）

### 1. 建表格
1. 打开 <https://sheets.google.com> → **Blank spreadsheet**，左上角改名为「云惹坊订单」。
2. **File → Settings → Time zone** 选 **(GMT+08:00) Kuala Lumpur** → **Save settings**。

### 2. 贴脚本
1. **Extensions → Apps Script**（会开一个新分页）。
2. 编辑器里原本有 `function myFunction() {}`，全部删掉。
3. 打开本文件夹的 `Code.gs`，全选复制，贴进去，按上方 💾 **Save project**（或 Ctrl+S）。

### 3. 设暗号
1. 左边竖排图标点 ⚙️ **Project Settings**。
2. 拉到最下面 **Script Properties** → **Add script property**。
3. **Property** 填 `ORDER_SECRET`。
4. **Value** 填网站文件夹 `.env.local` 里 `ORDER_SHEET_SECRET=` 后面那一长串（不要复制等号）。
5. **Save script properties**。

### 4. 运行一次 setup
1. 左边点 `< >` **Editor** 回到代码。
2. 上方工具列：**Save project · Run · Debug**，在 **Debug** 右边有一个下拉选单（默认显示 `doPost`）→ 改选 **`setup`**。
3. 按 ▶ **Run**。
4. 第一次会跳出 **Authorization required** → **Review permissions** → 选你的 Google 账号。
5. 看到 **Google hasn't verified this app** → 点左下角 **Advanced** → **Go to Untitled project (unsafe)** → **Allow**。
   （这是你自己写的脚本，Google 对没上架的脚本都会这样提示。）
6. 下方 **Execution log** 出现 **Execution completed** 就成功了。回到表格，会多一个「订单」工作表，有粉色表头。

### 5. 部署成网页应用
1. 右上角蓝色 **Deploy → New deployment**。
2. **Select type** 旁边的 ⚙️ → 选 **Web app**。
3. **Execute as**：**Me (你的邮箱)**；**Who has access**：**Anyone**。
4. 按 **Deploy**（如果又要授权，照第 4 步再允许一次）。
5. 复制 **Web app** 下面的 **URL**（`https://script.google.com/macros/s/…/exec`）→ **Done**。
6. 用浏览器打开这个网址，看到 `{"ok":true,"service":"wan-nyonya-orders"}` 就成功了。

> 选 **Anyone** 是因为网站服务器不会登录你的 Google 账号。
> 安全靠第 3 步的暗号：没有暗号的请求一律被拒绝。

### 6. 填回网站
打开网站文件夹的 `.env.local`，把网址贴在 `ORDER_SHEET_URL=` 后面，保存。

## 以后改了 Code.gs 怎么办
**Deploy → Manage deployments** → 选现在的部署 → ✏️ **Edit** → **Version** 选 **New version** → **Deploy**。
这样网址不变，不用改网站。

## 表格栏位
下单时间、订单编号、姓名、电话、方式、送货地址、取货/送货日期、订单内容、总价 (RM)、备注、状态

「状态」有下拉选单：新订单 / 已确认 / 已付款 / 已完成 / 已取消，方便你跟进。
