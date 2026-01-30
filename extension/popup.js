const stateEl = document.getElementById("state");
const toggleButton = document.getElementById("toggle");

function setState(text, isError = false) {
  stateEl.textContent = text;
  stateEl.classList.toggle("error", isError);
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function toggleOverlay() {
  try {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      setState("No active tab", true);
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { type: "toggle-overlay" });
    if (!response) {
      setState("Unavailable", true);
      return;
    }

    setState(response.enabled ? "On" : "Off");
  } catch (error) {
    setState("Unavailable", true);
  }
}

async function syncState() {
  try {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      setState("No active tab", true);
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { type: "get-overlay-state" });
    if (!response) {
      setState("Unavailable", true);
      return;
    }

    setState(response.enabled ? "On" : "Off");
  } catch (error) {
    setState("Unavailable", true);
  }
}

toggleButton.addEventListener("click", () => {
  toggleOverlay();
});

syncState();
