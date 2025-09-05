// ------------------------------
// A/B Testing Data
// ------------------------------
let testData = {
  A: {
    views: 0,
    clicks: 0,
    timeSpent: [],
    title: "Transform Your Business Today",
    subtitle:
      "Join thousands of successful entrepreneurs who have revolutionized their workflow with our cutting-edge solution.",
    cta: "Start Your Journey",
  },
  B: {
    views: 0,
    clicks: 0,
    timeSpent: [],
    title: "Unlock Your Potential Now",
    subtitle:
      "Discover the secret weapon that top performers use to dominate their industry and achieve extraordinary results.",
    cta: "Get Started Now",
  },
  signins: [],
  contacts: [],
  currentVersion: null,
  sessionStartTime: null,
};

// ------------------------------
// Load & Save
// ------------------------------
function loadData() {
  const saved = localStorage.getItem("abTestData");
  if (saved) {
    const parsed = JSON.parse(saved);
    testData = { ...testData, ...parsed };
  }
  // Always reset session start time fresh
  testData.sessionStartTime = Date.now();
}

function saveData() {
  const { sessionStartTime, ...dataToSave } = testData; // exclude session time
  localStorage.setItem("abTestData", JSON.stringify(dataToSave));
}

// ------------------------------
// Init
// ------------------------------
function init() {
  loadData();
  assignRandomVersion();
  updateDashboard();

  document
    .getElementById("signinForm")
    .addEventListener("submit", handleSignIn);
  document
    .getElementById("contactForm")
    .addEventListener("submit", handleContact);
  document
    .getElementById("ctaButton")
    .addEventListener("click", handleCTAClick);
}

// ------------------------------
// Assign random version
// ------------------------------
function assignRandomVersion() {
  testData.currentVersion = Math.random() < 0.5 ? "A" : "B";
  testData[testData.currentVersion].views++;
  testData.sessionStartTime = Date.now(); // reset fresh session time

  const heroSection = document.getElementById("heroSection");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const ctaButton = document.getElementById("ctaButton");

  if (testData.currentVersion === "A") {
    heroSection.className = "hero version-a";
    heroTitle.textContent = testData.A.title;
    heroSubtitle.textContent = testData.A.subtitle;
    ctaButton.textContent = testData.A.cta;
  } else {
    heroSection.className = "hero version-b";
    heroTitle.textContent = testData.B.title;
    heroSubtitle.textContent = testData.B.subtitle;
    ctaButton.textContent = testData.B.cta;
  }

  saveData();
}

// ------------------------------
// CTA click
// ------------------------------
function handleCTAClick() {
  const version = testData.currentVersion;
  testData[version].clicks++;
  const timeSpent = Math.round(
    (Date.now() - testData.sessionStartTime) / 1000
  );
  testData[version].timeSpent.push(timeSpent);

  saveData();
  updateDashboard();

  const button = document.getElementById("ctaButton");
  button.style.transform = "scale(0.95)";
  button.textContent = "✓ Success!";
  setTimeout(() => {
    button.style.transform = "scale(1)";
    button.textContent = testData[version].cta;
  }, 1500);
}

// ------------------------------
// Sign In
// ------------------------------
function handleSignIn(event) {
  event.preventDefault();
  const email = event.target.querySelector("input[type='email']").value;
  testData.signins.push({
    email,
    timestamp: new Date().toISOString(),
    version: testData.currentVersion,
  });

  saveData();
  updateDashboard();

  document.getElementById("signinSuccess").style.display = "block";
  event.target.reset();
  setTimeout(
    () => (document.getElementById("signinSuccess").style.display = "none"),
    3000
  );
}

// ------------------------------
// Contact Form
// ------------------------------
function handleContact(event) {
  event.preventDefault();
  const form = event.target;
  testData.contacts.push({
    name: form.querySelector("input[type='text']").value,
    email: form.querySelector("input[type='email']").value,
    message: form.querySelector("textarea").value,
    timestamp: new Date().toISOString(),
    version: testData.currentVersion,
  });

  saveData();
  updateDashboard();

  document.getElementById("contactSuccess").style.display = "block";
  form.reset();
  setTimeout(
    () => (document.getElementById("contactSuccess").style.display = "none"),
    3000
  );
}

// ------------------------------
// Show Landing / Dashboard
// ------------------------------
function showLandingPage() {
  document.getElementById("landingPage").style.display = "block";
  document.getElementById("dashboard").classList.remove("active");
  assignRandomVersion();
}

function showDashboard() {
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("dashboard").classList.add("active");
  updateDashboard();
}

// ------------------------------
// Update Dashboard
// ------------------------------
function updateDashboard() {
  const totalViews = testData.A.views + testData.B.views;
  const totalClicks = testData.A.clicks + testData.B.clicks;

  document.getElementById("totalViews").textContent = totalViews;
  document.getElementById("totalClicks").textContent = totalClicks;
  document.getElementById("totalSignins").textContent = testData.signins.length;
  document.getElementById("totalContacts").textContent =
    testData.contacts.length;

  updateVersionStats("A");
  updateVersionStats("B");
}

function updateVersionStats(version) {
  const data = testData[version];
  const views = data.views;
  const clicks = data.clicks;
  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;
  const avgTime =
    data.timeSpent.length > 0
      ? Math.round(data.timeSpent.reduce((a, b) => a + b, 0) / data.timeSpent.length)
      : 0;

  document.getElementById(`views${version}`).textContent = views;
  document.getElementById(`clicks${version}`).textContent = clicks;
  document.getElementById(`ctr${version}`).textContent = ctr + "%";
  document.getElementById(`avgTime${version}`).textContent = avgTime + "s";

  const maxClicks = Math.max(testData.A.clicks, testData.B.clicks);
  const progressWidth = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;
  document.getElementById(`progress${version}`).style.width =
    progressWidth + "%";
}

// ------------------------------
// Reset Data
// ------------------------------
function resetData() {
  if (confirm("Are you sure you want to reset all test data?")) {
    testData = {
      A: {
        views: 0,
        clicks: 0,
        timeSpent: [],
        title: "Transform Your Business Today",
        subtitle: "Join thousands...",
        cta: "Start Your Journey",
      },
      B: {
        views: 0,
        clicks: 0,
        timeSpent: [],
        title: "Unlock Your Potential Now",
        subtitle: "Discover the secret...",
        cta: "Get Started Now",
      },
      signins: [],
      contacts: [],
      currentVersion: null,
      sessionStartTime: Date.now(),
    };

    saveData();
    updateDashboard();
    assignRandomVersion();
    alert("All data has been reset!");
  }
}

// ------------------------------
// Export Data
// ------------------------------
function exportData() {
  const { sessionStartTime, ...dataToExport } = testData;
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ab_test_data.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ------------------------------
// Track session time
// ------------------------------
window.addEventListener("beforeunload", () => {
  if (testData.currentVersion) {
    const timeSpent = Math.round(
      (Date.now() - testData.sessionStartTime) / 1000
    );
    testData[testData.currentVersion].timeSpent.push(timeSpent);
    saveData();
  }
});

// ------------------------------
// Initialize
// ------------------------------
init();
