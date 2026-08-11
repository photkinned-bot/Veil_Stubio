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
    if (typeof updateAutosaveUI === 'function') {
      let rsn = "Deferred: ";
      if (isPainting) rsn += "paint ";
      if (strokeBackupActive) rsn += "stroke ";
      if (isRestoringHistory) rsn += "hist ";
      if (isInteracting) rsn += "interact ";
      if (isAutoSaving) rsn += "autosav ";
      if (now - lastUserInteractionTime < 500) rsn += "time ";
      updateAutosaveUI("Є зміни...", "#f59e0b", rsn);
    }
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
