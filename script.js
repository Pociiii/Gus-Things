function rollDice() {
  let roll = Math.floor(Math.random() * 100) + 1;
  let result = "";

  if (roll <= 30) result = "Form a couple";
  else if (roll <= 60) result = "Change pose";
  else if (roll <= 70) result = "Swap partners";
  else if (roll <= 80) result = "Free one player";
  else if (roll <= 90) result = "Expand interaction";
  else result = "Roller chooses";

  document.getElementById("result").innerText =
    "Rolled: " + roll + " → " + result;
}
