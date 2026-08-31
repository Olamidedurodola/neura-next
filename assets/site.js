/* Minimal progressive enhancement.
   No analytics, no third-party trackers, no claim-bearing content. */

(function () {
  "use strict";

  var here = location.pathname.split("/").pop() || "index.html";
  var feedPages = {
    "feed.html": true,
    "status.html": true,
    "science.html": true,
    "regulatory.html": true,
    "participate.html": true
  };
  var links = document.querySelectorAll("nav.main a, nav.arm a");
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href === here) {
      links[i].setAttribute("aria-current", "page");
    }
    if (href === "feed.html" && feedPages[here] && links[i].closest("nav.main")) {
      links[i].setAttribute("aria-current", "page");
    }
  }

  var header = document.querySelector("header.site-header, header.masthead");
  var toggle = document.querySelector(".menu-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
  }

  var form = document.querySelector("form.inquiry");
  if (form) {
    var action = form.getAttribute("action") || "";
    var unconfigured = action === "" || action.indexOf("REPLACE_WITH") !== -1;
    if (unconfigured) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var contact = document.getElementById("contact-email");
        var to = contact ? contact.textContent.trim() : "";
        if (!to) return;

        var get = function (id) {
          var el = document.getElementById(id);
          return el ? el.value.trim() : "";
        };

        var body = [
          "Name: " + get("name"),
          "Organization: " + get("organization"),
          "Role: " + get("role"),
          "State: " + get("state"),
          "Email: " + get("email"),
          "Interest: " + get("interest"),
          "",
          "Message:",
          get("message")
        ].join("\n");

        var subject = "Program inquiry: " + (get("interest") || "general");
        window.location.href =
          "mailto:" + to +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      });
    }
  }

  var WEB3FORMS_ACCESS_KEY = "6b408c0a-c86d-4ea9-bfab-52aca6d54205";
  var RECIPIENT_EMAIL = "ola@jakpar.com";
  var JAKPAR_WEBSITE = "https://group.jakpar.com/";
  var SUBJECT_LINE = "Website Enquiry via NeuraNext";

  var footer = document.querySelector("footer.site");
  if (footer && !document.querySelector(".developed-by")) {
    var credit = document.createElement("div");
    credit.className = "developed-by";
    credit.innerHTML =
      'Developed by <button type="button" id="jk-open" aria-label="Contact Jakpar about a website">' +
      '<span class="jk-letter">J</span><span class="jk-letter">a</span><span class="jk-letter">k</span>' +
      '<span class="jk-letter">p</span><span class="jk-letter">a</span><span class="jk-letter">r</span>' +
      "</button>";
    footer.appendChild(credit);
  }

  if (!document.getElementById("jk-overlay")) {
    var overlay = document.createElement("div");
    overlay.id = "jk-overlay";
    overlay.className = "jk-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "jk-title");
    overlay.innerHTML =
      '<div class="jk-modal">' +
        '<button class="jk-close" type="button" aria-label="Close">&times;</button>' +
        '<div id="jk-form-view">' +
          '<h2 id="jk-title">Work with Jakpar</h2>' +
          '<p class="jk-lead">Need a website, app, or digital product? Send a message and Ola will be in touch.</p>' +
          '<form id="jk-form">' +
            '<div class="jk-field"><label for="jk-name">Your name</label>' +
            '<input id="jk-name" name="name" autocomplete="name" placeholder="Jane Smith" required></div>' +
            '<div class="jk-field"><label for="jk-email">Your email</label>' +
            '<input id="jk-email" name="email" type="email" autocomplete="email" placeholder="jane@company.com" required></div>' +
            '<div class="jk-field"><label for="jk-message">Tell us about your project</label>' +
            '<textarea id="jk-message" name="message" placeholder="I need a website for my nonprofit / startup / personal brand..." required></textarea></div>' +
            '<p class="jk-error" id="jk-error" hidden></p>' +
            '<div class="jk-actions">' +
              '<a class="jk-work" href="' + JAKPAR_WEBSITE + '" target="_blank" rel="noopener noreferrer">See our work &#8599;</a>' +
              '<button class="jk-send" type="submit">Send message</button>' +
            "</div>" +
          "</form>" +
        "</div>" +
        '<div class="jk-success" id="jk-success" hidden>' +
          "<h2>Message sent!</h2>" +
          '<p id="jk-thanks"></p>' +
          '<div class="jk-actions" style="justify-content:center;margin-top:18px">' +
            '<button class="jk-send" type="button" id="jk-done">Close</button>' +
          "</div>" +
        "</div>" +
      "</div>";
    document.body.appendChild(overlay);
  }

  var overlay = document.getElementById("jk-overlay");
  var openBtn = document.getElementById("jk-open");
  var jkForm = document.getElementById("jk-form");
  var formView = document.getElementById("jk-form-view");
  var successView = document.getElementById("jk-success");
  var errEl = document.getElementById("jk-error");

  function openModal() {
    formView.hidden = false;
    successView.hidden = true;
    jkForm.reset();
    errEl.hidden = true;
    overlay.classList.add("is-open");
    var name = document.getElementById("jk-name");
    if (name) name.focus();
  }
  function closeModal() {
    overlay.classList.remove("is-open");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  overlay.querySelector(".jk-close").addEventListener("click", closeModal);
  var done = document.getElementById("jk-done");
  if (done) done.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
  });

  jkForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("jk-name").value.trim();
    var email = document.getElementById("jk-email").value.trim();
    var message = document.getElementById("jk-message").value.trim();
    var sendBtn = jkForm.querySelector(".jk-send");
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    errEl.hidden = true;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: SUBJECT_LINE,
        from_name: name,
        email: RECIPIENT_EMAIL,
        replyto: email,
        message: "Name: " + name + "\nEmail: " + email + "\n\n" + message
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) throw new Error(json.message || "Submission failed");
        document.getElementById("jk-thanks").textContent =
          "Thanks! Ola will get back to you shortly at " + email + ".";
        formView.hidden = true;
        successView.hidden = false;
      })
      .catch(function (err) {
        errEl.hidden = false;
        errEl.textContent = err.message || "Something went wrong. Please try again.";
      })
      .then(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";
      });
  });
})();
