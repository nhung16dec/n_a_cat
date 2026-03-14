/* ============================================
   CATBOUQUET — App Logic
   ============================================ */

let selectedCatId = null;

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderCatGrid();
  checkRouteOnLoad();
  document.getElementById('btn-send').addEventListener('click', handleSend);
  document.getElementById('btn-copy').addEventListener('click', handleCopy);
  document.getElementById('btn-new').addEventListener('click', goToCompose);
});

/* ---- Routing: check URL hash for a message ---- */
function checkRouteOnLoad() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#msg=')) {
    try {
      const encoded = hash.slice(5);
      const data = JSON.parse(atob(decodeURIComponent(encoded)));
      showCard(data);
    } catch(e) {
      goToCompose();
    }
  } else {
    goToCompose();
  }
}

/* ---- Render cat grid ---- */
function renderCatGrid() {
  const grid = document.getElementById('cat-grid');
  grid.innerHTML = '';

  CATS.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.id = cat.id;
    card.innerHTML = `
      <img src="${cat.url}" alt="${cat.name}" loading="lazy" onerror="this.src='https://placecats.com/200/90'"/>
      <div class="cat-name">${cat.name}</div>
    `;
    card.addEventListener('click', () => selectCat(cat.id, card));
    grid.appendChild(card);
  });
}

/* ---- Select a cat ---- */
function selectCat(id, cardEl) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedCatId = id;
  // Scroll into view smoothly
  cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

/* ---- Handle Send ---- */
function handleSend() {
  const to   = document.getElementById('input-to').value.trim();
  const from = document.getElementById('input-from').value.trim();
  const msg  = document.getElementById('input-message').value.trim();
  const err  = document.getElementById('error-msg');

  if (!to || !from || !msg || !selectedCatId) {
    err.textContent = !selectedCatId
      ? '🐱 Please choose a cat first!'
      : '✏️ Please fill in all fields.';
    err.style.animation = 'none';
    requestAnimationFrame(() => {
      err.style.animation = 'shake 0.4s ease';
    });
    return;
  }
  err.textContent = '';

  const cat = CATS.find(c => c.id === selectedCatId);

  const data = { to, from, message: msg, cat };
  const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
  const url = `${location.origin}${location.pathname}#msg=${encoded}`;

  // Update URL without reload
  history.pushState(null, '', `#msg=${encoded}`);
  showCard(data, url);
}

/* ---- Show card page ---- */
function showCard(data, url) {
  document.getElementById('page-compose').classList.remove('active');
  const cardPage = document.getElementById('page-card');
  cardPage.classList.add('active');

  document.getElementById('card-to').textContent = data.to;
  document.getElementById('card-from').textContent = data.from;
  document.getElementById('card-message').textContent = data.message;

  const img = document.getElementById('card-cat-img');
  img.src = data.cat.url;
  img.alt = data.cat.name;
  img.onerror = () => { img.src = 'https://placecats.com/480/300'; };

  // Build share URL from current hash if not passed
  const shareUrl = url || window.location.href;
  document.getElementById('share-url').value = shareUrl;

  // Reset copy button
  const copyBtn = document.getElementById('btn-copy');
  copyBtn.textContent = 'Copy';
  copyBtn.classList.remove('copied');
}

/* ---- Copy link ---- */
async function handleCopy() {
  const urlInput = document.getElementById('share-url');
  const copyBtn  = document.getElementById('btn-copy');

  try {
    await navigator.clipboard.writeText(urlInput.value);
  } catch(e) {
    urlInput.select();
    document.execCommand('copy');
  }

  copyBtn.textContent = 'Copied!';
  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
  }, 2500);

  showToast('Link copied to clipboard 🐾');
}

/* ---- Go back to compose ---- */
function goToCompose() {
  history.pushState(null, '', location.pathname);
  document.getElementById('page-card').classList.remove('active');
  document.getElementById('page-compose').classList.add('active');
  // Reset form
  document.getElementById('input-to').value = '';
  document.getElementById('input-from').value = '';
  document.getElementById('input-message').value = '';
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  selectedCatId = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Toast notification ---- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
