/* CORRECTION: Wrapped navigation logic in DOMContentLoaded so it waits for HTML to load */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("ham-btn");
  const navUL = document.querySelector("#nav-bar ul");

  if (hamburger && navUL) {
    // Toggle menu
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navUL.classList.toggle("open");
    });
  }

  // Reset menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && navUL && hamburger) {
      navUL.classList.remove("open");
      hamburger.classList.remove("active");
    }
  });
});

/* CORRECTION: Wrapped Footer logic in DOMContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
  const footerYear = document.getElementById("currentyear");
  const lastMod = document.getElementById("lastModified");

  if (footerYear) footerYear.textContent = new Date().getFullYear();
  if (lastMod) lastMod.textContent = document.lastModified;
});

/* CORRECTION: Wrapped Grid/List view logic in DOMContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
  const gridBtn = document.getElementById("gridView");
  const listBtn = document.getElementById("listView");
  const membersSection = document.getElementById("members");

  if (gridBtn && listBtn && membersSection) {
    gridBtn.addEventListener("click", () => {
      membersSection.classList.add("grid");
      membersSection.classList.remove("list");
    });

    listBtn.addEventListener("click", () => {
      membersSection.classList.add("list");
      membersSection.classList.remove("grid");
    });
  }
});

/* Animation Logic */
document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.querySelector(".membership-cards");
  if (cardsContainer) {
    setTimeout(() => {
      cardsContainer.classList.add("animate");
    }, 150);
  }
});

/* Timestamp Logic */
document.addEventListener("DOMContentLoaded", () => {
  const ts = document.getElementById("timestamp");
  if (ts) {
    ts.value = new Date().toISOString();
  }
});

/* Modal Logic */
document.addEventListener("DOMContentLoaded", () => {
  const modalOpeners = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".modal");
  const openerMap = new Map();

  modalOpeners.forEach((btn) => {
    if (btn.tagName.toLowerCase() === "button") btn.type = "button";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalID = btn.dataset.modal;
      const modal = document.getElementById(modalID);
      if (modal) {
        openerMap.set(modalID, btn);

        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");

        const closeBtn = modal.querySelector(".close");
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  document.querySelectorAll(".modal .close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      const modal = closeBtn.closest(".modal");
      if (modal) {
        const id = modal.id;
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        
        const opener = openerMap.get(id);
        if (opener && typeof opener.focus === "function") opener.focus();
      }
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("modal")) {
      const modal = e.target;
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      const opener = openerMap.get(modal.id);
      if (opener && typeof opener.focus === "function") opener.focus();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      modals.forEach((m) => {
        if (m.style.display === "block") {
          m.style.display = "none";
          m.setAttribute("aria-hidden", "true");
          const opener = openerMap.get(m.id);
          if (opener && typeof opener.focus === "function") opener.focus();
        }
      });
    }
  });
});

/* Form Validation Logic */
document.addEventListener("DOMContentLoaded", () => {
  const joinForm =
    document.getElementById("joinForm") ||
    document.getElementById("join-form");

  if (joinForm) {
    joinForm.addEventListener("submit", (evt) => {
      const requiredFields = joinForm.querySelectorAll("[required]");
      for (let field of requiredFields) {
        if (!field.value.trim()) {
          evt.preventDefault();
          alert("Please complete all required fields.");
          field.focus();
          return;
        }
      }
    });
  }
});

/* Thank You Page Data Retrieval */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

/* CORRECTION: Wrapped data output in DOMContentLoaded to prevent errors if elements aren't ready */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('out-firstname')) {
      document.getElementById('out-firstname').textContent = getQueryParam('firstname');
      document.getElementById('out-lastname').textContent = getQueryParam('lastname');
      document.getElementById('out-email').textContent = getQueryParam('email');
      document.getElementById('out-phone').textContent = getQueryParam('phone');
      document.getElementById('out-organization').textContent = getQueryParam('organization');

      const ts = getQueryParam('timestamp');
      let formatted = ts;
      if (ts) {
        try {
          const d = new Date(ts);
          if (!isNaN(d)) formatted = d.toLocaleString();
        } catch (e) {}
      }
      document.getElementById('out-timestamp').textContent = formatted;
  }
});