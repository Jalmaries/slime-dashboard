// === Slime Memory ===
let data = {};
const slime = JSON.parse(localStorage.getItem('slimeData')) || {
  name: "Rimuru-Coder",
  level: 1,
  xp: 0,
  skills: {},
  questsCompleted: [],
  titlesEarned: ["beginner-slime"]
};

// === Save Slime
function saveSlime() {
  localStorage.setItem('slimeData', JSON.stringify(slime));
}

// === Load Everything
Promise.all([
  fetch('./header.html').then(res => res.text()),
  fetch('./data/data.json').then(res => res.json()),
  ...(document.getElementById('characterInfo') ? [
    fetch('sections/character-info.html').then(res => res.text()),
    fetch('sections/skills.html').then(res => res.text()),
    fetch('sections/titles.html').then(res => res.text())
  ] : [])
])
.then(responses => {
  const [headerHTML, jsonData, ...sectionHTMLs] = responses;

  document.getElementById('main-header').innerHTML = headerHTML;
  setupSaveLoad();
  
  data = jsonData;
  initializeSkills();

  if (sectionHTMLs.length) {
    document.getElementById('characterInfo').innerHTML = sectionHTMLs[0];
    document.getElementById('skillsSection').innerHTML = sectionHTMLs[1];
    document.getElementById('titlesSection').innerHTML = sectionHTMLs[2];
  }

  initializeSlime();
})
.catch(err => {
  console.error("Failed during initial load:", err);
});

// === Initialize Skills
function initializeSkills() {
  if (!data.skills) return;
  data.skills.forEach(skill => {
    if (!slime.skills[skill.id]) {
      slime.skills[skill.id] = { level: 0, xp: 0 };
    }
  });
  saveSlime();
}

// === Setup Save/Load
function setupSaveLoad() {
  document.getElementById('saveButton')?.addEventListener('click', () => {
    const slimeData = JSON.stringify(slime, null, 2);
    const blob = new Blob([slimeData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'slime-progress.json';
    link.click();
  });

  document.getElementById('loadFile')?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const loadedData = JSON.parse(e.target.result);
      Object.assign(slime, loadedData);
      saveSlime();
      location.reload();
    };
    reader.readAsText(file);
  });
}

// === Initialize Slime
function initializeSlime() {
  if (document.getElementById('characterInfo')) {
    refreshCharacterInfo();
    refreshSkills();
    refreshTitles();
  }
  if (document.getElementById('questBoard')) {
    refreshQuestBoard();
  }
}

// === Character Info
function refreshCharacterInfo() {
  const nameEl = document.getElementById('slimeName');
  const levelEl = document.getElementById('slimeLevel');
  const titleEl = document.getElementById('slimeTitle');
  if (!nameEl || !levelEl || !titleEl || !data.titles) return;

  nameEl.textContent = slime.name;
  levelEl.textContent = slime.level;
  
  const latestTitleId = slime.titlesEarned[slime.titlesEarned.length - 1];
  const latestTitle = data.titles.find(t => t.id === latestTitleId);
  titleEl.textContent = latestTitle?.name || "Unknown Slime";

  updateSlimeAppearance(); // ✨ Call here for instant update
}

// === Skills
function refreshSkills() {
  const skillBoard = document.getElementById('skillBoard');
  if (!skillBoard || !data.skills) return;

  skillBoard.innerHTML = '';

  data.skills.forEach(skillData => {
    const mySkill = slime.skills[skillData.id];
    const isUnlocked = mySkill?.level > 0;
    const isAllowedByLevel = slime.level >= (skillData.requiredLevel || 1);

    if (isUnlocked || isAllowedByLevel) {
      const skillNode = document.createElement('div');
      skillNode.className = 'skill-node';
      skillNode.innerHTML = `
        ${skillData.name}<br>Lv.${mySkill?.level || 0} (${mySkill?.xp || 0}/${skillData.maxXp} XP)
      `;
      skillBoard.appendChild(skillNode);
    }
  });
}

