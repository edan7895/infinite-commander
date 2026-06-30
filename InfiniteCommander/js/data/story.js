// ============================================================
// story.js — Opening Story + Story Management
// ============================================================

const STORY_CHAPTERS = [
  {
    id: 0,
    textEn: `🌌 THE FRONTIER · 2157

"Commander, we've lost contact with Central Command."

The communications officer's voice crackles through the static. You stand at the viewport of the battered starship "Vanguard", watching the swirling nebula of the Frontier Sector.

"All we have is this outpost. Supplies are low. No reinforcements are coming."

You turn from the window. Your crew of 47 looks to you for answers.

"No reinforcements," you repeat. "Then we build our own."

[ Your mission: Survive. Build. Conquer. ]`,

    textZh: `🌌 边疆星域 · 2157年

"指挥官，我们与中央指挥部失去了联系。"

通信官的声音在静电中沙沙作响。你站在伤痕累累的星舰"先锋号"的舷窗前，凝视着边疆星域旋转的星云。

"我们只有这个前哨站了。补给不足。不会有援军。"

你从窗前转过身。47名船员都看着你，等待答案。

"没有援军，"你重复道。"那我们就自己建造。"

[ 你的任务：生存。建设。征服。 ]`
  },
  {
    id: 1,
    textEn: `📡 FIRST CONTACT

Scanners detect a faint signal from the surface of the nearby planet.

"Commander, it's an abandoned mining facility. The database shows it was operational until the war began."

You study the holographic map. The facility has:
• A functional power core
• Ore processing equipment
• Living quarters

"This is our new home. Prepare the landing party."

[ Objective: Establish your base. Begin by mining resources. ]`,

    textZh: `📡 首次接触

扫描仪探测到附近星球表面的微弱信号。

"指挥官，那是一个废弃的采矿设施。数据库显示它在战争爆发前一直在运作。"

你研究着全息地图。该设施有：
• 功能完好的能源核心
• 矿石加工设备
• 生活区

"这是我们的新家。准备登陆小队。"

[ 目标：建立基地。从采矿开始。 ]`
  },
  {
    id: 2,
    textEn: `⚔️ THE AWAKENING

As your team secures the facility, alarms blare.

"Commander! Unknown hostiles approaching from the north!"

You grab your sidearm and head to the observation deck. In the distance, dust clouds rise — dozens of figures emerge from the wasteland.

"Hostiles identified as rogue military units. They've taken control of the surrounding sector."

You watch them approach. Your crew looks to you, weapons ready.

"Then we fight. This is our home now."

[ Objective: Defeat 10 enemies. Prove your worth. ]`,

    textZh: `⚔️ 觉醒

当你的小队正在确保设施安全时，警报响起。

"指挥官！未知敌人从北方接近！"

你抓起配枪，走向观察甲板。远处，尘土飞扬——数十个身影从荒原中出现。

"敌方被识别为叛军部队。他们已经控制了周边区域。"

你看着他们逼近。你的船员看向你，武器已准备就绪。

"那就战斗吧。这里现在是我们的家园。"

[ 目标：击败10个敌人。证明你的价值。 ]`
  },
  {
    id: 3,
    textEn: `🏛️ THE COMMANDER'S RESOLVE

The battle is won. The hostiles retreat into the wastes.

Your crew gathers in the command center. They're tired, but they're alive.

"Commander, the mining equipment is operational. We have ore, but we need more — more soldiers, more resources, more firepower."

You nod. "Then we grow. Every soldier trained. Every resource mined. Every enemy defeated."

"Where do we begin?"

You look out the window at the endless frontier.

"We begin with one step. One upgrade. One victory at a time."

[ Welcome to Infinite Commander. Your journey begins now. ]`,

    textZh: `🏛️ 指挥官的决心

战斗胜利了。叛军撤退到荒原深处。

你的船员聚集在指挥中心。他们很疲惫，但他们都活着。

"指挥官，采矿设备已启动。我们有矿石了，但我们还需要更多——更多士兵、更多资源、更多火力。"

你点点头。"那就发展。训练每一个士兵。开采每一种资源。击败每一个敌人。"

"我们从哪里开始？"

你望向窗外无垠的边疆。

"从一步开始。一次升级。一次胜利。"

[ 欢迎来到《军魂飞升》。你的征途现在开始。 ]`
  }
];

let currentStoryIndex = 0;

function getStoryChapter(index) {
  return STORY_CHAPTERS[index] || STORY_CHAPTERS[STORY_CHAPTERS.length - 1];
}

function getStoryText(index) {
  const chapter = getStoryChapter(index);
  return langCurrent === 'zh' ? chapter.textZh : chapter.textEn;
}

function getTotalStoryChapters() {
  return STORY_CHAPTERS.length;
}

function resetStory() {
  currentStoryIndex = 0;
}