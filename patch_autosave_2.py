import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

replacement = """
async function performAutoSave() {
  let now = Date.now();
  if (
    isAutoSaving ||
    isPainting ||
    strokeBackupActive ||
    isRestoringHistory ||
    isInteracting ||
    now - lastUserInteractionTime < 500
  )
    return;
  isAutoSaving = true;
  console.log("performAutoSave started!");
  updateAutosaveUI(
    "Збереження...",
    "#3b82f6",
    "Фонове автозбереження чернетки...",
  );

  try {
    const db = await openVeilIDB();
    const paintBlobs = {};
"""

text = re.sub(r'async function performAutoSave\(\) \{[\s\S]*?const paintBlobs = \{\};', replacement.strip(), text)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
