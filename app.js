const PHOTO_FILES = [
  "00e9bf9d8fbc7799a5381bb1cab72d8b_720.jpeg",
  "049911c1a2168727acde57de8e5aecbe_720.jpg",
  "189168cbb15e8658e6136c9ccffa9e9f_720.jpg",
  "2451999561ad4c623090f38dff24adda.jpeg",
  "25b9009f2b0f1c42750a11dcf8638b71_720.jpeg",
  "2af03a4a4c098217626cfd52a2b51b73_720.jpeg",
  "2b121b5fb7ae6569664f286a78f37356_720.jpeg",
  "2e78ac6e72e487c41dd7aaf5a43de5cf_720.jpeg",
  "33fb69e169e25bd9fb7de6d2c229ee7c_720.jpg",
  "424adfd26630ceef3746fe1b41e07b9e_720.jpeg",
  "452bb169b63508d75b00754a4f2099cc_720.jpeg",
  "4f2dbc62d1e8e04f4ba8df12519721e3_720.jpeg",
  "4f85000970dd020e958b3fd587203928_720.jpeg",
  "5d17fa6f452c5bafa231d2da90cc50f5_720.jpg",
  "5efcb963849ee63ce4c1469b11e69d0a_720.jpeg",
  "602e50c6af48c7bced1875f5b090f777_720.jpg",
  "623f4438e1f6bfb447b335f77e8bf98f_720.jpeg",
  "65c6148a22ad4214031a6d114afd2975_720.jpeg",
  "6adf54bd200a37febea5e14fec396c24_720.jpeg",
  "6c19cea2654868abf509930d82867818_720.jpeg",
  "7028a6130b255a71a44708a9ead83064_720.jpeg",
  "7489be510ba76dae651da5490e4d760c_720.jpeg",
  "74a9c467fc309eb03c54a451b2943747_720.jpg",
  "75a5aeb3f9e34172f63a8ff20d1b17c8_720.jpg",
  "76ccf936363e8ba6f9ba20bbef2e0ece_720.jpg",
  "7a16a98ee475eb1355e37caa91912154_720.jpeg",
  "7cc0cc240a87e422ac80953ee8a3bf13_720.jpeg",
  "825200f5419590b18eb39a1fd8f89aaf_720.jpeg",
  "9069efbc0f46cedb863819d1eca1630a.jpeg",
  "9c3b6cbc6a43ac7d81c9f4898ae61a7e_720.jpg",
  "abd795ef299e00b7143d68a52a0beaba_720.jpeg",
  "ad563c33899696860b5a68d88d962743_720.jpeg",
  "b8986ad0194bec0122cd79eb38602c6d_720.jpeg",
  "bac6ae2835cf2eede95bf15d5345bcec_720.jpg",
  "c7b9a5111e38e4f980140b4130bceaa0_720.jpeg",
  "c807a80cd2e52da55dcae6647ace16b4_720.jpeg",
  "cdce5f64c49f68e0e7ae4eeaf23934ac_720.jpeg",
  "d2c8a2027b5a3f700e903fc46d633a0a_720.jpg",
  "e05263dc6e5d4d6df2dd2fec46b58694_720.jpeg",
  "e9aea01dbbf054538aec114b55784eec_720.jpg",
  "ef8e85fead80002c9d19a3b237e488e6_720.jpg",
  "f593998a62fc5a1a65075425adab5c8d_720.jpeg",
  "ffb2e17879ab91c05edcacb6d4ffabbc.jpeg",
];

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const video = document.getElementById("camera");
const statusEl = document.getElementById("status");
const cameraButton = document.getElementById("cameraButton");
const gestureBadge = document.getElementById("gestureBadge");
const accessGate = document.getElementById("accessGate");
const viewerLoginForm = document.getElementById("viewerLoginForm");
const viewerEmailInput = document.getElementById("viewerEmailInput");
const accessStatusEl = document.getElementById("accessStatus");
const adminForm = document.getElementById("adminForm");
const adminEmailInput = document.getElementById("adminEmailInput");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const cloudStatusEl = document.getElementById("cloudStatus");
const uploadPhotoButton = document.getElementById("uploadPhotoButton");
const capturePhotoButton = document.getElementById("capturePhotoButton");
const photoUploadInput = document.getElementById("photoUploadInput");
const photoCaptureInput = document.getElementById("photoCaptureInput");
const photoCountEl = document.getElementById("photoCount");
const photoList = document.getElementById("photoList");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messageList = document.getElementById("messageList");
const dayForm = document.getElementById("dayForm");
const dayTitleInput = document.getElementById("dayTitleInput");
const dayDateInput = document.getElementById("dayDateInput");
const dayList = document.getElementById("dayList");
const USE_STATIC_SCENE = true;
const LOW_POWER = true;
const FRAME_INTERVAL_MS = 16;
const HAND_INTERVAL_MS = 95;
const SUPABASE_URL = "https://xlqlioiqtgcxbznxkzxh.supabase.co";
const SUPABASE_KEY = "sb_publishable_hV5MSIwmarO19BTsyPMuAQ_3YnQ72NS";
const SUPABASE_BUCKET = "memories";
const MESSAGE_KEY = "meteor-love-field.messages";
const DAY_KEY = "meteor-love-field.days";
const PHOTO_DB_NAME = "meteor-love-field";
const PHOTO_STORE_NAME = "photos";

const state = {
  width: 0,
  height: 0,
  dpr: 1,
  time: 0,
  lastRenderMs: 0,
  mode: "idle",
  stableGesture: "idle",
  candidateGesture: "idle",
  candidateCount: 0,
  cameraReady: false,
  wind: 0,
  photoIndex: 0,
  pinchShow: null,
  textParticles: [],
  textTarget: "",
  textMode: "",
  textGlow: 0,
  textStartedAt: 0,
  textCache: {},
  balloons: [],
  balloonStartedAt: 0,
  fireworks: [],
  userPhotoCount: 0,
  messages: [],
  days: [],
  session: null,
  authorized: false,
  canManage: false,
  started: false,
};

const photos = [];
const bundledPhotos = [];
const cloudPhotos = [];
const stars = [];
const meteors = [];
const grass = [];
const breezeHair = [];
const loadedScripts = new Map();
let supabaseClient = null;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function skyLimit() {
  return state.height * 0.705;
}

function groundLine() {
  return state.height * 0.78;
}

function photoPoolCount() {
  return Math.max(photos.length, 1);
}

function rebuildPhotoPool() {
  photos.length = 0;
  cloudPhotos.forEach((photo) => {
    if (photo.image) photos.push(photo.image);
  });
  bundledPhotos.forEach((image) => {
    if (image) photos.push(image);
  });
  state.userPhotoCount = cloudPhotos.length;
  updatePhotoCount();
}

function loadPhotos() {
  let index = 0;
  const loadNext = () => {
    if (index >= PHOTO_FILES.length) return;
    const file = PHOTO_FILES[index];
    const current = index;
    index += 1;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      bundledPhotos[current] = image;
      rebuildPhotoPool();
      window.setTimeout(loadNext, 35);
    };
    image.onerror = () => {
      window.setTimeout(loadNext, 35);
    };
    image.src = `./${file}`;
  };
  loadNext();
}

function createImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function openPhotoDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(PHOTO_STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStoredPhotos() {
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE_NAME, "readonly");
    const request = transaction.objectStore(PHOTO_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function putStoredPhoto(photo) {
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE_NAME, "readwrite");
    const request = transaction.objectStore(PHOTO_STORE_NAME).put(photo);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
}

function updatePhotoCount() {
  photoCountEl.textContent = `云端相册 ${state.userPhotoCount} 张照片`;
}

async function addUserPhoto(dataUrl) {
  const image = await createImage(dataUrl);
  photos.push(image);
  state.userPhotoCount += 1;
  updatePhotoCount();
}

async function loadUserPhotos() {
  try {
    const stored = await getStoredPhotos();
    stored.sort((a, b) => a.createdAt - b.createdAt);
    for (const photo of stored) {
      await addUserPhoto(photo.dataUrl);
    }
  } catch (error) {
    console.warn("Failed to load saved photos", error);
  }
}

async function compressPhoto(file) {
  const src = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await createImage(src);
  const maxEdge = 1280;
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  offscreen.getContext("2d").drawImage(image, 0, 0, width, height);
  return offscreen.toDataURL("image/jpeg", 0.82);
}

async function handlePhotoFiles(files) {
  const list = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
  if (!list.length) return;
  if (!state.canManage) {
    setCloudStatus("只有管理者可以上传照片。");
    return;
  }
  updateStatus("正在把照片上传到私密云端相册...");
  for (const file of list) {
    await uploadCloudPhoto(file);
  }
  await loadCloudPhotos();
  updateStatus("新照片已加入流星和气球互动。");
}

function loadScript(src) {
  if (loadedScripts.has(src)) return loadedScripts.get(src);
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Script failed: ${src}`));
    document.head.appendChild(script);
  });
  loadedScripts.set(src, promise);
  return promise;
}

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

function setAccessStatus(text) {
  if (accessStatusEl) accessStatusEl.textContent = text;
}

function setCloudStatus(text) {
  if (cloudStatusEl) cloudStatusEl.textContent = text;
}

function authRedirectUrl() {
  return window.location.href.split("#")[0].split("?")[0];
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function dayDistanceText(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateString}T00:00:00`);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return "就是今天";
  if (diff > 0) return `还有 ${diff} 天`;
  return `已经 ${Math.abs(diff)} 天`;
}

function dataUrlToBlob(dataUrl) {
  const [header, body] = dataUrl.split(",");
  const mime = (header.match(/data:(.*);base64/) || [])[1] || "image/jpeg";
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

function randomId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderAuthState() {
  const email = normalizeEmail(state.session && state.session.user && state.session.user.email);
  document.querySelectorAll(".manage-only").forEach((element) => {
    element.hidden = !state.canManage;
  });

  if (adminForm) adminForm.hidden = !!state.session;
  if (adminLogoutButton) adminLogoutButton.hidden = !state.session;

  if (!state.session) {
    setCloudStatus("请先用受邀邮箱登录。");
  } else if (!state.authorized) {
    setCloudStatus("这个邮箱还没有被邀请，暂时不能进入。");
  } else if (state.canManage) {
    setCloudStatus(`${email} 已进入私密模式，可以上传和删除。`);
  } else {
    setCloudStatus(`${email} 已进入私密模式，可以浏览和留言。`);
  }
}

async function sendLoginLink(email) {
  const client = await getSupabaseClient();
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return;
  setAccessStatus("正在发送登录邮件...");
  setCloudStatus("正在发送登录邮件...");
  const { error } = await client.auth.signInWithOtp({
    email: cleanEmail,
    options: { emailRedirectTo: authRedirectUrl() },
  });
  if (error) throw error;
  setAccessStatus("登录链接已发送，请去邮箱里点开它。");
  setCloudStatus("登录链接已发送，请去邮箱里点开它。");
}

async function fetchViewerProfile() {
  const client = await getSupabaseClient();
  const email = normalizeEmail(state.session && state.session.user && state.session.user.email);
  if (!email) return null;
  const { data, error } = await client
    .from("allowed_viewers")
    .select("email, can_manage")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

function lockPrivateScene(message) {
  if (accessGate) accessGate.hidden = false;
  document.body.classList.add("locked");
  state.authorized = false;
  state.canManage = false;
  renderAuthState();
  if (message) setAccessStatus(message);
}

function unlockPrivateScene() {
  if (accessGate) accessGate.hidden = true;
  document.body.classList.remove("locked");
  if (!state.started) {
    state.started = true;
    loadPhotos();
    resize();
    updateStatus("点击开启摄像头，然后对着镜头做手势。");
    requestAnimationFrame(tick);
  }
}

async function applySession(session) {
  state.session = session || null;
  if (!session) {
    lockPrivateScene("输入受邀邮箱后，点邮件里的登录链接进入。");
    renderPhotoList();
    renderMessages();
    renderDays();
    return;
  }

  try {
    const profile = await fetchViewerProfile();
    if (!profile) {
      lockPrivateScene("这个邮箱还没在邀请名单里。");
      return;
    }
    state.authorized = true;
    state.canManage = !!profile.can_manage;
    renderAuthState();
    unlockPrivateScene();
    setAccessStatus("已进入私密纪念网页。");
    await Promise.all([loadCloudPhotos(), loadCloudMessages(), loadCloudDays()]);
  } catch (error) {
    console.error(error);
    lockPrivateScene("云端权限表还没配置好，先去 Supabase 运行我给你的 SQL。");
  }
}

async function initPrivateCloud() {
  try {
    const client = await getSupabaseClient();
    const {
      data: { session },
    } = await client.auth.getSession();
    await applySession(session);
    client.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });
  } catch (error) {
    console.error(error);
    lockPrivateScene("无法连接 Supabase，请检查网络和项目配置。");
  }
}

async function uploadCloudPhoto(file) {
  const client = await getSupabaseClient();
  const dataUrl = await compressPhoto(file);
  const blob = dataUrlToBlob(dataUrl);
  const path = `photos/${Date.now()}-${randomId()}.jpg`;
  const upload = await client.storage.from(SUPABASE_BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    cacheControl: "3600",
    upsert: false,
  });
  if (upload.error) throw upload.error;
  const insert = await client.from("memory_photos").insert({ storage_path: path });
  if (insert.error) {
    await client.storage.from(SUPABASE_BUCKET).remove([path]);
    throw insert.error;
  }
}

async function loadCloudPhotos() {
  if (!state.authorized) return;
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("memory_photos")
    .select("id, storage_path, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = data || [];
  const paths = rows.map((row) => row.storage_path);
  let signedUrls = [];
  if (paths.length) {
    const signed = await client.storage.from(SUPABASE_BUCKET).createSignedUrls(paths, 3600);
    if (signed.error) throw signed.error;
    signedUrls = signed.data || [];
  }

  cloudPhotos.length = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const signedUrl = signedUrls[i] && signedUrls[i].signedUrl;
    if (!signedUrl) continue;
    try {
      const image = await createImage(signedUrl);
      cloudPhotos.push({ ...rows[i], url: signedUrl, image });
    } catch (error) {
      console.warn("Failed to load cloud photo", rows[i].storage_path, error);
    }
  }
  rebuildPhotoPool();
  renderPhotoList();
}

