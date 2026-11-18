/**
 * 云惹坊订单 → Google Sheet
 *
 * 用法（详细步骤见 apps-script/README.md）：
 * 1. 在 Google Sheet 里：扩展程序 → Apps Script，把这整个文件贴进去
 * 2. 项目设置 → 脚本属性，新增 ORDER_SECRET（值和网站 .env.local 里的 ORDER_SHEET_SECRET 一样）
 * 3. 选择函数 setup → 运行一次（会建好「订单」工作表和表头）
 * 4. 部署 → 新部署 → 网页应用：以「我」的身份执行、谁可以访问选「任何人」
 * 5. 把网页应用网址填进网站 .env.local 的 ORDER_SHEET_URL
 */

const SHEET_NAME = "订单";
const TIMEZONE = "Asia/Kuala_Lumpur";
const STATUSES = ["新订单", "已确认", "已付款", "已完成", "已取消"];
const HEADERS = [
  "下单时间",
  "订单编号",
  "姓名",
  "电话",
  "方式",
  "送货地址",
  "取货/送货日期",
  "订单内容",
  "总价 (RM)",
  "备注",
  "状态",
];

/** 网站每下一张单，就会 POST 到这里 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = (PropertiesService.getScriptProperties().getProperty("ORDER_SECRET") || "").trim();
    if (!secret || String(data.secret || "").trim() !== secret) return json_({ ok: false, error: "unauthorized" });

    const o = data.order || {};
    const row = [
      Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm"),
      text_(o.orderId),
      text_(o.name),
      text_(o.phone),
      o.method === "delivery" ? "送货" : "自取",
      text_(o.address),
      text_(o.date),
      text_(o.items),
      Number(o.total) || 0,
      text_(o.note),
      STATUSES[0],
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** 用浏览器打开网页应用网址时显示这个，方便确认部署成功 */
function doGet() {
  return json_({ ok: true, service: "wan-nyonya-orders" });
}

/** 第一次手动运行：建好工作表、表头、状态下拉选单 */
function setup() {
  const sheet = getSheet_();
  const status = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  sheet.getRange(2, HEADERS.length, sheet.getMaxRows() - 1, 1).setDataValidation(status);
  sheet.setColumnWidth(8, 320);
  sheet.setColumnWidth(6, 220);
}

/**
 * 暗号自检：在编辑器选 checkSecret → Run，看下方 Execution log。
 * 不会显示暗号本身，只显示有没有设、长度、有没有多余的字。
 */
function checkSecret() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const names = Object.keys(props);
  Logger.log("现有的脚本属性名称：" + (names.length ? names.join(", ") : "（一个都没有）"));
  const v = props.ORDER_SECRET;
  if (v == null) {
    Logger.log("❌ 找不到 ORDER_SECRET。请检查属性名称拼写（全大写、下划线），并按 Save script properties。");
    return;
  }
  Logger.log("找到 ORDER_SECRET，长度：" + v.length + "（应该是 32）");
  if (v !== v.trim()) Logger.log("⚠️ 前后有空格或换行");
  if (v.indexOf("=") >= 0) Logger.log("⚠️ 里面有等号，可能把 ORDER_SHEET_SECRET= 也贴进去了");
  if (v.trim().length === 32 && v.indexOf("=") < 0) Logger.log("✅ 格式看起来正确");
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#f6d5df");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * 存成纯文字：
 * - 开头加 ' 避免电话的 0 被吃掉
 * - 避免客人填 = + - @ 开头的内容被当成公式执行
 */
function text_(v) {
  const s = String(v == null ? "" : v).slice(0, 1000);
  return s ? "'" + s : "";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
