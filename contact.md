---
layout: page
title: Contact
permalink: /contact/
eyebrow: Get in touch
lede: For project briefs, treatments, and general enquiries.
body_class: contact
---

<div class="contact">
  <a class="contact__email reveal" href="mailto:{{ site.data.site_meta.email }}">{{ site.data.site_meta.email }}</a>

  <div class="contact__socials reveal" style="transition-delay: 80ms;">
    {% for link in site.data.site_meta.social %}
      <a href="{{ link.url }}" rel="noopener" target="_blank">
        <span class="contact__social-label">{{ link.label }}</span>
        <span class="contact__social-handle">{{ link.handle }}</span>
      </a>
    {% endfor %}
  </div>
</div>
