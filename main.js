/* ============================================================
   main.js
   Navbar, mobile menu, theme toggle, scroll behavior,
   IntersectionObserver reveals, project filtering, project modal,
   and contact form validation.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initScrollSpy();
  renderProjects("all");
  renderCertifications();
  initReveal();
  initProjectFilter();
  initProjectModal();
  initSkillTilt();
  initCornerTilt();
  initMagneticButtons();
});

/* ---------------- THEME TOGGLE ---------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "abinaya-portfolio-theme";

  const stored = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* ---------------- NAVBAR + MOBILE MENU ---------------- */
function initNav() {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-compact", window.scrollY > 40);
  });

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("is-open");
    document.body.classList.remove("nav-lock");
  };

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.classList.toggle("is-open", isOpen);
    document.body.classList.remove("nav-lock");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMenu();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", targetId);
      }
    });
  });

  // Clicking anywhere outside the left drawer closes it.
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("is-open") && !navMenu.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close mobile menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });
}

/* ---------------- SCROLL SPY (active nav link) ---------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("data-section") === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spyObserver.observe(section));
}

/* ---------------- SCROLL REVEAL ---------------- */
let revealObserver;
let sectionReplayObserver;

function initReveal() {
  // Replay every section animation whenever it enters the viewport.
  // This intentionally does NOT unobserve elements, so scrolling up/down
  // triggers the entrance animation again each time.
  const sections = document.querySelectorAll("main section");

  sections.forEach((section) => {
    section.classList.add("replay-section");
    const visualRoot = section.querySelector(":scope > .section-inner, :scope > .hero-inner");
    if (visualRoot) visualRoot.classList.add("section-replay-content");

    // Make static section headings participate in the replay too.
    section.querySelectorAll(
      ":scope > .section-inner > .section-kicker, :scope > .section-inner > .section-heading, :scope > .section-inner > .section-sub"
    ).forEach((el) => el.classList.add("reveal"));
  });

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          // Remove the state when it leaves so the next entrance replays it.
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  sectionReplayObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        if (entry.isIntersecting) {
          section.classList.remove("section-replay-active");
          // Force a fresh transition on every entrance.
          void section.offsetWidth;
          section.classList.add("section-replay-active");

          const items = section.querySelectorAll(
            ".section-heading, .section-kicker, .section-sub, .about-copy, .about-card, .skill-category, .skills-marquee, .project-card, .cert-card, .education-card, .profile-card, .connect-panel, .resume-cta-inner"
          );
          items.forEach((el, index) => {
            el.style.setProperty("--replay-delay", `${Math.min(index * 70, 420)}ms`);
          });
        } else {
          section.classList.remove("section-replay-active");
          section.querySelectorAll(".reveal").forEach((el) => el.classList.remove("is-visible"));
        }
      });
    },
    { threshold: 0.18, rootMargin: "-4% 0px -28% 0px" }
  );

  sections.forEach((section) => {
    sectionReplayObserver.observe(section);
    section.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  });

  window.observeReveals = () => {
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  };
}

/* ---------------- PROJECT FILTERING ---------------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll(".project-card");

      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.group === filter;
        if (matches) {
          card.classList.remove("is-hidden");
          requestAnimationFrame(() => card.classList.add("is-shown"));
        } else {
          card.classList.remove("is-shown");
          card.classList.add("is-hidden");
        }
      });
    });
  });
}

/* ---------------- PROJECT DETAILS MODAL ---------------- */
function initProjectModal() {
  const overlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("modalClose");
  let lastFocused = null;

  document.getElementById("projectsGrid").addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-action="view-details"]');
    if (!trigger) return;

    const project = getProjectById(trigger.dataset.projectId);
    if (!project) return;

    lastFocused = trigger;
    modalBody.innerHTML = buildModalContent(project);
    overlay.classList.add("is-open");
    document.body.classList.add("nav-lock");
    closeBtn.focus();
  });

  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("nav-lock");
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
  });
}

