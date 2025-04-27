// 📜 Rimuru Slime Memory Core Shared Across Pages

const slime = JSON.parse(localStorage.getItem('slimeData')) || {
  name: "Rimuru-Coder",
  level: 1,
  xp: 0,
  titles: ["Beginner Slime"],
  skills: ["Variables"],
  completedQuests: [],
  availableQuests: [
    { name: "Magic Number Doubler", description: "Double the input number magically!", xpReward: 20, link: "quests/magic-doubler/index.html" },
    { name: "Variable Mastery", description: "Master the art of variables!", xpReward: 50, link: "quests/variable-master/index.html" },
    { name: "Slime Multiplication", description: "Multiply slimes through code!", xpReward: 100, link: "quests/slime-multiply/index.html" }
  ]
};

// 📜 Save to LocalStorage
function saveSlime() {
  localStorage.setItem('slimeData', JSON.stringify(slime));
}

// 📜 XP / Level / Skills / Titles Logic
const skillUnlocks = {
  2: "Functions",
  3: "Arrays",
  4: "Objects",
  5: "DOM Manipulation",
  6: "Events",
  7: "Fetch API",
  8: "Async/Await",
  10: "Canvas Animation"
};

const titleMilestones = {
  3: "Junior Slime Mage",
  5: "Senior Slime Warrior",
  8: "Great Slime Hero",
  10: "Slime Lord Supreme"
};

function gainXP(amount) {
  slime.xp += amount;
  const newLevel = Math.floor(slime.xp / 100) + 1;
  if (newLevel > slime.level) {
    slime.level = newLevel;
    unlockSkills();
    unlockTitles();
  }
  saveSlime();
}

function unlockSkills() {
  const skill = skillUnlocks[slime.level];
  if (skill && !slime.skills.includes(skill)) {
    slime.skills.push(skill);
    alert(`🌟 New Skill Unlocked: ${skill}!`);
  }
}

function unlockTitles() {
  const title = titleMilestones[slime.level];
  if (title && !slime.titles.includes(title)) {
    slime.titles.push(title);
    alert(`🏆 New Title Earned: ${title}!`);
  }
}

// 📜 Setup Save/Load dynamically AFTER Header Loads
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

// 📜 Refreshers for Sections
function refreshCharacterInfo() {
  if (document.getElementById('slimeName')) {
    document.getElementById('slimeName').textContent = slime.name;
    document.getElementById('slimeLevel').textContent = slime.level;
    document.getElementById('slimeTitle').textContent = slime.titles[slime.titles.length - 1];
  }
}

function refreshSkills() {
  if (document.getElementById('skillBoard')) {
    const skillBoard = document.getElementById('skillBoard');
    skillBoard.innerHTML = '';
    slime.skills.forEach(skill => {
      const skillNode = document.createElement('div');
      skillNode.className = 'skill-node';
      skillNode.textContent = skill;
      skillBoard.appendChild(skillNode);
    });
  }
}

function refreshTitles() {
  if (document.getElementById('titlesList')) {
    const titlesList = document.getElementById('titlesList');
    titlesList.innerHTML = '';
    slime.titles.forEach(title => {
      const li = document.createElement('li');
      li.textContent = title;
      titlesList.appendChild(li);
    });
  }
}
