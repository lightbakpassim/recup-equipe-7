const ICONS = {
  badge: "🪪",
  chargeur: "🔌",
  calculatrice: "🧮",
  ecouteurs: "🎧",
  usb: "💾",
  veste: "🧥",
  hdmi: "🖥️",
  cles: "🔑",
};

const seed = [
  {
    id: "badge-cafet",
    type: "trouve",
    category: "badge",
    title: "Badge étudiant",
    place: "Cafet",
    when: "il y a 12 min",
    note: "Trouvé près du présentoir à desserts, lanière bleue.",
    author: "Karim",
    status: "open",
  },
  {
    id: "chargeur-bu",
    type: "trouve",
    category: "chargeur",
    title: "Chargeur USB-C",
    place: "BU, 2e étage",
    when: "il y a 1 h",
    note: "Sur la table près des prises murales.",
    author: "Nora",
    status: "open",
  },
  {
    id: "calc-pret",
    type: "pret",
    category: "calculatrice",
    title: "Calculatrice scientifique",
    place: "Amphi B",
    when: "dispo jusqu’à 18h",
    note: "Je peux la prêter jusqu’au soir, RDV hall amphi.",
    author: "Yassine",
    status: "open",
  },
  {
    id: "ecouteurs-hall",
    type: "trouve",
    category: "ecouteurs",
    title: "Écouteurs blancs",
    place: "Hall principal",
    when: "il y a 3 h",
    note: "Boîtier un peu rayé, trouvés sous un banc.",
    author: "Inès",
    status: "open",
  },
  {
    id: "usb-cherche",
    type: "cherche",
    category: "usb",
    title: "Clé USB noire 32 Go",
    place: "Salle 204",
    when: "ce matin",
    note: "Dessus un sticker Récup’ bleu. Cours de 8h30.",
    author: "Lina",
    status: "open",
  },
  {
    id: "veste-cherche",
    type: "cherche",
    category: "veste",
    title: "Veste noire",
    place: "Cafet",
    when: "hier",
    note: "Oubliée sur une chaise vers 13h.",
    author: "Mehdi",
    status: "open",
  },
  {
    id: "hdmi-pret",
    type: "pret",
    category: "hdmi",
    title: "Câble HDMI",
    place: "BU",
    when: "dispo maintenant",
    note: "Idéal pour une soutenance, je suis à la BU.",
    author: "Sara",
    status: "open",
  },
];

const state = {
  view: "home",
  tab: "trouve",
  publishType: "trouve",
  items: JSON.parse(JSON.stringify(seed)),
  selectedId: null,
  mine: [],
};

const typeLabel = {
  trouve: "Trouvé",
  cherche: "Cherché",
  pret: "Prêt",
};

function $(sel) {
  return document.querySelector(sel);
}

function render() {
  const app = $("#app");
  if (state.view === "home") app.innerHTML = homeView();
  if (state.view === "feed") app.innerHTML = feedView();
  if (state.view === "publish") app.innerHTML = publishView();
  if (state.view === "detail") app.innerHTML = detailView();
  if (state.view === "rdv") app.innerHTML = rdvView();
  if (state.view === "success") app.innerHTML = successView();
  if (state.view === "mine") app.innerHTML = mineView();
  bind();
}

function nav(active) {
  return `
    <nav class="nav">
      <button data-go="home" class="${active === "home" ? "active" : ""}">Accueil</button>
      <button data-go="feed" class="${active === "feed" ? "active" : ""}">Fil</button>
      <button data-go="publish" class="${active === "publish" ? "active" : ""}">Publier</button>
      <button data-go="mine" class="${active === "mine" ? "active" : ""}">Moi</button>
    </nav>
  `;
}

function itemCard(item) {
  const closed = item.status !== "open";
  return `
    <button type="button" class="card" data-open="${item.id}">
      <div class="thumb ${item.category}">${ICONS[item.category] || "📦"}</div>
      <div>
        <strong>${item.title}</strong>
        <p class="meta">${item.place} · ${item.when}</p>
        <div class="tags">
          <span class="tag ${closed ? "clos" : item.type}">${closed ? "Récupéré" : typeLabel[item.type]}</span>
          <span class="tag ${item.type}">${item.place}</span>
        </div>
      </div>
    </button>
  `;
}

