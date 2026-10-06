const SPREADSHEET_ID = "1jt_U2Muw7ZhofPnojPlLH6jgpMaqINwESZJgnczdZ8s";
const DRIVE_FOLDER_ID = "1cBV8U1l1SF5XbT-FIBOkgjmWOyzWyzB0";

const MONTH_SHEETS = {
  "2026-10": "Oktober 2026",
  "2026-11": "November 2026",
  "2026-12": "Disember 2026",
};

const CONTENT = {
  startRow: 7,
  endRow: 60,
  width: 24,
};

const IDEAS = {
  startRow: 63,
  endRow: 200,
  width: 11,
};

function doGet() {
  return json({
    ok: true,
    app: "Posting Social Media MATA API",
    sheet: SPREADSHEET_ID,
    uploadFolder: DRIVE_FOLDER_ID,
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (payload.action === "uploadFile") {
      return json(uploadFile(payload));
    }

    if (payload.action === "saveContent") {
      return json(saveContent(payload.record));
    }

    if (payload.action === "saveIdea") {
      return json(saveIdea(payload.record));
    }

    if (payload.action === "deleteContent") {
      return json(deleteContent(payload.record));
    }

    if (payload.action === "deleteIdea") {
      return json(deleteIdea(payload.record));
    }

    if (payload.action === "listMonth") {
      return json(listMonth(payload.month));
    }

    return json({ ok: false, error: "Unknown action: " + payload.action });
  } catch (error) {
    return json({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // Lock may not have been acquired.
    }
  }
}

function uploadFile(payload) {
  requireFields(payload, ["fileName", "mimeType", "data"]);

  const folder = getUploadFolder(payload.month);
  const bytes = Utilities.base64Decode(payload.data);
  const safeName = buildSafeFileName(payload.fileName, payload.contextTitle);
  const blob = Utilities.newBlob(bytes, payload.mimeType, safeName);
  const file = folder.createFile(blob);

  return {
    ok: true,
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    name: file.getName(),
  };
}

function saveContent(record) {
  requireFields(record, ["id", "month"]);

  const sheet = getMonthSheet(record.month);
  const rowValues = toContentRow(record);
  const rowNumber = upsertRowById(sheet, record.id, CONTENT.startRow, CONTENT.endRow, rowValues);

  return {
    ok: true,
    type: "content",
    sheetName: sheet.getName(),
    rowNumber,
    id: record.id,
  };
}

function saveIdea(record) {
  requireFields(record, ["id", "month"]);

  const sheet = getMonthSheet(record.month);
  const rowValues = toIdeaRow(record);
  const rowNumber = upsertRowById(sheet, record.id, IDEAS.startRow, IDEAS.endRow, rowValues);

  return {
    ok: true,
    type: "idea",
    sheetName: sheet.getName(),
    rowNumber,
    id: record.id,
  };
}

function deleteContent(record) {
  requireFields(record, ["id", "month"]);

  const sheet = getMonthSheet(record.month);
  const rowNumber = clearRowById(sheet, record.id, CONTENT.startRow, CONTENT.endRow, CONTENT.width);
  const trashedFiles = trashUploadedFiles(record.uploadedFiles || []);

  return {
    ok: true,
    type: "content",
    sheetName: sheet.getName(),
    rowNumber,
    trashedFiles,
    id: record.id,
  };
}

function deleteIdea(record) {
  requireFields(record, ["id", "month"]);

  const sheet = getMonthSheet(record.month);
  const rowNumber = clearRowById(sheet, record.id, IDEAS.startRow, IDEAS.endRow, IDEAS.width);

  return {
    ok: true,
    type: "idea",
    sheetName: sheet.getName(),
    rowNumber,
    id: record.id,
  };
}

function listMonth(month) {
  const sheet = getMonthSheet(month);

  return {
    ok: true,
    sheetName: sheet.getName(),
    content: readContent(sheet),
    ideas: readIdeas(sheet),
  };
}

function toContentRow(record) {
  const uploadedFiles = record.uploadedFiles || [];
  const uploadedFileLinks = uploadedFiles.map((file) => file.url || file.name).filter(Boolean).join("\n");

  return padRow([
    record.id || "",
    record.date || "",
    record.time || "",
    record.title || "",
    record.platform || "",
    record.format || "",
    record.pillar || "",
    record.status || "",
    uploadedFileLinks || record.assetLink || "",
    record.copywriting || "",
    record.cta || "",
    record.pic || "",
    record.approval || "",
    record.creativeBrief || "",
    record.assetLink || "",
    record.sourceUrl || "",
    record.designLink || "",
    record.finalCreativeUrl || "",
    record.livePostLink || "",
    record.notes || "",
    record.approver || "",
    record.approvalDate || "",
    record.ideaId || "",
    record.nextAction || "",
  ], CONTENT.width);
}

function toIdeaRow(record) {
  return padRow([
    record.id || "",
    record.date || "",
    record.status || "",
    record.title || "",
    record.pillar || "",
    record.format || "",
    record.objective || "",
    record.feedback || "",
    record.pic || "",
    record.referenceUrl || "",
    record.contentId || "",
  ], IDEAS.width);
}

function readContent(sheet) {
  const values = sheet.getRange(CONTENT.startRow, 1, CONTENT.endRow - CONTENT.startRow + 1, CONTENT.width).getValues();

  return values
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      date: formatSheetDate(row[1]),
      time: row[2],
      title: row[3],
      platform: row[4],
      format: row[5],
      pillar: row[6],
      status: row[7],
      creative: row[8],
      copywriting: row[9],
      cta: row[10],
      pic: row[11],
      approval: row[12],
      creativeBrief: row[13],
      assetLink: row[14],
      sourceUrl: row[15],
      designLink: row[16],
      finalCreativeUrl: row[17],
      livePostLink: row[18],
      notes: row[19],
      approver: row[20],
      approvalDate: formatSheetDate(row[21]),
      ideaId: row[22],
      nextAction: row[23],
    }));
}

