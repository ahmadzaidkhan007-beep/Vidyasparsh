/* Shared code: database, cart, header/footer. Normally no need to edit. */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money = n => SITE.currency + Number(n).toLocaleString("en-IN");
const ready = !SITE.supabaseUrl.startsWith("PASTE");
const db = ready ? supabase.createClient(SITE.supabaseUrl, SITE.supabaseKey) : null;
const SAMPLE = [
  {id:"s1",slug:"mathematics-made-easy",title:"Mathematics Made Easy",author:"Editorial Team",cls:"Class 10",subject:"Mathematics",price:220,description:"Sample book shown until Supabase is connected.",color:"#232f6b",in_stock:true},
  {id:"s2",slug:"science-explorer",title:"Science Explorer",author:"Editorial Team",cls:"Class 8",subject:"Science",price:195,description:"Sample book shown until Supabase is connected.",color:"#0f8b8d",in_stock:true}
];
async function loadBooks() {
  if (!db) return SAMPLE;
  const { data, error } = await db.from("books").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}
function cover(b) {
  return b.cover_url
    ? `<div class="cover" style="padding:0"><img src="${esc(b.cover_url)}" alt="Cover of ${esc(b.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>`
    : `<div class="cover" style="background:${esc(b.color || "#232f6b")}"><small>${esc(b.cls)}</small><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div>`;
}
function setMeta(title, desc) {
  document.title = title;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
  m.content = desc;
}
/* ---- cart ---- */
let cart = {};
try { cart = JSON.parse(localStorage.getItem("vs-cart") || "{}"); } catch (e) {}
function addToCart(b) { const c = cart[b.id] || (cart[b.id] = { t: b.title, c: b.cls, p: b.price, n: 0 }); c.n++; drawCart(); toast("Added to cart"); }
function drawCart() {
  const rows = Object.entries(cart), total = rows.reduce((t, [, r]) => t + r.p * r.n, 0);
  $("count").textContent = rows.reduce((t, [, r]) => t + r.n, 0);
  $("items").innerHTML = rows.length ? rows.map(([id, r]) => `<div class="item"><div><b>${esc(r.t)}</b><div class="meta">${esc(r.c)} · ${money(r.p)}</div></div><div class="qty"><button data-dec="${esc(id)}" aria-label="Remove one">−</button> ${r.n} <button data-inc="${esc(id)}" aria-label="Add one">+</button></div></div>`).join("") : `<p class="meta">Your cart is empty. Add a book to get started.</p>`;
  $("total").textContent = money(total);
  const msg = `Hello ${SITE.name}, I would like to order:\n` + rows.map(([, r]) => `• ${r.t} (${r.c}) × ${r.n} = ${money(r.p * r.n)}`).join("\n") + `\nTotal: ${money(total)}`;
  $("order").href = rows.length ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}` : "#";
  $("order").style.opacity = rows.length ? 1 : .5;
  try { localStorage.setItem("vs-cart", JSON.stringify(cart)); } catch (e) {}
}
function toast(t) { const e = $("toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1600); }
/* ---- header, footer, cart drawer ---- */
function shell() {
  document.body.insertAdjacentHTML("afterbegin", `<header><div class="wrap bar"><a class="logo" href="index.html">${esc(SITE.name)}</a><a class="btn alt" href="index.html#books">Books</a><a class="btn alt" href="#contact">Contact</a><button class="btn alt" id="theme" aria-label="Switch light or dark theme">Theme</button><button class="btn gold" id="cartBtn">Cart (<span id="count">0</span>)</button></div></header>`);
  document.body.insertAdjacentHTML("beforeend", `<footer id="contact"><div class="wrap"><h2 style="margin-bottom:12px">Contact ${esc(SITE.name)}</h2>
    <p>${SITE.phones.map(p => `<a href="tel:+91${p}">${p}</a>`).join(" · ")}<br><a href="mailto:${SITE.email}">${SITE.email}</a><br>${esc(SITE.address)}</p>
    <a class="btn gold" target="_blank" rel="noopener" href="https://wa.me/${SITE.whatsapp}">Chat on WhatsApp</a>
    <p style="margin-top:20px">© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p></div></footer>
    <aside class="drawer" id="drawer" aria-label="Your cart"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Your cart</h2><button class="btn alt" id="closeCart">Close</button></div><div class="items" id="items"></div><div class="row" style="border-top:1px solid var(--line);padding-top:12px"><span>Total</span><span class="price" id="total"></span></div><a class="btn gold" id="order" style="text-align:center;margin-top:14px" target="_blank" rel="noopener">Order on WhatsApp</a></aside><div class="toast" id="toast" role="status"></div>`);
  $("cartBtn").onclick = () => $("drawer").classList.add("open");
  $("closeCart").onclick = () => $("drawer").classList.remove("open");
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("drawer").classList.remove("open"); });
  $("theme").onclick = () => { const r = document.documentElement; r.dataset.theme = getComputedStyle(r).colorScheme === "dark" ? "light" : "dark"; };
  document.addEventListener("click", e => {
    const i = e.target.closest("[data-inc]"), d = e.target.closest("[data-dec]");
    if (i) { cart[i.dataset.inc].n++; drawCart(); }
    if (d) { const k = d.dataset.dec; if (--cart[k].n <= 0) delete cart[k]; drawCart(); }
  });
  drawCart();
}
