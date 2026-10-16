const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- API Configuration ---------- */
const API_BASE = "api";

/* ---------- API Functions ---------- */
async function api(endpoint, options = {}) {
  // Add .php extension before any query parameters
  const parts = endpoint.split('?');
  const url = `${API_BASE}/${parts[0]}.php${parts.length > 1 ? '?' + parts[1] : ''}`;

  const opts = {
    headers: { "Content-Type": "application/json" },
    ...options
  };
  if (opts.body && typeof opts.body === "object") {
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

/* ---------- Data ---------- */
let session = null;  // { name, admin }
let products = [];
let editingId = null;

/* ---------- Image framing ----------
   The original image is never cropped. Each product stores { z, x, y, ar }:
   z = zoom (1 = fills the frame), x/y = how far the image is shifted from
   center as a fraction of the frame, ar = the image's width / height.
   Everything is in fractions, so it looks identical at any screen size. */
const FRAME_AR = 4 / 3; // must match aspect-ratio of .img in style.css
function dims(z, ar) {
  const w = ar > FRAME_AR ? ar / FRAME_AR : 1;  // width of "cover" fit, in frames
  const h = ar > FRAME_AR ? 1 : FRAME_AR / ar;
  return [w * z, h * z];
}
function frameStyle({ z = 1, x = 0, y = 0, ar = FRAME_AR } = {}) {
  const [W, H] = dims(z, ar);
  return `width:${W * 100}%;height:${H * 100}%;left:${(0.5 + x - W / 2) * 100}%;top:${(0.5 + y - H / 2) * 100}%`;
}
const measure = (src) => new Promise((res) => {
  const i = new Image();
  i.onload = () => res(i.naturalWidth / i.naturalHeight || FRAME_AR);
  i.onerror = () => res(FRAME_AR);
  i.src = src;
});

/* ---------- Routing ----------
   #/ = Home (all)   #/coffee   #/flowers   #/about (scrolls to footer)
   #/login   #/forgotpass                                              */
const page = () => location.hash.replace(/^#\/?/, "");
const filter = () => (["coffee", "flowers"].includes(page()) ? page() : "all");

async function route() {
  const p = page();
  const view = p === "login" ? "login" : p === "forgotpass" ? "forgot" : "shop";
  ["login", "forgot", "shop"].forEach((id) => ($("#" + id).hidden = id !== view));
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  if (view !== "shop") return;

  // Load products from API
  const cat = filter();
  const categoryParam = cat === "all" ? "" : `?category=${cat}`;
  try {
    products = await api(`products${categoryParam}`);
  } catch (err) {
    console.error("Failed to load products:", err);
    products = [];
  }

  renderShop(cat);
  setMenu(false);

  const active = p === "about" ? "about" : filter() === "all" ? "home" : filter();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const on = a.dataset.nav === active;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });

  if (p === "about") $("#about").scrollIntoView({ behavior: "smooth" });
  else window.scrollTo(0, 0);
}

/* ---------- Shop ---------- */
const ICON_EDIT = '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>';
const ICON_DEL = '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
const TITLES = { all: "All products", coffee: "Coffee", flowers: "Flowers" };

function renderShop(cat) {
  const isAdmin = !!session?.admin;

  $("#loginLink").hidden = !!session;
  $("#adminName").hidden = $("#avatar").hidden = !isAdmin;
  $("#addBtn").hidden = !isAdmin;
  $("#logout").hidden = true;

  const items = products.filter((p) => cat === "all" || p.cat === cat);
  $("#pageTitle").textContent = TITLES[cat];
  $("#pageCount").textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  $("#grid").innerHTML = items.length
    ? items.map((p) => `
      <article class="card ${p.cat}">
        <div class="img">${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" style="${frameStyle(p.pos)}">` : "Image"}</div>
        <div class="card-body">
          <h3 title="${esc(p.name)}">${esc(p.name)}</h3>
          <p class="desc">${esc(p.desc)}</p>
        </div>
        <div class="foot">
          <span class="price">₱${esc(p.price)}</span>
          ${isAdmin ? `<span class="acts">
            <button data-edit="${p.id}" aria-label="Edit ${esc(p.name)}">${ICON_EDIT}</button>
            <button data-del="${p.id}" aria-label="Delete ${esc(p.name)}">${ICON_DEL}</button>
          </span>` : ""}
        </div>
      </article>`).join("")
    : '<p class="empty">No products yet.</p>';
}

/* ---------- Mobile menu ---------- */
function setMenu(open) {
  $("#mainNav").classList.toggle("open", open);
  $("#menuToggle").setAttribute("aria-expanded", open);
  $("#menuToggle").setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
$("#menuToggle").onclick = () => setMenu(!$("#mainNav").classList.contains("open"));

/* ---------- Admin: add / edit / delete ---------- */
/* ---------- Image editor (drag + zoom inside a fixed frame) ---------- */
let ed = { src: "", ar: FRAME_AR, z: 1, x: 0, y: 0 };
const frame = $("#frame");

function setSrc() {
  for (const img of [$("#edImg"), $("#miniImg")]) { img.hidden = !ed.src; if (ed.src) img.src = ed.src; }
}

function paint() {
  const [W, H] = dims(ed.z, ed.ar), has = !!ed.src;
  // Keep the image covering the whole frame (no empty gaps)
  ed.x = Math.max(-(W - 1) / 2, Math.min((W - 1) / 2, ed.x));
  ed.y = Math.max(-(H - 1) / 2, Math.min((H - 1) / 2, ed.y));
  const style = frameStyle(ed);
  $("#edImg").style.cssText = style;   // live editor
  $("#miniImg").style.cssText = style; // catalog preview
  $("#edHint").hidden = has;
  frame.classList.toggle("has-img", has);
  $("#zoomVal").textContent = Math.round(ed.z * 100) + "%";
  ["zoomIn", "zoomOut", "resetImg"].forEach((id) => ($("#" + id).disabled = !has));
}

function zoom(step) {
  const nz = Math.min(3, Math.max(1, +(ed.z + step).toFixed(2)));
  const k = nz / ed.z;           // keep the same spot centered while zooming
  ed.x *= k; ed.y *= k; ed.z = nz;
  paint();
}

let drag = null;
frame.onpointerdown = (e) => {
  if (!ed.src) return;
  drag = { px: e.clientX, py: e.clientY, x: ed.x, y: ed.y };
  frame.setPointerCapture(e.pointerId);
  frame.classList.add("dragging");
};
frame.onpointermove = (e) => {
  if (!drag) return;
  const r = frame.getBoundingClientRect();
  ed.x = drag.x + (e.clientX - drag.px) / r.width;
  ed.y = drag.y + (e.clientY - drag.py) / r.height;
  paint();
};
frame.onpointerup = frame.onpointercancel = () => { drag = null; frame.classList.remove("dragging"); };
frame.onkeydown = (e) => {
  const d = { ArrowLeft: [-.02, 0], ArrowRight: [.02, 0], ArrowUp: [0, -.02], ArrowDown: [0, .02] }[e.key];
  if (!d || !ed.src) return;
  e.preventDefault(); ed.x += d[0]; ed.y += d[1]; paint();
};

$("#zoomIn").onclick = () => zoom(0.1);
$("#zoomOut").onclick = () => zoom(-0.1);
$("#resetImg").onclick = () => { ed.z = 1; ed.x = ed.y = 0; paint(); };
$("#pickBtn").onclick = () => $("#file").click();
$("#file").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const src = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  ed = { src, ar: await measure(src), z: 1, x: 0, y: 0 };
  setSrc(); paint();
};

function openModal(product) {
  editingId = product?.id ?? null;
  const f = $("#productForm");
  f.reset();
  $("#modalTitle").textContent = product ? "Edit product" : "Add new product";
  f.category.value = product?.cat ?? (filter() === "all" ? "flowers" : filter());
  if (product) { f.name.value = product.name; f.desc.value = product.desc; f.price.value = product.price; }
  const p = product?.pos || {};
  ed = { src: product?.img || "", ar: p.ar || FRAME_AR, z: p.z || 1, x: p.x || 0, y: p.y || 0 };
  setSrc(); paint();
  if (ed.src && !p.ar) measure(ed.src).then((ar) => { ed.ar = ar; paint(); }); // older products
  $("#modal").showModal();
}

$("#addBtn").onclick = () => openModal();
$("#cancel").onclick = () => $("#modal").close();

$("#grid").onclick = async (e) => {
  const edit = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
  if (edit) openModal(products.find((p) => p.id === edit.dataset.edit));
  if (del && confirm("Delete this product?")) {
    try {
      await api(`products?id=${del.dataset.del}`, { method: "DELETE" });
      products = products.filter((p) => p.id !== del.dataset.del);
      renderShop(filter());
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  }
};

$("#productForm").onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  const data = {
    cat: f.category.value, name: f.name.value.trim(), desc: f.desc.value.trim(), price: f.price.value,
    img: ed.src,                                                     // original, uncropped image
    pos: ed.src ? { z: ed.z, x: ed.x, y: ed.y, ar: ed.ar } : null,  // saved zoom + position
  };

  try {
    if (editingId) {
      await api("products", { method: "PUT", body: { ...data, id: editingId } });
      Object.assign(products.find((x) => x.id === editingId), data);
    } else {
      const res = await api("products", { method: "POST", body: data });
      products.unshift({ id: res.id, ...data });
    }
    $("#modal").close();
    renderShop(filter());
  } catch (err) {
    alert("Failed to save product: " + err.message);
  }
};

/* ---------- Auth ---------- */
$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const { username, password } = e.target;
  try {
    const res = await api("login", { method: "POST", body: { username: username.value, password: password.value } });
    session = res.user;
    e.target.reset();
    location.hash = "#/";
  } catch (err) {
    e.target.querySelector(".error").textContent = err.message;
  }
};

$("#forgotForm").onsubmit = async (e) => {
  e.preventDefault();
  const { username, password, confirm } = e.target;
  const err = e.target.querySelector(".error");
  try {
    await api("reset_password", { method: "POST", body: { username: username.value, password: password.value, confirm: confirm.value } });
    e.target.reset();
    location.hash = "#/login";
  } catch (err) {
    err.textContent = err.message;
  }
};

$("#avatar").onclick = () => ($("#logout").hidden = !$("#logout").hidden);
$("#logout").onclick = async () => {
  try {
    await api("logout", { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  }
  session = null;
  route();
};

window.addEventListener("hashchange", route);
route();
