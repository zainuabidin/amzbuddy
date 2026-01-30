const OVERLAY_ID = "focus-tint-overlay";
const OVERLAY_CLASS = "focus-tint-active";

function ensureOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(20, 23, 33, 0.55)";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "2147483647";
    overlay.style.transition = "opacity 0.2s ease";
    overlay.style.opacity = "0";
    document.documentElement.appendChild(overlay);
  }
  return overlay;
}

function setOverlayEnabled(enabled) {
  const overlay = ensureOverlay();
  document.documentElement.classList.toggle(OVERLAY_CLASS, enabled);
  overlay.style.opacity = enabled ? "1" : "0";
}

function isOverlayEnabled() {
  return document.documentElement.classList.contains(OVERLAY_CLASS);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "toggle-overlay") {
    const nextState = !isOverlayEnabled();
    setOverlayEnabled(nextState);
    sendResponse({ enabled: nextState });
    return true;
  }

  if (message.type === "get-overlay-state") {
    sendResponse({ enabled: isOverlayEnabled() });
    return true;
  }

  return false;
});