function readIdeas(sheet) {
  const values = sheet.getRange(IDEAS.startRow, 1, IDEAS.endRow - IDEAS.startRow + 1, IDEAS.width).getValues();

  return values
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      date: formatSheetDate(row[1]),
      status: row[2],
      title: row[3],
      pillar: row[4],
      format: row[5],
      objective: row[6],
      feedback: row[7],
      pic: row[8],
      referenceUrl: row[9],
      contentId: row[10],
    }));
}

function upsertRowById(sheet, id, startRow, endRow, rowValues) {
  const rowNumber = findRowById(sheet, id, startRow, endRow) || findFirstEmptyRow(sheet, startRow, endRow);

  if (!rowNumber) {
    throw new Error("No empty row available in " + sheet.getName());
  }

  sheet.getRange(rowNumber, 1, 1, rowValues.length).setValues([rowValues]);
  return rowNumber;
}

function clearRowById(sheet, id, startRow, endRow, width) {
  const rowNumber = findRowById(sheet, id, startRow, endRow);

  if (!rowNumber) {
    throw new Error("Record not found: " + id);
  }

  sheet.getRange(rowNumber, 1, 1, width).clearContent();
  return rowNumber;
}

function trashUploadedFiles(files) {
  const trashed = [];

  files.forEach((file) => {
    const fileId = file.fileId || extractDriveFileId(file.url);
    if (!fileId) return;

    try {
      DriveApp.getFileById(fileId).setTrashed(true);
      trashed.push(fileId);
    } catch (error) {
      // Keep deleting the sheet record even if a Drive file cannot be trashed.
    }
  });

  return trashed;
}

function extractDriveFileId(url) {
  if (!url) return "";

  const text = String(url);
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (let i = 0; i < patterns.length; i += 1) {
    const match = text.match(patterns[i]);
    if (match) return match[1];
  }

  return "";
}

function findRowById(sheet, id, startRow, endRow) {
  if (!id) return null;

  const values = sheet.getRange(startRow, 1, endRow - startRow + 1, 1).getValues();
  const index = values.findIndex((row) => row[0] === id);

  return index >= 0 ? startRow + index : null;
}

function findFirstEmptyRow(sheet, startRow, endRow) {
  const values = sheet.getRange(startRow, 1, endRow - startRow + 1, 1).getValues();
  const index = values.findIndex((row) => !row[0]);

  return index >= 0 ? startRow + index : null;
}

function getMonthSheet(monthIdOrLabel) {
  const sheetName = MONTH_SHEETS[monthIdOrLabel] || monthIdOrLabel;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found: " + sheetName);
  }

  return sheet;
}

function getUploadFolder(monthIdOrLabel) {
  const root = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const monthName = MONTH_SHEETS[monthIdOrLabel] || monthIdOrLabel || "Unsorted";
  const folders = root.getFoldersByName(monthName);

  if (folders.hasNext()) {
    return folders.next();
  }

  return root.createFolder(monthName);
}

function buildSafeFileName(fileName, contextTitle) {
  const timestamp = Utilities.formatDate(new Date(), "Asia/Kuala_Lumpur", "yyyyMMdd-HHmmss");
  const cleanContext = cleanFileSegment(contextTitle || "MATA");
  const cleanName = cleanFileSegment(fileName || "upload");

  return timestamp + " - " + cleanContext + " - " + cleanName;
}

function cleanFileSegment(value) {
  return String(value)
    .replace(/[\\/:*?"<>|#%{}~&]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function requireFields(object, fields) {
  fields.forEach((field) => {
    if (!object || object[field] === undefined || object[field] === null || object[field] === "") {
      throw new Error("Missing required field: " + field);
    }
  });
}

function padRow(values, width) {
  const row = values.slice(0, width);
  while (row.length < width) row.push("");
  return row;
}

function formatSheetDate(value) {
  if (!value) return "";

  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, "Asia/Kuala_Lumpur", "yyyy-MM-dd");
  }

  return value;
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
