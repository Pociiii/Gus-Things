// =======================
// INVENTORY + DEMAND SYSTEM
// =======================

let credits = 100; // starting money
let tier = 1;

let speedLevel = 0;
let qualityLevel = 0;

let baseProductionTime = 5;
let productionTimer = 0;

let inventory = 0;
let itemsSold = 0;

let demand = 25; // base %

let saleTimer = 0;
let saleInterval = 3; // check sales every 1 second

let netProfitThisSecond = 0;
let profitPerMinute = 0;
let profitTimer = 0;

// ===== FORMULAS =====

function getProductionTime() {
  return baseProductionTime * Math.pow(0.92, speedLevel);
}

function getProductionCost() {
  return 8 * Math.pow(1.8, tier);
}

function getQualityMultiplier() {
  return 1 + (qualityLevel * 0.25); // softer scaling
}

function getSellPrice() {
  return getProductionCost() * (1.6 * getQualityMultiplier());
}

function getProfitPerItem() {
  return getSellPrice() - getProductionCost();
}

function getSellChance() {
  let qualityBonus = qualityLevel * 3; 
  return Math.min(demand + qualityBonus, 90);
}

function getItemsProducedPerSecond() {
  return 1 / getProductionTime();
}


// ===== GAME LOOP =====

function gameLoop(delta) {
  productionTimer += delta;

  // PRODUCE (with cost)
  if (productionTimer >= getProductionTime()) {
    productionTimer = 0;

    let cost = getProductionCost();

    if (credits >= cost) {
      credits -= cost;
      inventory++;
    }
  }

  // SELL CHECK (once per second approx)
  saleTimer += delta;

  if (saleTimer >= saleInterval) {
    attemptSales();
    saleTimer = 0;
  }

  updateProgressBar((productionTimer / getProductionTime()) * 100);
  updateUI();
}

function attemptSales() {
  let chance = getSellChance() / 100;
  let soldThisTick = 0;

  for (let i = 0; i < inventory; i++) {
    if (Math.random() < chance) {
      soldThisTick++;
    }
  }

  if (soldThisTick > 0) {
    inventory -= soldThisTick;

    let gross = soldThisTick * getSellPrice();
    let cost = soldThisTick * getProductionCost();
    let net = gross - cost;

    credits += gross;
    itemsSold += soldThisTick;

    // Track real net
    netProfitThisSecond += net;
  }
}

let lastTime = Date.now();

function mainLoop() {
  let now = Date.now();
  let delta = (now - lastTime) / 1000;
  lastTime = now;

  gameLoop(delta);

  // Accumulate time
  profitTimer += delta;

  // Every 1 second calculate
  if (profitTimer >= 1) {
    profitPerMinute = netProfitThisSecond * 60;

    netProfitThisSecond = 0;
    profitTimer = 0;
  }

  requestAnimationFrame(mainLoop);
}

mainLoop();

// ===== UPGRADES =====

function upgradeSpeed() {
  let cost = 50 * Math.pow(1.7, speedLevel);
  if (credits >= cost) {
    credits -= cost;
    speedLevel++;
  }
}

function upgradeQuality() {
  let cost = 100 * Math.pow(1.8, qualityLevel);
  if (credits >= cost) {
    credits -= cost;
    qualityLevel++;
  }
}

function upgradeTier() {
  let cost = getProductionCost() * 3;
  if (credits >= cost) {
    credits -= cost;
    tier++;
  }
}

function boostDemand() {
  let cost = 200 * (demand / 50);
  if (credits >= cost) {
    credits -= cost;
    demand += 5;
    if (demand > 90) demand = 90;
  }
}

// ===== UI =====

function updateUI() {
  document.getElementById("credits").innerText = formatNumber(credits);
  document.getElementById("tier").innerText = tier;

  document.getElementById("inventory").innerText = formatNumber(inventory);
  document.getElementById("itemsSold").innerText = formatNumber(itemsSold);

  document.getElementById("demand").innerText = demand;
  document.getElementById("itemValue").innerText = formatNumber(getSellPrice());
 
  document.getElementById("prodTime").innerText = getProductionTime().toFixed(2);

  document.getElementById("quality").innerText = getQualityMultiplier().toFixed(1);

  document.getElementById("speedLevel").innerText = speedLevel;
  document.getElementById("qualityLevel").innerText = qualityLevel;

  document.getElementById("prodCost").innerText = formatNumber(getProductionCost());

  document.getElementById("profitItem").innerText = formatNumber(getProfitPerItem());

  let el = document.getElementById("revPerSec");

  if (el) {
    el.innerText = formatSmallNumber(profitPerMinute);

    if (profitPerMinute > 0) {
      el.style.color = "#00ff88";
    } else if (profitPerMinute < 0) {
      el.style.color = "#ff4444";
    } else {
      el.style.color = "white";
    }
  }

}

function updateProgressBar(percent) {
  let bar = document.getElementById("progressBar");
  bar.style.width = Math.min(percent, 100) + "%";
}


// ===== NUMBER FORMAT =====

function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return Math.floor(num);
}

function formatSmallNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  if (num >= 1) return num.toFixed(2);
  if (num > 0.001) return num.toFixed(4);
  if (num > 0) return num.toExponential(2);
  return "0.0000";
}