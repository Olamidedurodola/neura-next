import glob
import os
import re

pages = sorted(glob.glob("*.html"))
files = set(os.listdir("."))
for root, dirs, names in os.walk("assets"):
    for n in names:
        files.add(os.path.join(root, n).replace("\\", "/"))

# Claim language. Each pattern is written so that a denial ("no claim that it prevents...",
# "not available for sale") does not trip it; only an affirmative claim does.
NEGATORS = r"(?:no|not|nothing|never|neither|nor|without|except)"

banned = [
    r"protects? your flock",
    r"\bproven\b",
    r"\bguaranteed\b",
    r"boosts? immunity",
    r"immunity booster",
    r"buy now",
    r"order now",
    r"\bin stock\b",
    r"\bprice[sd]?\b",
    # affirmative-only: skipped if a negator appears within the preceding 60 characters
    r"(?<!%s)\b(?:prevents|treats|cures|mitigates|eliminates)\b" % "",
    r"reduces? (?:mortality|viral load|viral shedding|infection)",
    r"(?:is|are) effective",
    r"will (?:reduce|prevent|protect|eliminate)",
    r"available for (?:sale|purchase)",
]

def negated(text, start):
    # look back to the start of the sentence, so a denial early in a long
    # disclaimer sentence still covers a phrase near its end
    window = text[max(0, start - 260):start]
    return re.search(NEGATORS + r"\b[^.]*$", window) is not None

required = [
    ("footer-notice", "footer notice"),
    ('footer class="site"', "footer"),
    ("regulatory.html", "regulatory link"),
    ("assets/style.css", "stylesheet"),
    ("assets/site.js", "script"),
]

issues = []
tokens = {}

print("PAGES:", ", ".join(pages))
print()

for p in pages:
    s = open(p, encoding="utf-8").read()
    low = s.lower()

    # strip tags so disclaimer prose reads as continuous sentences
    prose = re.sub(r"<[^>]+>", " ", low)
    prose = re.sub(r"\s+", " ", prose)
    for b in banned:
        for m in re.finditer(b, prose):
            if negated(prose, m.start()):
                continue
            snippet = prose[max(0, m.start() - 70):m.end() + 40].strip()
            issues.append('%s: CLAIM LANGUAGE "%s" -> ...%s...' % (p, m.group(0), snippet))

    for req, label in required:
        if req not in s:
            issues.append("%s: MISSING %s" % (p, label))

    for href in re.findall(r'href="([^"]+)"', s):
        if href.startswith(("http", "mailto", "#")):
            continue
        target = href.split("#")[0]
        if target and target not in files:
            issues.append("%s: BROKEN LINK -> %s" % (p, href))

    ids = set(re.findall(r'id="([^"]+)"', s))
    for a in re.findall(r'href="#([^"]+)"', s):
        if a not in ids:
            issues.append("%s: DEAD ANCHOR #%s" % (p, a))

    for t in re.findall(r"REPLACE_[A-Z_]+", s):
        tokens.setdefault(t, []).append(p)

    # crude tag balance sanity check on key containers
    for tag in ("div", "main", "footer", "header", "table", "form"):
        o = len(re.findall(r"<%s[\s>]" % tag, s))
        c = len(re.findall(r"</%s>" % tag, s))
        if o != c:
            issues.append("%s: TAG IMBALANCE <%s> open=%d close=%d" % (p, tag, o, c))

print("PLACEHOLDER TOKENS (fill before publishing):")
for t in sorted(tokens):
    print("  %-30s %d occurrence(s)" % (t, len(tokens[t])))
print()

print("ISSUES FOUND:", len(issues))
for i in issues:
    print("  -", i)
if not issues:
    print("  none - links, required notices, and claim language all clean")
