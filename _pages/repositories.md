---
layout: page
permalink: /repositories/
title: Repositories
description: Explore my open-source tools, research software, and ongoing projects.
nav: true
nav_order: 3
---

{% if site.data.repositories.github_users %}

## GitHub Profile

<!-- To hide the profile card, comment out the div below -->
{% assign gh_user = site.data.repositories.github_users | first %}
<div id="github-profile"
  class="mb-4"
  data-username="{{ gh_user }}">
</div>

---

{% endif %}

{% if site.data.repositories.github_repos %}

## GitHub Repositories

<div id="repo-grid"
  class="row g-3 mt-2"
  data-repos='[{% for repo in site.data.repositories.github_repos %}"{{ repo }}"{% unless forloop.last %},{% endunless %}{% endfor %}]'
  data-descriptions='[{% for repo in site.data.repositories.github_repos %}"{{ site.data.repositories.repo_descriptions[repo] }}"{% unless forloop.last %},{% endunless %}{% endfor %}]'
  data-github-user="{{ site.data.repositories.github_users[0] }}">
</div>

<div id="repo-error" class="text-muted small mt-3" style="display:none;">
  Unable to load repository data. Visit <a href="https://github.com/{{ site.data.repositories.github_users[0] }}" target="_blank">my GitHub profile</a> directly.
</div>

<script src="{{ '/assets/js/repositories.js' | relative_url }}"></script>

{% endif %}
