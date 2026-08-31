/* Minimal progressive enhancement.
   No analytics, no third-party trackers, no claim-bearing content. */

(function () {
  "use strict";

  // Mark the current nav item without hardcoding per page.
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

  // Inquiry form: if no form endpoint is configured, fall back to mailto so the
  // page never silently loses a submission.
  var form = document.querySelector("form.inquiry");
  if (!form) return;

  var action = form.getAttribute("action") || "";
  var unconfigured = action === "" || action.indexOf("REPLACE_WITH") !== -1;
  if (!unconfigured) return;

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
})();
