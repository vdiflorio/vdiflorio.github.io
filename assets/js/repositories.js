(function () {

  // ── Profile card ──────────────────────────────────────────────────────────
  var grid = document.getElementById('repo-grid');
  var repos = JSON.parse((grid && grid.getAttribute('data-repos')) || '[]');
  var username = repos.length > 0 ? repos[0].split('/')[0] : '';

  var profileEl = document.getElementById('github-profile');
  if (profileEl && username) {
    var avatarUrl = 'https://avatars.githubusercontent.com/' + username;

    // Render immediately with avatar; stats filled in once API responds
    profileEl.innerHTML =
      '<div class="d-flex align-items-center p-3" style="' +
          'border:1px solid var(--global-divider-color);' +
          'background:var(--global-card-bg-color);' +
          'border-radius:6px;max-width:480px;">' +
        '<img src="' + avatarUrl + '" alt="' + username + '"' +
             ' style="width:72px;height:72px;border-radius:50%;margin-right:1.25rem;flex-shrink:0;">' +
        '<div>' +
          '<div style="font-weight:600;font-size:1rem;color:var(--global-text-color);" id="gh-profile-name">' + username + '</div>' +
          '<div style="font-size:0.85rem;color:var(--global-text-color-light);margin-top:0.25rem;" id="gh-profile-bio"></div>' +
          '<div style="font-size:0.8rem;color:var(--global-text-color-light);margin-top:0.5rem;" id="gh-profile-stats"></div>' +
          '<a href="https://github.com/' + username + '" target="_blank" rel="noopener noreferrer"' +
             ' style="font-size:0.8rem;color:var(--global-theme-color);text-decoration:none;margin-top:0.4rem;display:inline-block;"' +
             ' onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' +
            'github.com/' + username +
          '</a>' +
        '</div>' +
      '</div>';

    fetch('https://api.github.com/users/' + username)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var nameEl = document.getElementById('gh-profile-name');
        var bioEl  = document.getElementById('gh-profile-bio');
        var statsEl = document.getElementById('gh-profile-stats');
        if (nameEl && data.name) nameEl.textContent = data.name;
        if (bioEl  && data.bio)  bioEl.textContent  = data.bio;
        if (statsEl) {
          statsEl.textContent =
            data.public_repos + ' repositories · ' + data.followers + ' followers';
        }
      })
      .catch(function () {}); // silently keep the avatar-only card on failure
  }

  // ── Repo cards ────────────────────────────────────────────────────────────
  if (!grid) return;

  var descriptions = JSON.parse(grid.getAttribute('data-descriptions') || '[]');
  var errorMsg     = document.getElementById('repo-error');
  var failed       = 0;

  var langColors = {
    Python: '#3572A5', 'C++': '#f34b7d', C: '#555555',
    JavaScript: '#f1e05a', MATLAB: '#e16737', Fortran: '#4d41b1',
    Julia: '#a270ba', Shell: '#89e051', HTML: '#e34c26', default: '#828282'
  };

  function renderCard(data, fallbackDesc) {
    var lang  = data.language || 'N/A';
    var color = langColors[lang] || langColors.default;
    var stars = data.stargazers_count;
    var forks = data.forks_count;
    var desc  = (data.description && data.description.trim()) ? data.description : (fallbackDesc || 'No description available.');
    var updatedAt = new Date(data.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });

    var col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML =
      '<div class="card h-100" style="border:1px solid var(--global-divider-color);background:var(--global-card-bg-color);border-radius:6px;transition:box-shadow 0.2s ease;"' +
          ' onmouseover="this.style.boxShadow=\'0 2px 12px rgba(0,0,0,0.1)\'"' +
          ' onmouseout="this.style.boxShadow=\'none\'">' +
        '<div class="card-body d-flex flex-column p-3">' +
          '<div class="d-flex align-items-center mb-2">' +
            '<i class="fa-solid fa-book-open me-2" style="color:var(--global-text-color-light);font-size:0.85rem;"></i>' +
            '<a href="' + data.html_url + '" target="_blank" rel="noopener noreferrer"' +
               ' style="color:var(--global-theme-color);font-weight:600;font-size:0.95rem;text-decoration:none;"' +
               ' onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' +
              data.name +
            '</a>' +
          '</div>' +
          '<p class="card-text small mb-3" style="color:var(--global-text-color);line-height:1.5;flex-grow:1;">' + desc + '</p>' +
          '<div class="d-flex align-items-center mt-auto" style="font-size:0.8rem;color:var(--global-text-color-light);gap:0.75rem;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + color + ';margin-right:4px;"></span>' + lang + '</span>' +
            '<span><i class="fa-regular fa-star me-1"></i>' + stars + '</span>' +
            '<span><i class="fa-solid fa-code-fork me-1"></i>' + forks + '</span>' +
            '<span style="margin-left:auto;">Updated ' + updatedAt + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    grid.appendChild(col);
  }

  repos.forEach(function (repoPath, i) {
    fetch('https://api.github.com/repos/' + repoPath)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) { renderCard(data, descriptions[i]); })
      .catch(function () {
        failed++;
        if (errorMsg && failed === repos.length) errorMsg.style.display = 'block';
      });
  });

})();