async function deleteCloudPhoto(photo) {
  if (!state.canManage) return;
  const client = await getSupabaseClient();
  const removeRow = await client.from("memory_photos").delete().eq("id", photo.id);
  if (removeRow.error) throw removeRow.error;
  await client.storage.from(SUPABASE_BUCKET).remove([photo.storage_path]);
  await loadCloudPhotos();
}

function renderPhotoList() {
  if (!photoList) return;
  photoList.innerHTML = "";
  if (!state.authorized) {
    photoList.innerHTML = '<div class="memory-empty">登录后显示云端照片</div>';
    return;
  }
  if (!cloudPhotos.length) {
    photoList.innerHTML = '<div class="memory-empty">还没有云端照片</div>';
    return;
  }
  cloudPhotos.forEach((photo) => {
    const item = document.createElement("div");
    item.className = "photo-item";
    const image = document.createElement("img");
    image.src = photo.url;
    image.alt = "uploaded memory";
    const time = document.createElement("span");
    time.textContent = formatDateTime(photo.created_at);
    item.append(image, time);
    if (state.canManage) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "删除";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await deleteCloudPhoto(photo);
          setCloudStatus("照片已删除。");
        } catch (error) {
          console.error(error);
          setCloudStatus("删除失败，请检查 Supabase 权限。");
          button.disabled = false;
        }
      });
      item.append(button);
    }
    photoList.append(item);
  });
}

async function loadCloudMessages() {
  if (!state.authorized) return;
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("memory_messages")
    .select("id, content, author_email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  state.messages = data || [];
  renderMessages();
}

async function addCloudMessage(content) {
  const client = await getSupabaseClient();
  const author = normalizeEmail(state.session && state.session.user && state.session.user.email);
  const { error } = await client.from("memory_messages").insert({
    content,
    author_email: author,
  });
  if (error) throw error;
  await loadCloudMessages();
}

async function deleteCloudMessage(id) {
  if (!state.canManage) return;
  const client = await getSupabaseClient();
  const { error } = await client.from("memory_messages").delete().eq("id", id);
  if (error) throw error;
  await loadCloudMessages();
}

function renderMessages() {
  if (!messageList) return;
  messageList.innerHTML = "";
  if (!state.authorized) {
    messageList.innerHTML = '<div class="memory-empty">登录后显示留言</div>';
    return;
  }
  if (!state.messages.length) {
    messageList.innerHTML = '<div class="memory-empty">还没有留言</div>';
    return;
  }
  state.messages.forEach((message) => {
    const item = document.createElement("div");
    item.className = "memory-item";
    const content = document.createElement("strong");
    content.textContent = message.content;
    const meta = document.createElement("span");
    meta.textContent = `${formatDateTime(message.created_at)} · ${message.author_email || "受邀成员"}`;
    item.append(content, meta);
    if (state.canManage) {
      const actions = document.createElement("div");
      actions.className = "memory-actions";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "删除";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await deleteCloudMessage(message.id);
        } catch (error) {
          console.error(error);
          setCloudStatus("删除留言失败，请检查权限。");
          button.disabled = false;
        }
      });
      actions.append(button);
      item.append(actions);
    }
    messageList.append(item);
  });
}

async function loadCloudDays() {
  if (!state.authorized) return;
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("memory_days")
    .select("id, title, target_date, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  state.days = data || [];
  renderDays();
}

async function addCloudDay(title, targetDate) {
  const client = await getSupabaseClient();
  const { error } = await client.from("memory_days").insert({
    title,
    target_date: targetDate,
  });
  if (error) throw error;
  await loadCloudDays();
}

async function deleteCloudDay(id) {
  if (!state.canManage) return;
  const client = await getSupabaseClient();
  const { error } = await client.from("memory_days").delete().eq("id", id);
  if (error) throw error;
  await loadCloudDays();
}

function renderDays() {
  if (!dayList) return;
  dayList.innerHTML = "";
  if (!state.authorized) {
    dayList.innerHTML = '<div class="memory-empty">登录后显示纪念日</div>';
    return;
  }
  if (!state.days.length) {
    dayList.innerHTML = '<div class="memory-empty">还没有纪念日</div>';
    return;
  }
  state.days.forEach((day) => {
    const item = document.createElement("div");
    item.className = "memory-item";
    const title = document.createElement("strong");
    title.textContent = `${day.title} · ${dayDistanceText(day.target_date)}`;
    const meta = document.createElement("span");
    meta.textContent = `${day.target_date} 添加`;
    item.append(title, meta);
    if (state.canManage) {
      const actions = document.createElement("div");
      actions.className = "memory-actions";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "删除";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await deleteCloudDay(day.id);
        } catch (error) {
          console.error(error);
          setCloudStatus("删除纪念日失败，请检查权限。");
          button.disabled = false;
        }
      });
      actions.append(button);
      item.append(actions);
    }
    dayList.append(item);
  });
}

async function loadHandTracking() {
  if (window.Hands && window.Camera) return;
  updateStatus("正在加载手势识别库，请稍等...");
  await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
  await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
}

function resize() {
  state.dpr = LOW_POWER ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  if (!USE_STATIC_SCENE && !LOW_POWER) makeSky();
  makeMeteors();
  if (!USE_STATIC_SCENE && !LOW_POWER) makeGrass();
  state.textCache = {};
  warmTextCache();
}

function makeSky() {
  stars.length = 0;
  const count = Math.floor((state.width * state.height) / 5200);
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rand(0, state.width),
      y: rand(0, state.height * 0.72),
      r: rand(0.35, 2.2),
      twinkle: rand(0, Math.PI * 2),
      depth: rand(0.35, 1.8),
      hue: rand(198, 248),
    });
  }
}

function makeMeteors() {
  meteors.length = 0;
  const count = LOW_POWER ? clamp(Math.floor(state.width / 170), 8, 12) : clamp(Math.floor(state.width / 130), 7, 14);
  for (let i = 0; i < count; i += 1) {
    meteors.push(newMeteor(rand(-state.width, state.width), rand(28, state.height * 0.43)));
  }
}

function newMeteor(x, y) {
  return {
    x,
    y,
    len: rand(220, 420),
    speed: rand(92, 190),
    size: rand(1.6, 3.8),
    delay: rand(0, 5.8),
    photo: Math.floor(rand(0, photoPoolCount())),
    glow: rand(0.45, 0.95),
    depth: rand(0.65, 1.5),
    hue: rand(188, 220),
  };
}

function makeGrass() {
  grass.length = 0;
  const count = Math.floor(state.width / 3.2);
  for (let i = 0; i < count; i += 1) {
    grass.push({
      x: rand(0, state.width),
      y: rand(state.height * 0.81, state.height),
      h: rand(18, 72),
      lean: rand(-0.4, 0.6),
      shade: rand(0.35, 0.95),
    });
  }

  breezeHair.length = 0;
  for (let i = 0; i < 26; i += 1) {
    breezeHair.push({ offset: rand(-10, 14), length: rand(28, 58), phase: rand(0, 8) });
  }
}

function warmTextCache() {
  buildTextLayout("Chen Yun & Song Bingbing", "one");
  buildTextLayout("happiness forever", "two");
}