// === Titles
function refreshTitles() {
  const titlesList = document.getElementById('titlesList');
  if (!titlesList || !data.titles) return;

  titlesList.innerHTML = '';

  data.titles.forEach(title => {
    if (isTitleUnlocked(title) && !slime.titlesEarned.includes(title.id)) {
      slime.titlesEarned.push(title.id);
      alert(`🏆 New Title Earned: ${title.name}`);
    }
    if (slime.titlesEarned.includes(title.id)) {
      const li = document.createElement('li');
      li.textContent = title.name;
      titlesList.appendChild(li);
    }
  });
  saveSlime();
}

// === Check if title is unlocked
function isTitleUnlocked(title) {
  return title.requires.every(req => checkRequirement(req));
}

// === Quests
function refreshQuestBoard() {
  const questBoard = document.getElementById('questBoard');
  if (!questBoard || !data.quests) return;

  questBoard.innerHTML = '';

  data.quests.forEach(quest => {
    const requirementsMet = quest.requires.every(r => checkRequirement(r));
    if (!slime.questsCompleted.includes(quest.id) && requirementsMet) {
      const questCard = document.createElement('div');
      questCard.className = 'quest-card';
      questCard.innerHTML = `
        <h3>${quest.name}</h3>
        <p>${quest.description}</p>
        <button onclick="completeQuest('${quest.id}')">Complete Quest</button>
      `;
      questBoard.appendChild(questCard);
    }
  });
}

// === Complete Quest
function completeQuest(questId) {
  const quest = data.quests.find(q => q.id === questId);
  if (!quest) return;

  slime.xp += quest.rewards.xp || 0;

  const newLevel = Math.floor(slime.xp / 100) + 1;
  if (newLevel > slime.level) {
    slime.level = newLevel;
    alert(`🆙 Slime leveled up to Lv.${slime.level}!`);
  }

  for (const skillId in quest.rewards.skillXp) {
    if (slime.skills[skillId]) {
      slime.skills[skillId].xp += quest.rewards.skillXp[skillId];

      const skillData = data.skills.find(s => s.id === skillId);
      if (slime.skills[skillId].xp >= skillData.maxXp) {
        slime.skills[skillId].xp -= skillData.maxXp;
        slime.skills[skillId].level++;
        alert(`🌟 Skill Leveled Up: ${skillData.name} Lv.${slime.skills[skillId].level}`);
      }
    }
  }

  slime.questsCompleted.push(quest.id);
  saveSlime();
  refreshCharacterInfo();
  refreshSkills();
  refreshQuestBoard();
  refreshTitles();
}

// === Check Requirements
function checkRequirement(req) {
  const [skillOrQuest, levelPart] = req.split('-lv');
  if (levelPart) {
    return slime.skills[skillOrQuest]?.level >= parseInt(levelPart);
  }
  return slime.questsCompleted.includes(req) || slime.titlesEarned.includes(req);
}

// === Update Slime Appearance (Evolution)
function updateSlimeAppearance() {
  const slimeAvatar = document.getElementById('slimeAvatar');
  if (!slimeAvatar) return;

  slimeAvatar.className = 'slime';

  const latestTitle = slime.titlesEarned[slime.titlesEarned.length - 1];

  if (latestTitle === "beginner-slime") {
    slimeAvatar.classList.add('baby');
  } else if (latestTitle === "junior-coder") {
    slimeAvatar.classList.add('junior');
  } else if (latestTitle === "array-archer") {
    slimeAvatar.classList.add('archer');
  } else if (latestTitle === "dom-savior") {
    slimeAvatar.classList.add('dom');
  } else if (latestTitle === "async-champion") {
    slimeAvatar.classList.add('async');
  } else if (latestTitle === "canvas-conqueror") {
    slimeAvatar.classList.add('canvas');
  } else if (latestTitle === "typescript-slayer") {
    slimeAvatar.classList.add('typescript');
  } else if (latestTitle === "react-sorcerer") {
    slimeAvatar.classList.add('react');
  } else if (latestTitle === "backend-knight") {
    slimeAvatar.classList.add('backend');
  } else if (latestTitle === "demon-lord-of-code") {
    slimeAvatar.classList.add('demonlord');
  }

  slimeAvatar.classList.add('evolving');
  setTimeout(() => {
    slimeAvatar.classList.remove('evolving');
  }, 1000);
}
