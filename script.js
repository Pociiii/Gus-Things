function rollDice() {
  let roll = Math.floor(Math.random() * 100) + 1;

  let result = "";
  let action = "";
  let fallback = "";

  if (roll <= 30) {
    result = "Form a couple";
    action = "Pick 2 free players → form a couple";
    fallback = "Free one player";
  }
  else if (roll <= 60) {
    result = "Change pose";
    action = "Change pose of an existing couple or 3some";
    fallback = "Form a couple";
  }
  else if (roll <= 70) {
    result = "Swap partners";
    action = "Swap partners between two couples/3some";
    fallback = "Change pose OR Form a couple ";
  }
  else if (roll <= 80) {
    result = "Expand";
    action = "Couple + free player → 3some";
    fallback = "Swap partners OR Form a couple OR Change pose";
  }
  else if (roll <= 90) {
    result = "Free one player";
    action = "Free one player from a 3some";
    fallback = "Expand OR Form a couple OR Change pose";
  }
  else {
    result = "Roller chooses";
    action = "Choose any action";
    fallback = "Host veto if it slows flow";
  }

  document.getElementById("result").innerText =
    "Rolled: " + roll + " " + result +
    "\nAction: " + action +
    "\nFallback: " + fallback;
}


