---
layout: page
title: Who We Are
permalink: /about/
eyebrow: About
lede: From initial concept to final edit, we take care of every phase of video production.
body_class: about
---

<div class="team">
  {% for person in site.data.team %}
    <article class="team-member reveal" style="transition-delay: {{ forloop.index0 | times: 80 }}ms;">
      <div class="team-member__portrait">
        <span class="team-member__portrait-initials" aria-hidden="true">
          {{ person.name | split: " " | map: "first" | join: "" | slice: 0, 2 | upcase }}
        </span>
        {% comment %} when photos are added under /assets/img/team/, uncomment:
        <img src="{{ person.photo | relative_url }}" alt="{{ person.name }}">
        {% endcomment %}
      </div>

      <div>
        <h2 class="team-member__name">{{ person.name }}</h2>
        <p class="team-member__role">{{ person.role }}</p>
        <p class="team-member__location">{{ person.location }}</p>
      </div>

      <p class="team-member__bio">{{ person.bio }}</p>

      {% if person.links %}
        <div class="team-member__links">
          {% if person.links.instagram %}
            <a href="{{ person.links.instagram }}" rel="noopener" target="_blank">@{{ person.handle }}</a>
          {% endif %}
        </div>
      {% endif %}
    </article>
  {% endfor %}
</div>
