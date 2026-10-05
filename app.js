const MONTHS = [
  { id: "2026-10", label: "Oktober 2026" },
  { id: "2026-11", label: "November 2026" },
  { id: "2026-12", label: "Disember 2026" },
];

const OPTIONS = {
  platform: ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube Shorts"],
  format: ["Carousel", "Reels", "Static Post", "Story", "Short Video", "Thread"],
  pillar: ["Awareness", "Education", "Community", "Conversion", "Trust"],
  status: ["Draft", "Scheduled", "Live", "Revision", "Blocked"],
  approval: ["Belum Submit", "Pending", "Approved", "Revision"],
  ideaStatus: ["Review", "Approved", "Rework", "Parked"],
};

const SAMPLE_STATE = {
  activeMonth: "2026-10",
  activeView: "content",
  months: [...MONTHS],
  content: [
    {
      id: "c-001",
      month: "2026-10",
      title: "Kenapa audit media sosial penting untuk NGO",
      date: "2026-10-08",
      time: "10:00",
      platform: "Instagram",
      format: "Carousel",
      pillar: "Education",
      status: "Scheduled",
      pic: "Aina",
      approval: "Approved",
      copywriting: "Audit content bantu pasukan nampak apa yang berkesan, apa yang perlu dihentikan, dan mesej mana yang patut diulang dengan format lebih kuat.",
      cta: "DM MATA untuk dapatkan checklist audit content.",
      creativeBrief: "Carousel 6 slaid. Visual bersih, gunakan screenshot contoh metrik dan highlight 3 tanda akaun perlu audit.",
      notes: "Pastikan tone profesional tetapi mudah faham.",
      assetLink: "https://drive.google.com/",
      designLink: "https://drive.google.com/",
      livePostLink: "",
      uploadedFiles: [],
    },
    {
      id: "c-002",
      month: "2026-10",
      title: "Behind the scenes sesi content planning",
      date: "2026-10-14",
      time: "20:30",
      platform: "TikTok",
      format: "Short Video",
      pillar: "Community",
      status: "Draft",
      pic: "Hakim",
      approval: "Pending",
      copywriting: "Video pendek tunjuk proses pilih pillar, susun idea, dan set approval supaya team tak kelam-kabut.",
      cta: "Komen 'PLAN' kalau nak template ringkas.",
      creativeBrief: "Footage meja kerja, calendar view, sticky notes, dan close-up approval column.",
      notes: "Perlu rakam sebelum 10 Okt.",
      assetLink: "https://drive.google.com/",
      designLink: "",
      livePostLink: "",
      uploadedFiles: [],
    },
    {
      id: "c-003",
      month: "2026-11",
      title: "Checklist posting hujung tahun",
      date: "2026-11-05",
      time: "09:30",
      platform: "Facebook",
      format: "Static Post",
      pillar: "Awareness",
      status: "Revision",
      pic: "Mira",
      approval: "Revision",
      copywriting: "Checklist ringkas untuk kempen hujung tahun: objektif, audience, offer, creative, dan tracking.",
      cta: "Simpan post ini untuk planning Disember.",
      creativeBrief: "Single graphic dengan checklist besar dan ruang logo.",
      notes: "Tukar headline supaya lebih spesifik.",
      assetLink: "https://drive.google.com/",
      designLink: "https://drive.google.com/",
      livePostLink: "",
      uploadedFiles: [],
    },
  ],
  ideas: [
    {
      id: "i-001",
      month: "2026-10",
      title: "Mitos posting setiap hari",
      date: "2026-10-03",
      pillar: "Education",
      format: "Carousel",
      objective: "Bantu audience faham konsistensi bukan bermaksud post tanpa strategi.",
      status: "Approved",
      feedback: "Boleh jadi carousel 5 slaid dengan contoh jadual mingguan.",
      pic: "Aina",
    },
    {
      id: "i-002",
      month: "2026-10",
      title: "Template brief untuk designer",
      date: "2026-10-10",
      pillar: "Trust",
      format: "Story",
      objective: "Tunjuk cara brief yang jelas menjimatkan masa revision.",
      status: "Review",
      feedback: "Perlu tambah contoh before/after.",
      pic: "Hakim",
    },
    {
      id: "i-003",
      month: "2026-12",
      title: "Recap pencapaian komuniti 2026",
      date: "2026-12-02",
      pillar: "Community",
      format: "Reels",
      objective: "Membina kepercayaan melalui milestone dan impak.",
      status: "Approved",
      feedback: "Gabungkan visual event dan nombor impak.",
      pic: "Mira",
    },
  ],
};