function homeView() {
  const recent = state.items.filter((i) => i.status === "open").slice(0, 3);
  return `
    <div class="top">
      <div>
        <p class="eyebrow">Campus · aujourd’hui</p>
        <h1 class="brand">Récup’</h1>
      </div>
      <span class="chip">Lina · 2e</span>
    </div>
    <section class="hero">
      <h2>Badge perdu ? Quelqu’un l’a peut-être déjà posté.</h2>
      <p>Le tableau unique du campus : objets trouvés, recherches, et prêts entre étudiants.</p>
    </section>
    <div class="actions">
      <button class="action found" data-publish="trouve"><span class="ico">👀</span><strong>J’ai trouvé</strong><span>Le poster</span></button>
      <button class="action lost" data-publish="cherche"><span class="ico">🔍</span><strong>J’ai perdu</strong><span>Le chercher</span></button>
      <button class="action lend" data-publish="pret"><span class="ico">🤝</span><strong>Je prête</strong><span>Dépanner</span></button>
    </div>
    <div class="section-title">
      <span>À récupérer près de toi</span>
    </div>
    ${recent.map(itemCard).join("")}
    ${nav("home")}
  `;
}

function feedView() {
  const items = state.items.filter((i) => i.type === state.tab);
  return `
    <button class="back" data-go="home">← Accueil</button>
    <h2 class="page-title">Annonces</h2>
    <div class="tabs">
      <button data-tab="trouve" class="${state.tab === "trouve" ? "active" : ""}">Trouvé</button>
      <button data-tab="cherche" class="${state.tab === "cherche" ? "active" : ""}">Cherché</button>
      <button data-tab="pret" class="${state.tab === "pret" ? "active" : ""}">Prêt</button>
    </div>
    ${items.length ? items.map(itemCard).join("") : `<p class="empty">Rien pour l’instant. Publie la première annonce.</p>`}
    ${nav("feed")}
  `;
}

function publishView() {
  const labels = {
    trouve: "J’ai trouvé un objet",
    cherche: "J’ai perdu un objet",
    pret: "Je peux prêter",
  };
  return `
    <button class="back" data-go="home">← Accueil</button>
    <h2 class="page-title">${labels[state.publishType]}</h2>
    <div class="tabs">
      <button data-pubtab="trouve" class="${state.publishType === "trouve" ? "active" : ""}">Trouvé</button>
      <button data-pubtab="cherche" class="${state.publishType === "cherche" ? "active" : ""}">Perdu</button>
      <button data-pubtab="pret" class="${state.publishType === "pret" ? "active" : ""}">Prêt</button>
    </div>
    <form class="form" id="publish-form">
      <div>
        <label>Catégorie</label>
        <select name="category">
          <option value="badge">Badge</option>
          <option value="chargeur">Chargeur</option>
          <option value="calculatrice">Calculatrice</option>
          <option value="ecouteurs">Écouteurs</option>
          <option value="usb">Clé USB</option>
          <option value="veste">Veste</option>
          <option value="hdmi">HDMI</option>
          <option value="cles">Clés</option>
        </select>
      </div>
      <div>
        <label>Titre</label>
        <input name="title" required placeholder="Badge étudiant, lanière bleue" />
      </div>
      <div>
        <label>Lieu</label>
        <select name="place">
          <option>Cafet</option>
          <option>BU, 2e étage</option>
          <option>Hall principal</option>
          <option>Amphi B</option>
          <option>Salle 204</option>
        </select>
      </div>
      <div>
        <label>Note</label>
        <textarea name="note" placeholder="Un détail pour reconnaître l’objet"></textarea>
      </div>
      <button class="btn primary" type="submit">Publier en 30 secondes</button>
    </form>
    ${nav("publish")}
  `;
}

function selected() {
  return state.items.find((i) => i.id === state.selectedId);
}

function detailView() {
  const item = selected();
  if (!item) return homeView();
  const cta =
    item.type === "pret"
      ? "Je peux l’emprunter"
      : item.type === "cherche"
        ? "Je l’ai peut-être"
        : "C’est à moi";
  return `
    <button class="back" data-go="feed">← Annonces</button>
    <div class="detail-hero thumb ${item.category}">${ICONS[item.category]}</div>
    <div class="tags" style="margin-bottom:10px">
      <span class="tag ${item.status === "open" ? item.type : "clos"}">${item.status === "open" ? typeLabel[item.type] : "Récupéré"}</span>
    </div>
    <h2 class="page-title">${item.title}</h2>
    <p class="meta">${item.place} · ${item.when} · par ${item.author}</p>
    <p style="line-height:1.5;margin:12px 0 20px">${item.note}</p>
    ${
      item.status === "open"
        ? `<button class="btn primary" data-go="rdv">${cta}</button>`
        : `<p class="empty">Cette annonce est déjà clôturée.</p>`
    }
    ${nav("feed")}
  `;
}

