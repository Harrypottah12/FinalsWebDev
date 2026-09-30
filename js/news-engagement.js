(function () {
  ICON_PATHS.comment = '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
  ICON_PATHS.send = '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>';

  state.newsLikes = store.get('lms_news_likes', {});
  state.newsComments = store.get('lms_news_comments', {});
  const openThreads = new Set();

  const _persist35 = persist;
  persist = function () {
    _persist35();
    store.set('lms_news_likes', state.newsLikes);
    store.set('lms_news_comments', state.newsComments);
  };

  const commentsOf = id => state.newsComments[id] || [];

  function commentHTML(c) {
    const me = state.userProfile.name;
    return `<li class="cm" data-cm="${esc(c.id)}">
      <span class="cm-av" style="${avatarStyle(c.author)}">${avatarHTML(c.author, c.author === me ? state.userProfile.avatar : null)}</span>
      <div class="cm-body">
        <div class="cm-meta"><b>${esc(c.author)}</b><span>${timeAgo(c.ts)}</span>
          ${c.mine ? `<button type="button" class="cm-del" data-cm-del="${esc(c.id)}" aria-label="Delete comment">${iconSVG('trash')}</button>` : ''}</div>
        <p>${esc(c.text)}</p>
      </div></li>`;
  }

  function actionsHTML(id) {
    const liked = !!state.newsLikes[id];
    const n = commentsOf(id).length;
    const open = openThreads.has(id);
    return `
      <div class="post-actions">
        <button type="button" class="pa-btn pa-like ${liked ? 'on' : ''}" data-like="${esc(id)}" aria-pressed="${liked}" aria-label="${liked ? 'Unlike' : 'Like'}">
          ${iconSVG('heart')}<span>${liked ? 'Liked' : 'Like'}</span>${liked ? '<em>1</em>' : ''}
        </button>
        <button type="button" class="pa-btn pa-comment ${open ? 'on' : ''}" data-comment-toggle="${esc(id)}" aria-expanded="${open}">
          ${iconSVG('comment')}<span>Comment</span>${n ? `<em>${n}</em>` : ''}
        </button>
      </div>
      <div class="post-thread" ${open ? '' : 'hidden'}>
        <ul class="cm-list">${commentsOf(id).map(commentHTML).join('')}</ul>
        <div class="cm-form">
          <span class="cm-av" style="${avatarStyle(state.userProfile.name)}">${avatarHTML(state.userProfile.name, state.userProfile.avatar)}</span>
          <input type="text" class="cm-input" data-cm-input="${esc(id)}" placeholder="Write a comment..." maxlength="500" aria-label="Write a comment">
          <button type="button" class="cm-send" data-cm-send="${esc(id)}" aria-label="Post comment">${iconSVG('send')}</button>
        </div>
      </div>`;
  }

  function decorate(box) {
    box.querySelectorAll('article.post[data-post]').forEach(art => {
      if (art.querySelector('.post-actions')) return;
      art.insertAdjacentHTML('beforeend', actionsHTML(art.dataset.post));
    });
    renderIcons(box);
  }

  function refresh(art, keepFocus) {
    const id = art.dataset.post;
    const wasFocused = keepFocus && art.querySelector('.cm-input') === document.activeElement;
    const draft = (art.querySelector('.cm-input') || {}).value || '';
    art.querySelectorAll('.post-actions, .post-thread').forEach(n => n.remove());
    art.insertAdjacentHTML('beforeend', actionsHTML(id));
    renderIcons(art);
    const inp = art.querySelector('.cm-input');
    if (inp) { inp.value = draft; if (wasFocused) inp.focus(); }
  }

  const _renderNews35 = renderNews;
  renderNews = function () {
    _renderNews35();
    const box = document.getElementById('announcement-feed');
    if (box) decorate(box);
  };

  function submit(art) {
    const id = art.dataset.post;
    const inp = art.querySelector('.cm-input');
    const text = inp.value.trim();
    if (!text) return;
    (state.newsComments[id] = state.newsComments[id] || []).push({
      id: 'c' + Date.now(), author: state.userProfile.name, mine: true, ts: Date.now(), text
    });
    persist();
    inp.value = '';
    refresh(art, true);
    const list = art.querySelector('.cm-list'); if (list) list.lastElementChild && list.lastElementChild.scrollIntoView({ block: 'nearest' });
  }

  const feed = document.getElementById('announcement-feed');
  feed.addEventListener('click', (e) => {
    const art = e.target.closest('article.post'); if (!art) return;
    const id = art.dataset.post;
    if (e.target.closest('[data-like]')) {
      state.newsLikes[id] = !state.newsLikes[id];
      if (!state.newsLikes[id]) delete state.newsLikes[id];
      persist(); refresh(art);
      return;
    }
    if (e.target.closest('[data-comment-toggle]')) {
      openThreads.has(id) ? openThreads.delete(id) : openThreads.add(id);
      refresh(art);
      if (openThreads.has(id)) { const i = art.querySelector('.cm-input'); if (i) i.focus(); }
      return;
    }
    if (e.target.closest('[data-cm-send]')) { submit(art); return; }
    const del = e.target.closest('[data-cm-del]');
    if (del) {
      state.newsComments[id] = commentsOf(id).filter(c => c.id !== del.dataset.cmDel);
      persist(); refresh(art);
    }
  });
  feed.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.cm-input')) { e.preventDefault(); submit(e.target.closest('article.post')); }
  });

  document.addEventListener('click', (e) => {
    const d = e.target.closest && e.target.closest('[data-del]'); if (!d || !feed.contains(d)) return;
    const id = d.dataset.del;
    setTimeout(() => {
      if (!state.news.some(p => p.id === id)) { delete state.newsLikes[id]; delete state.newsComments[id]; openThreads.delete(id); persist(); }
    }, 0);
  });

  renderNews();
})();