function drawSky(dt) {
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  gradient.addColorStop(0, "#02030c");
  gradient.addColorStop(0.28, "#06162e");
  gradient.addColorStop(0.58, "#18143a");
  gradient.addColorStop(0.79, "#203044");
  gradient.addColorStop(1, "#06130d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  drawAurora();
  drawDepthGrid();
  drawParticleRibbons();

  const moonX = state.width * 0.83;
  const moonY = state.height * 0.15;
  const moonR = clamp(state.width * 0.035, 22, 54);
  const moon = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 4);
  moon.addColorStop(0, "rgba(255, 246, 203, 0.75)");
  moon.addColorStop(0.14, "rgba(255, 246, 203, 0.38)");
  moon.addColorStop(1, "rgba(255, 246, 203, 0)");
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 246, 211, 0.92)";
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#050817";
  ctx.beginPath();
  ctx.arc(moonX + moonR * 0.34, moonY - moonR * 0.14, moonR * 0.94, 0, Math.PI * 2);
  ctx.fill();

  stars.forEach((star) => {
    const parallax = Math.sin(state.time * 0.05 + star.depth) * star.depth * 2.2;
    const alpha = 0.34 + Math.sin(state.time * (1.2 + star.depth) + star.twinkle) * 0.28 + star.r * 0.13;
    ctx.fillStyle = `hsla(${star.hue}, 92%, 88%, ${clamp(alpha, 0.18, 0.92)})`;
    ctx.beginPath();
    ctx.arc(star.x + parallax, star.y, star.r * star.depth, 0, Math.PI * 2);
    ctx.fill();
    if (star.r * star.depth > 2.2) {
      ctx.strokeStyle = `rgba(202, 232, 255, ${alpha * 0.26})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(star.x - 5, star.y);
      ctx.lineTo(star.x + 5, star.y);
      ctx.moveTo(star.x, star.y - 5);
      ctx.lineTo(star.x, star.y + 5);
      ctx.stroke();
    }
  });

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = "#d7eeff";
  for (let i = 0; i < 5; i += 1) {
    const x = (state.width * (0.12 + i * 0.18) + Math.sin(state.time * 0.08 + i) * 18) % state.width;
    const y = state.height * (0.24 + (i % 2) * 0.08);
    drawCloud(x, y, state.width * 0.1);
  }
  ctx.restore();
}

function drawAurora() {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let band = 0; band < 4; band += 1) {
    const yBase = state.height * (0.16 + band * 0.07);
    const grd = ctx.createLinearGradient(0, yBase - 90, 0, yBase + 150);
    grd.addColorStop(0, "rgba(100, 232, 255, 0)");
    grd.addColorStop(0.45, band % 2 ? "rgba(255, 142, 220, 0.13)" : "rgba(101, 255, 204, 0.12)");
    grd.addColorStop(1, "rgba(100, 232, 255, 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let x = 0; x <= state.width + 40; x += 36) {
      const wave =
        Math.sin(x * 0.008 + state.time * (0.18 + band * 0.03) + band) * 38 +
        Math.sin(x * 0.018 - state.time * 0.14) * 16;
      ctx.lineTo(x, yBase + wave);
    }
    for (let x = state.width; x >= 0; x -= 36) {
      const wave =
        Math.sin(x * 0.008 + state.time * (0.18 + band * 0.03) + band) * 38 +
        Math.sin(x * 0.018 - state.time * 0.14) * 16;
      ctx.lineTo(x, yBase + wave + 130 + band * 22);
    }
    ctx.closePath();
    ctx.filter = "blur(18px)";
    ctx.fill();
    ctx.filter = "none";
  }
  ctx.restore();
}

function drawDepthGrid() {
  const horizon = skyLimit();
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(113, 216, 255, 0.32)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 16; i += 1) {
    const t = i / 15;
    const x = state.width * (0.5 + (t - 0.5) * 1.85);
    ctx.beginPath();
    ctx.moveTo(state.width * 0.5, horizon);
    ctx.lineTo(x, state.height);
    ctx.stroke();
  }
  for (let i = 1; i < 12; i += 1) {
    const y = horizon + Math.pow(i / 12, 1.8) * (state.height - horizon);
    ctx.globalAlpha = 0.2 * (1 - i / 14);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(state.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticleRibbons() {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let band = 0; band < 3; band += 1) {
    ctx.beginPath();
    for (let i = 0; i < 90; i += 1) {
      const t = i / 89;
      const x = state.width * (0.08 + t * 0.86);
      const y =
        state.height * (0.25 + band * 0.1) +
        Math.sin(t * Math.PI * 4 + state.time * (0.35 + band * 0.08)) * 34 +
        Math.cos(t * Math.PI * 7 - state.time * 0.22) * 18;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i % 7 === 0) {
        ctx.fillStyle = band % 2 ? "rgba(255, 137, 216, 0.18)" : "rgba(118, 232, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(x, y, 1.1 + ((i + band) % 4) * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
    ctx.strokeStyle = band % 2 ? "rgba(255, 137, 216, 0.08)" : "rgba(118, 232, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawCloud(x, y, s) {
  ctx.save();
  ctx.filter = "blur(4px)";
  const glow = ctx.createRadialGradient(x, y, 0, x, y, s);
  glow.addColorStop(0, "rgba(220, 241, 255, 0.34)");
  glow.addColorStop(0.44, "rgba(132, 201, 255, 0.18)");
  glow.addColorStop(1, "rgba(132, 201, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x, y, s * 0.7, s * 0.18, 0, 0, Math.PI * 2);
  ctx.ellipse(x + s * 0.28, y - s * 0.03, s * 0.56, s * 0.14, 0, 0, Math.PI * 2);
  ctx.ellipse(x - s * 0.36, y + s * 0.02, s * 0.4, s * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = "none";
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 16; i += 1) {
    const px = x + Math.cos(i * 2.39) * s * (0.1 + ((i * 17) % 48) / 100);
    const py = y + Math.sin(i * 1.73) * s * (0.02 + ((i * 13) % 14) / 100);
    ctx.fillStyle = i % 2 ? "rgba(255, 179, 224, 0.08)" : "rgba(126, 229, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(px, py, s * (0.014 + ((i * 11) % 18) / 1000), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHills() {
  const groundY = groundLine();
  const far = ctx.createLinearGradient(0, groundY - 140, 0, state.height);
  far.addColorStop(0, "#172c4a");
  far.addColorStop(0.62, "#142b36");
  far.addColorStop(1, "#0a1d14");
  ctx.fillStyle = far;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= state.width + 20; x += 34) {
    const y = groundY + Math.sin(x * 0.006) * 28 - Math.cos(x * 0.013) * 16;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(state.width, state.height);
  ctx.lineTo(0, state.height);
  ctx.closePath();
  ctx.fill();

  const field = ctx.createLinearGradient(0, groundY, 0, state.height);
  field.addColorStop(0, "#25513b");
  field.addColorStop(0.34, "#163d2b");
  field.addColorStop(1, "#041009");
  ctx.fillStyle = field;
  ctx.fillRect(0, groundY, state.width, state.height - groundY);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const glow = ctx.createRadialGradient(state.width * 0.34, groundY + 18, 0, state.width * 0.34, groundY + 18, state.width * 0.72);
  glow.addColorStop(0, "rgba(255, 199, 221, 0.12)");
  glow.addColorStop(0.46, "rgba(94, 226, 255, 0.08)");
  glow.addColorStop(1, "rgba(94, 226, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, groundY - 80, state.width, state.height - groundY + 80);
  ctx.restore();
}

function drawGrass() {
  ctx.save();
  ctx.lineWidth = 1;
  grass.forEach((blade) => {
    const sway = Math.sin(state.time * 1.7 + blade.x * 0.02) * 5 + state.wind * 9;
    ctx.strokeStyle = `rgba(${42 + blade.shade * 36}, ${118 + blade.shade * 88}, ${74 + blade.shade * 54}, 0.62)`;
    ctx.beginPath();
    ctx.moveTo(blade.x, blade.y);
    ctx.quadraticCurveTo(
      blade.x + blade.lean * 14 + sway,
      blade.y - blade.h * 0.58,
      blade.x + blade.lean * 28 + sway * 1.4,
      blade.y - blade.h,
    );
    ctx.stroke();
  });
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(170, 244, 210, 0.16)";
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 73 + Math.sin(state.time * 0.7 + i) * 12) % state.width;
    const y = state.height * (0.82 + (((i * 37) % 100) / 100) * 0.16);
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function updateMeteors(dt) {
  const slow = state.mode === "pinch" ? 0.12 : 1;
  meteors.forEach((meteor, index) => {
    meteor.delay -= dt;
    if (meteor.delay > 0) return;
    meteor.x += meteor.speed * dt * 1.18 * slow;
    meteor.y += meteor.speed * dt * 0.23 * slow;
    if (meteor.x > state.width + meteor.len || meteor.y > skyLimit() - 24) {
      Object.assign(meteor, newMeteor(rand(-state.width * 0.75, -80), rand(24, state.height * 0.42)));
      meteor.photo = (state.photoIndex + index) % photoPoolCount();
    }
  });
}

function drawMeteors() {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, state.width, skyLimit());
  ctx.clip();
  ctx.globalCompositeOperation = "screen";
  meteors.forEach((meteor) => {
    if (meteor.delay > 0) return;
    const isSelected = state.pinchShow && state.pinchShow.meteor === meteor;
    const selectedFade = isSelected ? clamp(state.pinchShow.t / 0.55, 0, 1) : 0;
    const tailX = meteor.x - meteor.len;
    const tailY = meteor.y - meteor.len * 0.28;
    const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
    gradient.addColorStop(0, "rgba(112, 182, 255, 0)");
    gradient.addColorStop(0.42, `hsla(${meteor.hue}, 94%, 74%, ${0.16 * meteor.glow * (1 - selectedFade)})`);
    gradient.addColorStop(0.82, `rgba(255, 156, 218, ${0.38 * meteor.glow * (1 - selectedFade)})`);
    gradient.addColorStop(1, `rgba(255, 248, 211, ${0.98 * meteor.glow * (1 - selectedFade)})`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = meteor.size * (LOW_POWER ? 1.9 : 2.6) * meteor.depth;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(129, 220, 255, 0.72)";
    ctx.shadowBlur = LOW_POWER ? 5 * meteor.depth : 18 * meteor.depth;
    if (selectedFade < 0.96) {
      ctx.globalAlpha = 0.85 * (1 - selectedFade);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(meteor.x, meteor.y);
      ctx.stroke();
      ctx.globalAlpha = 0.36 * (1 - selectedFade);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = meteor.size * 0.8;
      ctx.beginPath();
      ctx.moveTo(meteor.x - meteor.len * 0.3, meteor.y - meteor.len * 0.069);
      ctx.lineTo(meteor.x, meteor.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 252, 224, ${0.96 * (1 - selectedFade)})`;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.size * 1.7, 0, Math.PI * 2);
    ctx.fill();

    const dustCount = LOW_POWER ? 170 : 220;
    for (let i = 0; i < dustCount; i += 1) {
      const t = (i + 1) / dustCount;
      const wobble = Math.sin(state.time * 5.4 + i * 1.7 + meteor.x * 0.01);
      const side = Math.cos(i * 2.31) * meteor.size * (0.8 + t * 3.2);
      const px = meteor.x - meteor.len * t * 0.72 + wobble * 6 + side;
      const py = meteor.y - meteor.len * t * 0.17 + Math.cos(state.time * 4.2 + i) * 4 + side * 0.18;
      const alpha = (0.28 + (1 - t) * 0.36) * (1 - selectedFade);
      const r = meteor.size * (0.12 + (1 - t) * 0.48) * (0.55 + ((i * 7) % 11) / 10);
      ctx.fillStyle = i % 3 === 0 ? `rgba(255, 233, 177, ${alpha})` : `rgba(156, 220, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

function drawTinyPhoto(image, x, y, w, h, rot) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  roundedRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6, 4);
  ctx.fill();
  drawImageCover(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawImageCover(image, x, y, w, h) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
}

function startPinchPhoto() {
  if (state.pinchShow) return;
  if (!photos.length) {
    updateStatus("还没有可展示的照片。");
    return;
  }
  const visible = meteors.filter((item) => item.delay <= 0 && item.x > 0 && item.x < state.width && item.y < state.height * 0.72);
  const pool = visible.length ? visible : meteors;
  const meteor = pool.reduce((best, item) => (item.x > best.x ? item : best), pool[0]);
  state.photoIndex = (state.photoIndex + 1) % photos.length;
  state.pinchShow = {
    image: photos[state.photoIndex],
    x: meteor ? meteor.x : state.width * 0.68,
    y: meteor ? meteor.y : state.height * 0.25,
    meteor,
    t: 0,
  };
}

function drawPinchPhoto(dt) {
  if (!state.pinchShow) return;
  if (!state.pinchShow.image) {
    state.pinchShow.image = photos[state.photoIndex];
  }
  const show = state.pinchShow;
  show.t += dt;
  if (show.meteor) {
    show.x = show.meteor.x;
    show.y = show.meteor.y;
  }
  const burst = clamp(show.t / 0.36, 0, 1);
  const ease = 1 - Math.pow(1 - clamp(show.t / 1.15, 0, 1), 3);
  const x = show.x + (state.width * 0.5 - show.x) * ease;
  const y = show.y + (state.height * 0.48 - show.y) * ease;
  const w = clamp(state.width * (0.07 + 0.34 * ease + 0.04 * burst), 76, 430);
  const h = w * 1.22;
  const flipIn = clamp(show.t / 0.5, 0, 1);
  const flip = 0.42 + 0.58 * (1 - Math.pow(1 - flipIn, 3));
  const rot = Math.sin(show.t * 0.9) * 0.06;

  if (!show.image) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 22; i += 1) {
    const angle = (i / 22) * Math.PI * 2 + state.time * 0.8;
    const r = 18 + burst * 72 + Math.sin(state.time * 6 + i) * 8;
    ctx.fillStyle = i % 2 ? "rgba(255, 151, 213, 0.42)" : "rgba(116, 231, 255, 0.42)";
    ctx.beginPath();
    ctx.arc(show.x + Math.cos(angle) * r, show.y + Math.sin(angle) * r * 0.54, 2 + burst * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.9 + burst * 0.08;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(flip, 1);
  ctx.shadowColor = "rgba(108, 231, 255, 0.72)";
  ctx.shadowBlur = 42;
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  roundedRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 8);
  ctx.fill();
  ctx.shadowBlur = 0;
  roundedRect(-w / 2, -h / 2, w, h, 5);
  ctx.clip();
  drawImageCover(show.image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function spawnFirework(x, y, scale = 1) {
  const colors = ["#fff7b0", "#ff7fb4", "#7fe7ff", "#b8ffca", "#d8a8ff", "#ffb36e"];
  const particles = [];
  const count = Math.floor((LOW_POWER ? 1450 : 1900) * scale);
  for (let i = 0; i < count; i += 1) {
    const ring = i % 5;
    const angle = (Math.PI * 2 * i) / count + rand(-0.055, 0.055);
    const speed = rand(56 + ring * 24, 130 + ring * 48) * scale;
    const size = rand(0.42, ring === 0 ? 4.9 : 3.3) * (0.82 + scale * 0.34) * (Math.random() > 0.86 ? 1.7 : 1);
    particles.push({
      x,
      y,
      px: x,
      py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * rand(0.78, 1.12),
      life: rand(0.82, 1.72) * (0.9 + scale * 0.12),
      age: 0,
      size,
      gravity: rand(34, 76) * (0.9 + scale * 0.08),
      drag: rand(0.972, 0.989),
      flicker: rand(0, Math.PI * 2),
      color: colors[(Math.floor(rand(0, colors.length)) + ring) % colors.length],
    });
  }
  if (state.fireworks.length > 8) state.fireworks.shift();
  state.fireworks.push({ particles });
}

function updateFireworks(dt) {
  if (state.mode === "fireworks" && Math.random() < (LOW_POWER ? 0.008 : 0.026)) {
    spawnFirework(rand(state.width * 0.2, state.width * 0.86), rand(state.height * 0.13, state.height * 0.48), rand(0.75, 1.35));
  }

  state.fireworks.forEach((fw) => {
    fw.particles.forEach((p) => {
      p.age += dt;
      p.px = p.x;
      p.py = p.y;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.vx *= p.drag;
      p.vy *= p.drag;
    });
  });
  for (let i = state.fireworks.length - 1; i >= 0; i -= 1) {
    if (state.fireworks[i].particles.every((p) => p.age >= p.life)) {
      state.fireworks.splice(i, 1);
    }
  }
}

function drawFireworks() {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, state.width, skyLimit());
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  state.fireworks.forEach((fw) => {
    fw.particles.forEach((p) => {
      const alpha = 1 - p.age / p.life;
      if (alpha <= 0) return;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * (0.62 + Math.sin(state.time * 18 + p.flicker) * 0.22);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.45 + alpha * 1.15), 0, Math.PI * 2);
      ctx.fill();
    });
  });
  ctx.restore();
}

function setTextParticles(text, key) {
  if (state.textMode === key && state.textParticles.length) return;
  state.textTarget = text;
  state.textMode = key;
  state.textGlow = 1;
  state.textStartedAt = state.time;
  const layout = buildTextLayout(text, key);
  state.textParticles = layout.points.map((p, index) => {
    const edge = index % 4;
    let x;
    let y;
    if (edge === 0) {
      x = rand(-state.width * 0.12, state.width * 1.12);
      y = rand(-120, -24);
    } else if (edge === 1) {
      x = rand(state.width + 24, state.width + 140);
      y = rand(-state.height * 0.05, skyLimit() + 80);
    } else if (edge === 2) {
      x = rand(-state.width * 0.12, state.width * 1.12);
      y = rand(skyLimit() + 50, state.height + 140);
    } else {
      x = rand(-140, -24);
      y = rand(-state.height * 0.05, skyLimit() + 80);
    }
    return {
      x,
      y,
      px: x,
      py: y,
      tx: p.x,
      ty: p.y,
      vx: rand(-120, 120),
      vy: rand(-120, 120),
      size: p.size,
      color: p.color,
    };
  });
}

function buildTextLayout(text, key) {
  const cacheKey = `${key}-${Math.round(state.width)}x${Math.round(state.height)}`;
  if (state.textCache[cacheKey]) return state.textCache[cacheKey];

  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");
  off.width = Math.floor(state.width);
  off.height = Math.floor(state.height);
  const fontSize = clamp(state.width * 0.095, 46, 108);
  offCtx.fillStyle = "#fff";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.font = `900 ${fontSize}px Microsoft YaHei, Arial, sans-serif`;
  wrapText(offCtx, text, state.width / 2, state.height * 0.46, state.width * 0.9, fontSize * 1.04);
  const data = offCtx.getImageData(0, 0, off.width, off.height).data;
  const gap = LOW_POWER ? clamp(Math.floor(state.width / 720), 2, 3) : clamp(Math.floor(state.width / 760), 2, 3);
  const points = [];
  for (let y = 0; y < off.height; y += gap) {
    for (let x = 0; x < off.width; x += gap) {
      const alpha = data[(y * off.width + x) * 4 + 3];
      if (alpha > 75 && Math.random() > 0.02) {
        points.push({
          x,
          y,
          size: rand(0.55, 4.3) * (Math.random() > 0.9 ? 1.5 : 1),
          color: Math.random() > 0.5 ? "#fff0b6" : Math.random() > 0.5 ? "#8eeeff" : Math.random() > 0.5 ? "#ff9bd5" : "#d8b5ff",
        });
      }
    }
  }
  state.textCache[cacheKey] = { points, fontSize };
  return state.textCache[cacheKey];
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((part, index) => context.fillText(part, x, startY + index * lineHeight));
}

function updateTextParticles(dt) {
  state.textGlow = Math.max(0, state.textGlow - dt * 0.56);
  state.textParticles.forEach((p) => {
    p.px = p.x;
    p.py = p.y;
    const ax = (p.tx - p.x) * 120;
    const ay = (p.ty - p.y) * 120;
    p.vx = (p.vx + ax * dt) * 0.5;
    p.vy = (p.vy + ay * dt) * 0.5;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  });
}

function drawTextParticles() {
  if (!state.textParticles.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  state.textParticles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.72 + Math.sin(state.time * 4.6 + p.tx * 0.01) * 0.22;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function startBalloons() {
  if (state.balloons.length) return;
  if (!photos.length) {
    updateStatus("还没有可展示的照片。");
    return;
  }
  state.balloonStartedAt = state.time;
  const palette = ["#ffd7e6", "#c7f1ff", "#fff0a8", "#c9facf", "#dfd2ff", "#ffd8ba"];
  const count = photos.length;
  const columns = clamp(Math.floor(state.width / 230), 4, 8);
  const rowSpacing = clamp(state.height * 0.42, 280, 390);
  for (let i = 0; i < count; i += 1) {
    const col = columns === 1 ? 0.5 : (i % columns) / (columns - 1);
    const row = Math.floor(i / columns);
    const spreadX = state.width * (0.1 + col * 0.8);
    const stagger = (i % columns) % 2 === 0 ? 0 : rowSpacing * 0.48;
    state.balloons.push({
      x: spreadX + rand(-12, 12),
      y: state.height + 90 + row * rowSpacing + stagger + rand(0, 48),
      speed: rand(112, 150),
      phase: rand(0, Math.PI * 2),
      color: palette[i % palette.length],
      image: photos[i % photos.length],
      rot: rand(-0.1, 0.1),
      size: rand(38, 62),
      depth: rand(0.78, 1.22),
      lineLen: rand(142, 208),
      drift: rand(16, 42),
      delay: ((i % columns) % 2) * 0.16 + rand(0, 0.2),
    });
  }
}

function updateBalloons(dt) {
  const elapsed = state.time - state.balloonStartedAt;
  state.balloons.forEach((b) => {
    if (elapsed < b.delay) return;
    b.y -= b.speed * dt;
    b.x += (Math.sin(state.time * 1.55 + b.phase) * b.drift + state.wind * 34) * dt;
    b.rot = Math.sin(state.time * 2.15 + b.phase) * 0.22 + state.wind * 0.12;
  });
  if (state.balloons.length && state.balloons.every((b) => b.y < -190)) {
    state.balloons = [];
    setGesture("open");
  }
}

function drawBalloons() {
  [...state.balloons].sort((a, b) => a.y - b.y).forEach((b, index) => {
    if (state.time - state.balloonStartedAt < b.delay) return;
    const photoW = clamp(state.width * 0.085 * b.depth, 58, 104);
    const photoH = photoW * 1.18;
    const bx = b.x;
    const by = b.y;
    const wind = state.wind * 42 + Math.sin(state.time * 1.8 + b.phase) * 20;
    const lineLen = b.lineLen * b.depth;
    const px = bx + wind * 0.48 + Math.sin(state.time * 2.1 + b.phase) * 18;
    const py = by + lineLen;
    const swing = b.rot + Math.sin(state.time * 2.35 + b.phase) * 0.16;
    ctx.save();
    ctx.strokeStyle = "rgba(238, 250, 255, 0.78)";
    ctx.lineWidth = 1.1;
    ctx.shadowColor = "rgba(116, 224, 255, 0.36)";
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.moveTo(bx, by + b.size * 1.05);
    ctx.bezierCurveTo(
      bx - 18 + wind * 0.22,
      by + lineLen * 0.32,
      px + 24 + wind * 0.16,
      py - lineLen * 0.32,
      px,
      py - 10,
    );
    ctx.stroke();

    const balloon = ctx.createRadialGradient(
      bx - b.size * 0.22,
      by - b.size * 0.34,
      b.size * 0.08,
      bx,
      by,
      b.size * 1.2,
    );
    balloon.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    balloon.addColorStop(0.22, b.color);
    balloon.addColorStop(1, "rgba(85, 121, 180, 0.34)");
    ctx.fillStyle = balloon;
    ctx.globalAlpha = 0.96;
    ctx.beginPath();
    ctx.ellipse(bx, by, b.size * 0.76 * b.depth, b.size * 1.06 * b.depth, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.36)";
    ctx.beginPath();
    ctx.ellipse(bx - b.size * 0.22, by - b.size * 0.26, b.size * 0.16, b.size * 0.26, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(bx - 5, by + b.size * 0.9);
    ctx.lineTo(bx + 5, by + b.size * 0.9);
    ctx.lineTo(bx, by + b.size * 1.1);
    ctx.closePath();
    ctx.fill();

    if (b.image) {
      ctx.translate(px, py);
      ctx.rotate(swing);
      ctx.shadowColor = "rgba(0, 0, 0, 0.46)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
      roundedRect(-photoW / 2 - 5, -photoH / 2 - 5, photoW + 10, photoH + 10, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      roundedRect(-photoW / 2, -photoH / 2, photoW, photoH, 4);
      ctx.clip();
      drawImageCover(b.image, -photoW / 2, -photoH / 2, photoW, photoH);
    } else if (photos.length) {
      b.image = photos[index % photos.length];
    }
    ctx.restore();
  });
}

function drawCouple() {
  const scale = clamp(state.width / 1180, 0.7, 1.12);
  const baseX = state.width * 0.17;
  const baseY = state.height * 0.825;
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.scale(scale, scale);

  ctx.globalCompositeOperation = "screen";
  const halo = ctx.createRadialGradient(92, -54, 0, 92, -54, 210);
  halo.addColorStop(0, "rgba(255, 194, 222, 0.26)");
  halo.addColorStop(0.42, "rgba(91, 218, 255, 0.12)");
  halo.addColorStop(1, "rgba(91, 218, 255, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(92, -54, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.ellipse(76, 58, 178, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(7, 10, 21, 0.92)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(108, -50);
  ctx.quadraticCurveTo(134, -22, 150, 26);
  ctx.moveTo(132, 10);
  ctx.lineTo(194, 44);
  ctx.moveTo(116, 12);
  ctx.lineTo(62, 48);
  ctx.stroke();

  ctx.strokeStyle = "#203f5d";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(100, -42);
  ctx.quadraticCurveTo(80, -8, 78, 40);
  ctx.stroke();

  ctx.strokeStyle = "rgba(7, 10, 21, 0.96)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(146, 18);
  ctx.lineTo(222, 38);
  ctx.moveTo(94, 24);
  ctx.lineTo(20, 54);
  ctx.stroke();

  ctx.fillStyle = "#16192a";
  ctx.beginPath();
  ctx.ellipse(92, -72, 28, 31, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e9bfa8";
  ctx.beginPath();
  ctx.arc(100, -70, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#2b1630";
  ctx.lineWidth = 4.2;
  breezeHair.forEach((hair) => {
    const wave = Math.sin(state.time * 2.5 + hair.phase) * 11 + state.wind * 22;
    ctx.beginPath();
    ctx.moveTo(83 + hair.offset * 0.42, -88 + hair.offset * 0.1);
    ctx.quadraticCurveTo(70 + wave, -66 + hair.offset, 76 + wave * 1.45, -34 + hair.length * 0.34);
    ctx.stroke();
  });

  ctx.strokeStyle = "#eec6ae";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(86, -26);
  ctx.bezierCurveTo(142, -62, 183, -108, 240, -162);
  ctx.stroke();
  ctx.fillStyle = "#eec6ae";
  ctx.beginPath();
  ctx.arc(239, -158, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(8, 12, 25, 0.96)";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(48, -38);
  ctx.quadraticCurveTo(50, 4, 34, 44);
  ctx.moveTo(28, 38);
  ctx.lineTo(-24, 56);
  ctx.moveTo(64, 31);
  ctx.lineTo(126, 51);
  ctx.stroke();

  ctx.strokeStyle = "#17273f";
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(48, -32);
  ctx.quadraticCurveTo(64, 2, 86, 38);
  ctx.stroke();

  ctx.fillStyle = "#152037";
  ctx.beginPath();
  ctx.ellipse(52, -67, 25, 29, 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e9bfa8";
  ctx.beginPath();
  ctx.arc(58, -65, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#eec6ae";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(-26, 35);
  ctx.moveTo(72, 3);
  ctx.lineTo(126, 42);
  ctx.stroke();

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(140, 228, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(18, 53);
  ctx.quadraticCurveTo(94, 32, 220, 43);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";

  ctx.restore();
}

function analyzeGesture(landmarks) {
  if (!landmarks) return "idle";
  const wrist = landmarks[0];
  const tips = [8, 12, 16, 20];
  const pips = [6, 10, 14, 18];
  const extended = tips.map((tip, index) => {
    const t = landmarks[tip];
    const p = landmarks[pips[index]];
    return t.y < p.y - 0.015;
  });
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const palmSize = Math.max(distance(wrist, landmarks[9]), 0.08);
  const thumbIndex = distance(thumbTip, indexTip) / palmSize;
  const pinch = thumbIndex < 0.34;

  const folded = tips.map((tip, index) => {
    const t = landmarks[tip];
    const p = landmarks[pips[index]];
    return t.y > p.y - 0.005;
  });
  if (folded.filter(Boolean).length >= 4) return "fist";
  if (pinch) return "pinch";
  if (extended.every(Boolean)) return "open";
  if (extended[0] && !extended[1] && !extended[2] && !extended[3]) return "one";
  if (extended[0] && extended[1] && !extended[2] && !extended[3]) return "two";
  if (extended[0] && extended[1] && extended[2] && !extended[3]) return "three";
  return "idle";
}

function commitGesture(gesture) {
  if (gesture === state.candidateGesture) {
    state.candidateCount += 1;
  } else {
    state.candidateGesture = gesture;
    state.candidateCount = 1;
  }
  if (state.candidateCount >= 2 && gesture !== state.stableGesture) {
    setGesture(gesture);
  }
}

function setGesture(gesture) {
  state.stableGesture = gesture;
  if (gesture === "open" || gesture === "idle") {
    state.mode = "idle";
    state.pinchShow = null;
    state.textParticles = [];
    state.textMode = "";
    state.balloons = [];
    updateBadge(gesture);
    return;
  }

  if (gesture === "pinch") {
    state.mode = "pinch";
    startPinchPhoto();
  } else if (gesture === "fist") {
    state.mode = "fireworks";
    state.fireworks = [];
    const burstScales = [0.72, 0.86, 1.0, 1.16, 1.32, 1.48];
    burstScales.forEach((scale, index) => {
      const x = state.width * (0.18 + index * 0.13) + rand(-34, 34);
      const y = rand(state.height * 0.12, state.height * 0.46);
      spawnFirework(clamp(x, state.width * 0.12, state.width * 0.9), y, scale);
    });
  } else if (gesture === "one") {
    state.mode = "text-one";
    setTextParticles("Chen Yun & Song Bingbing", "one");
  } else if (gesture === "two") {
    state.mode = "text-two";
    setTextParticles("happiness forever", "two");
  } else if (gesture === "three") {
    state.mode = "balloons";
    startBalloons();
  }
  updateBadge(gesture);
}

function updateBadge(gesture) {
  const labels = {
    idle: "等待手势",
    open: "张开手掌: 流星夜",
    pinch: "捏合: 照片流星",
    fist: "握拳: 烟花绽放",
    one: "数字 1: 名字粒子",
    two: "数字 2: 祝福粒子",
    three: "数字 3: 气球照片",
  };
  gestureBadge.textContent = labels[gesture] || labels.idle;
}

function updateStatus(text) {
  statusEl.textContent = text;
}

async function startCamera() {
  cameraButton.disabled = true;
  try {
    await loadHandTracking();
    updateStatus("正在请求摄像头权限...");

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.55,
    });
    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
        commitGesture(analyzeGesture(results.multiHandLandmarks[0]));
      } else {
        commitGesture("idle");
      }
    });

    let lastHandsAt = 0;
    const camera = new Camera(video, {
      onFrame: async () => {
        const now = performance.now();
        if (now - lastHandsAt < HAND_INTERVAL_MS) return;
        lastHandsAt = now;
        await hands.send({ image: video });
      },
      width: 320,
      height: 240,
    });
    await camera.start();
    state.cameraReady = true;
    updateStatus("手势已开启: 捏合、握拳、数字 1/2/3，张开手掌恢复。");
    cameraButton.style.display = "none";
  } catch (error) {
    cameraButton.disabled = false;
    updateStatus("启动失败：请确认网络可加载手势库，并允许摄像头权限。");
    console.error(error);
  }
}

function tick(now) {
  if (now - state.lastRenderMs < FRAME_INTERVAL_MS) {
    requestAnimationFrame(tick);
    return;
  }
  state.lastRenderMs = now;
  const next = now / 1000;
  const dt = clamp(next - state.time, 0, LOW_POWER ? 0.05 : 0.033) || 0.016;
  state.time = next;
  state.wind = Math.sin(state.time * 0.42) * 0.5 + Math.sin(state.time * 1.13) * 0.12;

  if (USE_STATIC_SCENE || LOW_POWER) {
    ctx.clearRect(0, 0, state.width, state.height);
  } else {
    drawSky(dt);
  }
  updateMeteors(dt);
  drawMeteors();

  if (state.mode === "pinch") {
    drawPinchPhoto(dt);
  }
  if (state.mode === "text-one" || state.mode === "text-two") {
    updateTextParticles(dt);
    drawTextParticles();
  }
  if (state.mode === "balloons") {
    updateBalloons(dt);
  }

  updateFireworks(dt);
  drawFireworks();
  if (!USE_STATIC_SCENE) {
    drawHills();
    drawGrass();
    drawCouple();
  }
  if (state.mode === "balloons") {
    drawBalloons();
  }
  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);
cameraButton.addEventListener("click", startCamera);

viewerLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await sendLoginLink(viewerEmailInput.value);
  } catch (error) {
    console.error(error);
    setAccessStatus("发送失败，请检查邮箱或 Supabase 配置。");
  }
});

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await sendLoginLink(adminEmailInput.value);
  } catch (error) {
    console.error(error);
    setCloudStatus("发送失败，请检查邮箱或 Supabase 配置。");
  }
});

adminLogoutButton.addEventListener("click", async () => {
  const client = await getSupabaseClient();
  await client.auth.signOut();
});

uploadPhotoButton.addEventListener("click", () => {
  if (!state.canManage) {
    setCloudStatus("只有管理者可以上传照片。");
    return;
  }
  photoUploadInput.click();
});

capturePhotoButton.addEventListener("click", () => {
  if (!state.canManage) {
    setCloudStatus("只有管理者可以拍摄上传。");
    return;
  }
  photoCaptureInput.click();
});

photoUploadInput.addEventListener("change", async () => {
  try {
    await handlePhotoFiles(photoUploadInput.files);
  } catch (error) {
    console.error(error);
    setCloudStatus("上传失败，请检查 Supabase 表和 Storage 权限。");
  } finally {
    photoUploadInput.value = "";
  }
});

photoCaptureInput.addEventListener("change", async () => {
  try {
    await handlePhotoFiles(photoCaptureInput.files);
  } catch (error) {
    console.error(error);
    setCloudStatus("上传失败，请检查 Supabase 表和 Storage 权限。");
  } finally {
    photoCaptureInput.value = "";
  }
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;
  if (!state.authorized) {
    setCloudStatus("登录后才能留言。");
    return;
  }
  try {
    await addCloudMessage(content);
    messageInput.value = "";
    setCloudStatus("留言已发布，受邀的人都能看到。");
  } catch (error) {
    console.error(error);
    setCloudStatus("发布失败，请检查留言表权限。");
  }
});

dayForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = dayTitleInput.value.trim();
  const date = dayDateInput.value;
  if (!title || !date) return;
  if (!state.canManage) {
    setCloudStatus("只有管理者可以添加纪念日。");
    return;
  }
  try {
    await addCloudDay(title, date);
    dayTitleInput.value = "";
    dayDateInput.value = "";
    setCloudStatus("纪念日已添加。");
  } catch (error) {
    console.error(error);
    setCloudStatus("添加失败，请检查纪念日表权限。");
  }
});

renderPhotoList();
renderMessages();
renderDays();
setAccessStatus("输入受邀邮箱后，点邮件里的登录链接进入。");
initPrivateCloud();