function rdvView() {
  const item = selected();
  const action = item?.type === "pret" ? "emprunt" : "récupération";
  return `
    <button class="back" data-go="detail">← Fiche</button>
    <h2 class="page-title">Fixer un RDV</h2>
    <p class="meta" style="margin-bottom:14px">Pour la ${action} de « ${item.title} »</p>
    <form class="form" id="rdv-form">
      <div>
        <label>Lieu sur le campus</label>
        <select name="place">
          <option>BU, 2e étage</option>
          <option>Cafet</option>
          <option>Hall principal</option>
        </select>
      </div>
      <div>
        <label>Heure</label>
        <select name="time">
          <option>14h00</option>
          <option>14h30</option>
          <option>16h00</option>
          <option>18h00</option>
        </select>
      </div>
      <button class="btn dark" type="submit">Confirmer le RDV</button>
    </form>
    ${nav("feed")}
  `;
}

function successView() {
  const item = selected();
  return `
    <div class="success">
      <div class="thumb ${item.category}" style="margin:0 auto 8px">${ICONS[item.category]}</div>
      <h2>C’est récupéré.</h2>
      <p>RDV à la BU, 14h. Lina retrouve Karim. L’annonce est clôturée.</p>
      <div class="rdv-card">
        <strong>${item.title}</strong>
        <p class="meta">BU, 2e étage · 14h00</p>
        <span class="tag clos">Récupéré</span>
      </div>
      <button class="btn primary" data-go="home">Retour à l’accueil</button>
    </div>
    ${nav("home")}
  `;
}

function mineView() {
  const items = state.items.filter((i) => state.mine.includes(i.id) || i.author === "Lina" || i.author === "Karim");
  return `
    <button class="back" data-go="home">← Accueil</button>
    <h2 class="page-title">Mes Récup’</h2>
    <p class="meta" style="margin-bottom:14px">Tes annonces, tes RDV, tes clôtures.</p>
    ${items.map(itemCard).join("")}
    ${nav("mine")}
  `;
}

function bind() {
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => {
      state.view = el.dataset.go;
      render();
    });
  });
  document.querySelectorAll("[data-publish]").forEach((el) => {
    el.addEventListener("click", () => {
      state.publishType = el.dataset.publish;
      state.view = "publish";
      render();
    });
  });
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      state.tab = el.dataset.tab;
      render();
    });
  });
  document.querySelectorAll("[data-pubtab]").forEach((el) => {
    el.addEventListener("click", () => {
      state.publishType = el.dataset.pubtab;
      render();
    });
  });
  document.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedId = el.dataset.open;
      state.view = "detail";
      render();
    });
  });
  const form = $("#publish-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const item = {
        id: "new-" + Date.now(),
        type: state.publishType,
        category: data.category,
        title: data.title,
        place: data.place,
        when: "à l’instant",
        note: data.note || "Annonce publiée depuis Récup’.",
        author: "Lina",
        status: "open",
      };
      state.items.unshift(item);
      state.mine.push(item.id);
      state.selectedId = item.id;
      state.tab = item.type;
      state.view = "detail";
      render();
    });
  }
  const rdv = $("#rdv-form");
  if (rdv) {
    rdv.addEventListener("submit", (e) => {
      e.preventDefault();
      const item = selected();
      if (item) item.status = "closed";
      state.view = "success";
      render();
    });
  }
}

function tick() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const clock = $("#clock");
  if (clock) clock.textContent = `${h}:${m}`;
}

function applyRoute() {
  const p = new URLSearchParams(location.search);
  if (p.get("view")) state.view = p.get("view");
  if (p.get("tab")) state.tab = p.get("tab");
  if (p.get("id")) state.selectedId = p.get("id");
  if (p.get("type")) state.publishType = p.get("type");
  if (state.view === "success" && selected()) selected().status = "closed";
}

tick();
setInterval(tick, 10000);
applyRoute();
render();
