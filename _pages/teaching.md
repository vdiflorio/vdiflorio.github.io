---
layout: page
permalink: /teaching/
title: Teaching
description:
nav: true
nav_order: 5
---

{% assign entry = site.data.cv | where: "title", "Teaching" | first %}
{% if entry %}
<div class="cv">
  <div class="card mt-3 p-3">
    {% include cv/time_table.liquid %}
  </div>
</div>
{% endif %}