function buildModalContent(project) {
  const featuresHtml = project.features.map((f) => `<li>${f}</li>`).join("");
  const techHtml = project.tech.map((t) => `<span class="tech-pill">${t}</span>`).join("");
  const dbConceptsHtml = project.dbConcepts
    ? `<div class="modal-block"><h4>Database Concepts</h4><div class="chip-row">${project.dbConcepts
        .map((c) => `<span class="chip">${c}</span>`)
        .join("")}</div></div>`
    : "";

  return `
    <p class="project-category" id="modalTitle">${project.category}</p>
    <h3 class="modal-heading">${project.title}</h3>
    <p class="modal-desc">${project.description}</p>

    <div class="modal-block">
      <h4>Tech Stack</h4>
      <div class="tech-row">${techHtml}</div>
    </div>

    <div class="modal-block">
      <h4>Problem</h4>
      <p>${project.problem}</p>
    </div>

    <div class="modal-block">
      <h4>Solution</h4>
      <p>${project.solution}</p>
    </div>

    <div class="modal-block">
      <h4>Technical Implementation</h4>
      <p>${project.implementation}</p>
    </div>

    ${dbConceptsHtml}


    <div class="modal-block">
      <h4>Key Features</h4>
      <ul class="modal-feature-list">${featuresHtml}</ul>
    </div>

    <a href="${project.github}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
  `;
}

/* ---------------- CONTACT FORM VALIDATION ---------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("cf-name"),
    email: document.getElementById("cf-email"),
    subject: document.getElementById("cf-subject"),
    message: document.getElementById("cf-message")
  };
  const errors = {
    name: document.getElementById("err-name"),
    email: document.getElementById("err-email"),
    subject: document.getElementById("err-subject"),
    message: document.getElementById("err-message")
  };
  const note = document.getElementById("formNote");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_MESSAGE_LENGTH = 20;

  function setError(key, message) {
    errors[key].textContent = message;
    fields[key].classList.toggle("has-error", Boolean(message));
    fields[key].setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    let valid = true;

    if (!fields.name.value.trim()) {
      setError("name", "Please enter your name.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!fields.email.value.trim()) {
      setError("email", "Please enter your email.");
      valid = false;
    } else if (!EMAIL_RE.test(fields.email.value.trim())) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (!fields.subject.value.trim()) {
      setError("subject", "Please enter a subject.");
      valid = false;
    } else {
      setError("subject", "");
    }

    const messageLength = fields.message.value.trim().length;
    if (!messageLength) {
      setError("message", "Please enter a message.");
      valid = false;
    } else if (messageLength < MIN_MESSAGE_LENGTH) {
      setError("message", `Message should be at least ${MIN_MESSAGE_LENGTH} characters.`);
      valid = false;
    } else {
      setError("message", "");
    }

    return valid;
  }

  Object.values(fields).forEach((field) => {
    field.addEventListener("blur", validate);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.classList.remove("is-success");

    if (!validate()) {
      note.textContent = "Please fix the highlighted fields above.";
      return;
    }

    // No backend/email service is configured. This performs
    // frontend validation only and does not send an actual email.
    note.textContent = "Thanks! This form only validates input in the browser \u2014 no message was actually sent. Please reach out directly via email or LinkedIn.";
    note.classList.add("is-success");
    form.reset();
  });
}

function initSkillTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`); card.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`); card.style.transform=`perspective(900px) rotateX(${y*-4}deg) rotateY(${x*4}deg) translateY(-5px)`; });
    card.addEventListener('pointerleave', () => { card.style.transform=''; card.style.removeProperty('--mx'); card.style.removeProperty('--my'); });
  });
}
function initCornerTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rotateX = y * -5;
      const rotateY = x * 5;
      const lift = -5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${lift}px)`;
      card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => { btn.addEventListener('pointermove', e => { const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px, ${(e.clientY-r.top-r.height/2)*.08}px)`; }); btn.addEventListener('pointerleave',()=>btn.style.transform=''); });
}

/* ---------------- HERO ROLE TYPING ---------------- */
function initHeroTyping() {
  const el = document.getElementById('typingRole');
  if (!el) return;
  const roles = [
    'Java Full Stack Developer',
    'Backend Developer',
    'Software Developer',
    'Web Application Developer'
  ];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { el.textContent = roles[0]; return; }

  function tick() {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 450);
        return;
      }
      setTimeout(tick, 45);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      el.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
      setTimeout(tick, 70);
    }
  }
  setTimeout(tick, 1800);
}

document.addEventListener('DOMContentLoaded', initHeroTyping);