const storageKey = "mata-social-dashboard-state";
const apiBaseUrl = window.MATA_CONFIG?.apiBaseUrl || "";
let state = loadState();
let editing = null;

const els = {
  monthTabs: document.querySelector("#monthTabs"),
  addMonthButton: document.querySelector("#addMonthButton"),
  contentTable: document.querySelector("#contentTable"),
  ideaTable: document.querySelector("#ideaTable"),
  contentView: document.querySelector("#contentView"),
  ideasView: document.querySelector("#ideasView"),
  activeViewTitle: document.querySelector("#activeViewTitle"),
  activeViewSubtitle: document.querySelector("#activeViewSubtitle"),
  viewTabs: document.querySelectorAll(".view-tabs button"),
  searchInput: document.querySelector("#searchInput"),
  platformFilter: document.querySelector("#platformFilter"),
  pillarFilter: document.querySelector("#pillarFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  resetFiltersButton: document.querySelector("#resetFiltersButton"),
  quickUploadButton: document.querySelector("#quickUploadButton"),
  quickUploadInput: document.querySelector("#quickUploadInput"),
  addContentButton: document.querySelector("#addContentButton"),
  addIdeaButton: document.querySelector("#addIdeaButton"),
  detailDrawer: document.querySelector("#detailDrawer"),
  drawerType: document.querySelector("#drawerType"),
  drawerTitle: document.querySelector("#drawerTitle"),
  drawerBody: document.querySelector("#drawerBody"),
  closeDrawerButton: document.querySelector("#closeDrawerButton"),
  itemDialog: document.querySelector("#itemDialog"),
  itemForm: document.querySelector("#itemForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  formFields: document.querySelector("#formFields"),
  exportButton: document.querySelector("#exportButton"),
  metrics: {
    total: document.querySelector("#metricTotal"),
    scheduled: document.querySelector("#metricScheduled"),
    approval: document.querySelector("#metricApproval"),
    ideas: document.querySelector("#metricIdeas"),
  },
};

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return structuredClone(SAMPLE_STATE);

  try {
    const parsed = JSON.parse(saved);
    return { ...structuredClone(SAMPLE_STATE), ...parsed };
  } catch {
    return structuredClone(SAMPLE_STATE);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function normalise(value) {
  return String(value || "").toLowerCase().trim();
}

function statusClass(value, prefix = "status") {
  return `${prefix}-${normalise(value).replace(/\s+/g, "-")}`;
}

function currentMonthLabel() {
  return state.months.find((month) => month.id === state.activeMonth)?.label || state.activeMonth;
}

function matchesFilters(item, isIdea = false) {
  const query = normalise(els.searchInput.value);
  const platform = els.platformFilter.value;
  const pillar = els.pillarFilter.value;
  const status = els.statusFilter.value;
  const haystack = Object.values(item).join(" ").toLowerCase();

  if (item.month !== state.activeMonth) return false;
  if (query && !haystack.includes(query)) return false;
  if (!isIdea && platform !== "Semua" && item.platform !== platform) return false;
  if (pillar !== "Semua" && item.pillar !== pillar) return false;
  if (!isIdea && status !== "Semua" && item.status !== status) return false;
  if (isIdea && status !== "Semua" && item.status !== status) return false;
  return true;
}

function render() {
  renderMonths();
  renderFilters();
  renderMetrics();
  renderTables();
  renderView();
  saveState();
}

function renderMonths() {
  els.monthTabs.innerHTML = state.months
    .map(
      (month) => `
        <button class="${month.id === state.activeMonth ? "active" : ""}" data-month="${month.id}">
          ${month.label}
        </button>
      `,
    )
    .join("");
}

function renderFilters() {
  fillSelect(els.platformFilter, ["Semua", ...OPTIONS.platform], els.platformFilter.value || "Semua");
  fillSelect(els.pillarFilter, ["Semua", ...OPTIONS.pillar], els.pillarFilter.value || "Semua");
  const statuses = state.activeView === "ideas" ? OPTIONS.ideaStatus : OPTIONS.status;
  fillSelect(els.statusFilter, ["Semua", ...statuses], els.statusFilter.value || "Semua");

  els.platformFilter.disabled = state.activeView === "ideas";
}

function fillSelect(select, items, selected) {
  const current = items.includes(selected) ? selected : "Semua";
  select.innerHTML = items.map((item) => `<option ${item === current ? "selected" : ""}>${item}</option>`).join("");
}

function renderMetrics() {
  const monthContent = state.content.filter((item) => item.month === state.activeMonth);
  const monthIdeas = state.ideas.filter((item) => item.month === state.activeMonth);
  els.metrics.total.textContent = monthContent.length;
  els.metrics.scheduled.textContent = monthContent.filter((item) => item.status === "Scheduled").length;
  els.metrics.approval.textContent = monthContent.filter((item) => item.approval !== "Approved").length;
  els.metrics.ideas.textContent = monthIdeas.filter((item) => item.status === "Approved").length;
}

function renderTables() {
  const contentRows = state.content.filter((item) => matchesFilters(item));
  els.contentTable.innerHTML = contentRows.length
    ? contentRows.map(contentRow).join("")
    : `<tr><td colspan="8" class="subtle">Tiada content untuk filter ini.</td></tr>`;

  const ideaRows = state.ideas.filter((item) => matchesFilters(item, true));
  els.ideaTable.innerHTML = ideaRows.length
    ? ideaRows.map(ideaRow).join("")
    : `<tr><td colspan="8" class="subtle">Tiada idea untuk filter ini.</td></tr>`;
}

function contentRow(item) {
  return `
    <tr data-open-content="${item.id}">
      <td><div class="title-cell">${item.title}</div><div class="subtle">${item.cta || "CTA belum diisi"}</div></td>
      <td>${formatDate(item.date)}<div class="subtle">${item.time}</div></td>
      <td>${item.platform}</td>
      <td>${item.format}</td>
      <td>${item.pillar}</td>
      <td><span class="pill ${statusClass(item.status)}">${item.status}</span></td>
      <td>${item.pic}</td>
      <td><span class="pill ${statusClass(item.approval)}">${item.approval}</span></td>
    </tr>
  `;
}

function ideaRow(item) {
  const canConvert = item.status === "Approved";
  return `
    <tr data-open-idea="${item.id}">
      <td><div class="title-cell">${item.title}</div><div class="subtle">${item.feedback || "Tiada feedback"}</div></td>
      <td>${formatDate(item.date)}</td>
      <td>${item.pillar}</td>
      <td>${item.format}</td>
      <td>${item.objective}</td>
      <td><span class="pill ${statusClass(item.status, "idea")}">${item.status}</span></td>
      <td>${item.pic}</td>
      <td>
        <div class="row-actions">
          <button class="mini-button" data-edit-idea="${item.id}">Edit</button>
          <button class="mini-button" data-convert-idea="${item.id}" ${canConvert ? "" : "disabled"}>Jadi Content</button>
        </div>
      </td>
    </tr>
  `;
}

function renderView() {
  const isContent = state.activeView === "content";
  els.contentView.classList.toggle("hidden", !isContent);
  els.ideasView.classList.toggle("hidden", isContent);
  els.activeViewTitle.textContent = isContent ? "Content Master" : "Idea Log";
  els.activeViewSubtitle.textContent = isContent
    ? `Urus posting yang sudah dirancang untuk ${currentMonthLabel()}.`
    : `Simpan dan tapis idea content untuk ${currentMonthLabel()}.`;
  els.viewTabs.forEach((button) => button.classList.toggle("active", button.dataset.view === state.activeView));
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("ms-MY", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${dateString}T00:00:00`),
  );
}

function openDrawer(type, id) {
  const item = type === "content" ? state.content.find((entry) => entry.id === id) : state.ideas.find((entry) => entry.id === id);
  if (!item) return;

  els.drawerType.textContent = type === "content" ? "Content details" : "Idea details";
  els.drawerTitle.textContent = item.title;
  els.drawerBody.innerHTML = type === "content" ? contentDetails(item) : ideaDetails(item);
  els.detailDrawer.classList.add("open");
  els.detailDrawer.setAttribute("aria-hidden", "false");
}

function contentDetails(item) {
  return `
    <div class="detail-grid">
      ${detail("Tarikh & Masa", `${formatDate(item.date)} • ${item.time}`)}
      ${detail("Platform / Format", `${item.platform} • ${item.format}`)}
      ${detail("Pillar / Status", `${item.pillar} • ${item.status}`)}
      ${detail("PIC / Approval", `${item.pic} • ${item.approval}`)}
      ${detail("Copywriting", item.copywriting)}
      ${detail("CTA", item.cta)}
      ${detail("Creative Brief", item.creativeBrief)}
      ${detail("Catatan", item.notes)}
      ${linkDetail("Link Bahan", item.assetLink)}
      ${linkDetail("Link Design", item.designLink)}
      ${linkDetail("Live Post", item.livePostLink)}
      ${fileDetails(item.uploadedFiles)}
      <button class="primary-button" data-edit-content="${item.id}">Edit Content</button>
    </div>
  `;
}

function fileDetails(files = []) {
  if (!files.length) return detail("Fail Upload", "-");

  const list = files
    .map((file) => {
      const suffix = file.status === "pending-backend" ? " (belum upload)" : file.status === "upload-failed" ? " (upload gagal)" : "";
      const label = `${escapeHtml(file.name)}${suffix}`;
      return file.url ? `<li><a href="${file.url}" target="_blank" rel="noreferrer">${label}</a></li>` : `<li>${label}</li>`;
    })
    .join("");
  return `<div class="detail-card"><span>Fail Upload</span><ul class="file-list">${list}</ul></div>`;
}

function ideaDetails(item) {
  return `
    <div class="detail-grid">
      ${detail("Tarikh", formatDate(item.date))}
      ${detail("Pillar / Format Cadangan", `${item.pillar} • ${item.format}`)}
      ${detail("Objektif", item.objective)}
      ${detail("Status Idea", item.status)}
      ${detail("Feedback", item.feedback)}
      ${detail("PIC", item.pic)}
      <button class="primary-button" data-edit-idea="${item.id}">Edit Idea</button>
      ${item.status === "Approved" ? `<button class="secondary-button" data-convert-idea="${item.id}">Jadikan Content Master</button>` : ""}
    </div>
  `;
}

function detail(label, value) {
  return `<div class="detail-card"><span>${label}</span><p>${value || "-"}</p></div>`;
}

function linkDetail(label, href) {
  if (!href) return detail(label, "-");
  return `<div class="detail-card"><span>${label}</span><a href="${href}" target="_blank" rel="noreferrer">${href}</a></div>`;
}

function closeDrawer() {
  els.detailDrawer.classList.remove("open");
  els.detailDrawer.setAttribute("aria-hidden", "true");
}

function openForm(type, id = null) {
  editing = { type, id };
  const collection = type === "content" ? state.content : state.ideas;
  const item = id ? collection.find((entry) => entry.id === id) : defaultsFor(type);

  els.dialogTitle.textContent = `${id ? "Edit" : "Tambah"} ${type === "content" ? "Content" : "Idea"}`;
  els.formFields.innerHTML = type === "content" ? contentForm(item).join("") : ideaForm(item).join("");
  els.itemDialog.showModal();
}

function defaultsFor(type) {
  const today = new Date().toISOString().slice(0, 10);
  if (type === "content") {
    return {
      month: state.activeMonth,
      title: "",
      date: today,
      time: "09:00",
      platform: "Instagram",
      format: "Carousel",
      pillar: "Education",
      status: "Draft",
      pic: "",
      approval: "Belum Submit",
      copywriting: "",
      cta: "",
      creativeBrief: "",
      notes: "",
      assetLink: "",
      designLink: "",
      livePostLink: "",
      uploadedFiles: [],
    };
  }
  return {
    month: state.activeMonth,
    title: "",
    date: today,
    pillar: "Education",
    format: "Carousel",
    objective: "",
    status: "Review",
    feedback: "",
    pic: "",
  };
}

function input(name, label, value, type = "text", full = false) {
  return `<label class="${full ? "full" : ""}">${label}<input name="${name}" type="${type}" value="${escapeHtml(value || "")}" /></label>`;
}

function fileInput(name, label, helper) {
  return `
    <label class="full file-field">
      ${label}
      <input name="${name}" type="file" multiple />
      <span class="field-help">${helper}</span>
    </label>
  `;
}

function area(name, label, value) {
  return `<label class="full">${label}<textarea name="${name}">${escapeHtml(value || "")}</textarea></label>`;
}

function select(name, label, value, items) {
  return `
    <label>${label}
      <select name="${name}">
        ${items.map((item) => `<option ${item === value ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
  `;
}

function contentForm(item) {
  return [
    input("title", "Tajuk Content", item.title, "text", true),
    input("date", "Tarikh Posting", item.date, "date"),
    input("time", "Masa Posting", item.time, "time"),
    select("platform", "Platform", item.platform, OPTIONS.platform),
    select("format", "Format", item.format, OPTIONS.format),
    select("pillar", "Pillar", item.pillar, OPTIONS.pillar),
    select("status", "Status", item.status, OPTIONS.status),
    input("pic", "PIC", item.pic),
    select("approval", "Approval", item.approval, OPTIONS.approval),
    area("copywriting", "Copywriting", item.copywriting),
    area("cta", "CTA", item.cta),
    area("creativeBrief", "Creative Brief", item.creativeBrief),
    area("notes", "Catatan", item.notes),
    input("assetLink", "Link Bahan Google Drive", item.assetLink, "url", true),
    input("designLink", "Link Design", item.designLink, "url", true),
    input("livePostLink", "Link Live Post", item.livePostLink, "url", true),
    fileInput("attachments", "Upload bahan / creative", apiBaseUrl ? "Fail akan dihantar ke Google Drive selepas simpan." : "Backend belum aktif. Buat masa ini nama fail direkod sebagai draft sahaja."),
  ];
}

function ideaForm(item) {
  return [
    input("title", "Tajuk Idea", item.title, "text", true),
    input("date", "Tarikh", item.date, "date"),
    select("pillar", "Pillar", item.pillar, OPTIONS.pillar),
    select("format", "Format Cadangan", item.format, OPTIONS.format),
    area("objective", "Objektif", item.objective),
    select("status", "Status Idea", item.status, OPTIONS.ideaStatus),
    area("feedback", "Feedback", item.feedback),
    input("pic", "PIC", item.pic),
  ];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function submitForm(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();

  const formData = new FormData(els.itemForm);
  const payload = Object.fromEntries(formData.entries());
  const attachmentFiles = formData.getAll("attachments").filter((file) => file instanceof File && file.size > 0);
  delete payload.attachments;
  const collectionName = editing.type === "content" ? "content" : "ideas";
  const collection = state[collectionName];
  const uploadedFiles = editing.type === "content" ? await uploadFiles(attachmentFiles, payload.title || "Content") : [];

  if (editing.id) {
    const index = collection.findIndex((entry) => entry.id === editing.id);
    collection[index] = {
      ...collection[index],
      ...payload,
      uploadedFiles: [...(collection[index].uploadedFiles || []), ...uploadedFiles],
    };
    await syncRecord(collection[index], editing.type);
  } else {
    const newRecord = {
      ...defaultsFor(editing.type),
      ...payload,
      id: `${editing.type[0]}-${Date.now()}`,
      month: state.activeMonth,
      uploadedFiles,
    };
    collection.unshift(newRecord);
    await syncRecord(newRecord, editing.type);
  }

  els.itemDialog.close();
  closeDrawer();
  render();
}

async function quickUpload() {
  const files = [...els.quickUploadInput.files].filter((file) => file.size > 0);
  if (!files.length) return;

  const uploadedFiles = await uploadFiles(files, `Upload terus ${currentMonthLabel()}`);
  if (!uploadedFiles.length) return;

  const newRecord = {
    ...defaultsFor("content"),
    id: `c-${Date.now()}`,
    title: uploadedFiles.length === 1 ? uploadedFiles[0].name : `${uploadedFiles.length} fail baru`,
    creativeBrief: "Fail dimuat naik melalui butang Upload File.",
    notes: apiBaseUrl ? "Fail telah dihantar ke Google Drive." : "Backend belum aktif. Nama fail direkod sementara sahaja.",
    uploadedFiles,
    assetLink: uploadedFiles[0]?.url || "",
  };

  state.content.unshift(newRecord);
  state.activeView = "content";
  els.quickUploadInput.value = "";
  await syncRecord(newRecord, "content");
  render();
}

async function uploadFiles(files, contextTitle) {
  if (!files.length) return [];

  if (!apiBaseUrl) {
    alert("Backend Google Drive belum disambungkan. Fail belum diupload, tetapi nama fail akan direkod dalam draft.");
    return files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      url: "",
      status: "pending-backend",
    }));
  }

  const uploaded = [];
  for (const file of files) {
    try {
      const result = await postToBackend({
        action: "uploadFile",
        month: currentMonthLabel(),
        contextTitle,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        data: await fileToBase64(file),
      });
      uploaded.push({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: result.fileUrl || "",
        fileId: result.fileId || "",
        status: "uploaded",
      });
    } catch (error) {
      alert(`Upload ${file.name} gagal. Nama fail disimpan sebagai draft: ${error.message}`);
      uploaded.push({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: "",
        status: "upload-failed",
      });
    }
  }
  return uploaded;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function syncRecord(record, type) {
  if (!apiBaseUrl) return;
  try {
    await postToBackend({
      action: type === "content" ? "saveContent" : "saveIdea",
      record,
    });
  } catch (error) {
    alert(`Data disimpan sebagai draft dalam browser, tetapi sync ke backend gagal: ${error.message}`);
  }
}

async function postToBackend(payload) {
  const response = await fetch(apiBaseUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || result.ok === false) {
    throw new Error(result.error || "Backend request failed");
  }
  return result;
}

async function convertIdea(id) {
  const idea = state.ideas.find((entry) => entry.id === id);
  if (!idea) return;

  const newRecord = {
    ...defaultsFor("content"),
    id: `c-${Date.now()}`,
    month: idea.month,
    title: idea.title,
    date: idea.date,
    format: idea.format,
    pillar: idea.pillar,
    pic: idea.pic,
    ideaId: idea.id,
    creativeBrief: idea.objective,
    notes: `Dari Idea Log. Feedback: ${idea.feedback || "-"}`,
  };
  state.content.unshift(newRecord);
  state.activeMonth = idea.month;
  state.activeView = "content";
  closeDrawer();
  await syncRecord(newRecord, "content");
  render();
}

function addMonth() {
  const label = prompt("Masukkan nama bulan, contoh: Januari 2027");
  if (!label) return;
  const id = label.toLowerCase().replace(/\s+/g, "-");
  state.months.push({ id, label });
  state.activeMonth = id;
  render();
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mata-social-media-data-contoh.json";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const monthButton = event.target.closest("[data-month]");
  if (monthButton) {
    state.activeMonth = monthButton.dataset.month;
    render();
    return;
  }

  const contentRowElement = event.target.closest("[data-open-content]");
  if (contentRowElement && !event.target.closest("button")) {
    openDrawer("content", contentRowElement.dataset.openContent);
    return;
  }

  const ideaRowElement = event.target.closest("[data-open-idea]");
  if (ideaRowElement && !event.target.closest("button")) {
    openDrawer("idea", ideaRowElement.dataset.openIdea);
    return;
  }

  const editContent = event.target.closest("[data-edit-content]");
  if (editContent) {
    openForm("content", editContent.dataset.editContent);
    return;
  }

  const editIdea = event.target.closest("[data-edit-idea]");
  if (editIdea) {
    openForm("idea", editIdea.dataset.editIdea);
    return;
  }

  const convert = event.target.closest("[data-convert-idea]");
  if (convert && !convert.disabled) {
    convertIdea(convert.dataset.convertIdea);
  }
});

els.viewTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeView = button.dataset.view;
    els.statusFilter.value = "Semua";
    render();
  });
});

[els.searchInput, els.platformFilter, els.pillarFilter, els.statusFilter].forEach((inputElement) => {
  inputElement.addEventListener("input", render);
});

els.resetFiltersButton.addEventListener("click", () => {
  els.searchInput.value = "";
  els.platformFilter.value = "Semua";
  els.pillarFilter.value = "Semua";
  els.statusFilter.value = "Semua";
  render();
});

els.addContentButton.addEventListener("click", () => openForm("content"));
els.addIdeaButton.addEventListener("click", () => openForm("idea"));
els.quickUploadButton.addEventListener("click", () => els.quickUploadInput.click());
els.quickUploadInput.addEventListener("change", quickUpload);
els.addMonthButton.addEventListener("click", addMonth);
els.closeDrawerButton.addEventListener("click", closeDrawer);
els.detailDrawer.addEventListener("click", (event) => {
  if (event.target === els.detailDrawer) closeDrawer();
});
els.itemForm.addEventListener("submit", submitForm);
els.exportButton.addEventListener("click", exportState);

render();
