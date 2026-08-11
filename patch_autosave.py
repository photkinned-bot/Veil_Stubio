import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

replacement = """
function requestAutoSaveIdle() {
  let now = Date.now();
  if (
    isPainting ||
    strokeBackupActive ||
    isRestoringHistory ||
    isInteracting ||
    isAutoSaving ||
    now - lastUserInteractionTime < 500
  ) {
    console.log("requestAutoSaveIdle deferring! isPainting:", isPainting, "strokeBackupActive:", strokeBackupActive, "isRestoringHistory:", isRestoringHistory, "isInteracting:", isInteracting, "isAutoSaving:", isAutoSaving, "time since last interaction:", now - lastUserInteractionTime);
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => requestAutoSaveIdle(), 500);
    return;
  }
  performAutoSave();
}
"""

text = re.sub(r'function requestAutoSaveIdle\(\) \{[\s\S]*?performAutoSave\(\);\n\}', replacement.strip(), text)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
