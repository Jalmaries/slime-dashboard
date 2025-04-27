// Rimuru's Slime Memory Core

// Slime object (memory)
const slime = {
    name: "Rimuru-Coder",
    level: 1,
    title: "Beginner Slime",
    skills: ["Variables"],
    quests: [
      {
        name: "Magic Number Doubler",
        link: "quests/magic-doubler/index.html"
      }
    ]
  };
  
  // Grab important DOM elements
  const skillsList = document.getElementById('skillsList');
  const questsList = document.getElementById('questsList');
  
  // Save slime data to JSON
  document.getElementById('saveButton').addEventListener('click', () => {
    const slimeData = JSON.stringify(slime, null, 2); 
    const blob = new Blob([slimeData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'slime-progress.json';
    link.click();
  });
  
  // Load slime data from JSON
  document.getElementById('loadFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const loadedData = JSON.parse(e.target.result);
      Object.assign(slime, loadedData); 
      refreshDashboard(); 
    };
    reader.readAsText(file);
  });
  
  // Refresh the dashboard from slime data
  function refreshDashboard() {
    document.getElementById('slimeName').textContent = slime.name;
    document.getElementById('slimeLevel').textContent = slime.level;
    document.getElementById('slimeTitle').textContent = slime.title;
  
    // Update Skills
    skillsList.innerHTML = '';
    slime.skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
    });
  
    // Update Quests
    questsList.innerHTML = '';
    slime.quests.forEach(quest => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = quest.name;
      a.href = quest.link;
      a.target = '_blank';
      li.appendChild(a);
      questsList.appendChild(li);
    });
  
    // Update Skill Crystal
    refreshSkillCrystal();
  }
  
  // Refresh Skill Crystal section
  function refreshSkillCrystal() {
    const crystalContainer = document.getElementById('crystalContainer');
    crystalContainer.innerHTML = '';
  
    const allSkills = [
      "Variables", "Functions", "Arrays", 
      "Objects", "DOM Manipulation", 
      "Events", "Fetch API", "Async/Await", "Canvas Animation"
    ];
  
    allSkills.forEach(skillName => {
      const skillNode = document.createElement('div');
      skillNode.className = 'skill-node';
      skillNode.textContent = skillName;
  
      if (slime.skills.includes(skillName)) {
        skillNode.classList.add('unlocked');
      }
  
      crystalContainer.appendChild(skillNode);
    });
  }
  
  // First time page load: initialize dashboard
  refreshDashboard();

  // Add New Skill
document.getElementById('addSkillButton').addEventListener('click', () => {
    const newSkill = prompt("Enter new skill name:");
    if (newSkill) {
      slime.skills.push(newSkill);
      refreshDashboard();
    }
  });
  
  // Add New Completed Quest
  document.getElementById('addQuestButton').addEventListener('click', () => {
    const questName = prompt("Enter completed quest name:");
    const questLink = prompt("Enter link to quest project (optional):");
  
    if (questName) {
      slime.quests.push({
        name: questName,
        link: questLink || "#"
      });
      refreshDashboard();
    }
  });
  