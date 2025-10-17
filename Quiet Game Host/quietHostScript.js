let AllPrompts;
const prompter = document.getElementById("NewPrompt");
let promptIndex = 0;

let gunmanDropdown = document.getElementById("myDropdown");
let roundGoing = false;
const playerMods = document.getElementsByClassName("PlayerModule");
for(let i = 0; i < playerMods.length; i++)
	{
		playerMods[i].children[3].disabled = true;
		playerMods[i].children[4].disabled = true;
	}
let completedRound = new Array(playerMods.length).fill(false); 
let shot = new Array(playerMods.length).fill(false); 
let points = new Array(playerMods.length).fill(0); 

function newGame()
{
	fetch('https://thermitefe8.github.io/Quiet%20Game%20Host/TaskList.txt')
  .then(response => response.text())
  .then((data) => {
    console.log(data)
	AllPrompts = data.split("\n");
	
	
	for(let i = 0; i < playerMods.length; i++)
	{
		completedRound[i] = false;
		shot[i] = false;
		points[i] = 0;
		playerMods[i].children[2].textContent = "Points: " + points[i];
		playerMods[i].children[3].disabled = false;
		playerMods[i].children[4].disabled = false;
	}
	
	shot[gunmanDropdown.value] = true;
	playerMods[gunmanDropdown.value].children[3].disabled = true;
	playerMods[gunmanDropdown.value].children[4].disabled = true;
	playerMods[gunmanDropdown.value].children[2].textContent = "Gunman";
	
	roundGoing = true;
	randomParameter();
  })
}

async function randomParameter()
{
	promptIndex = Math.floor(Math.random() * AllPrompts.length);

  // Return the element at the randomly generated index
  
	prompter.textContent = "3";
	await delay(1000);
	prompter.textContent = "2";
	await delay(1000);
	prompter.textContent = "1";
	await delay(1000);
	
	prompter.textContent = AllPrompts[promptIndex];
}

function playerFinished(index)
{
	completedRound[index] = true;
	points[index] = points[index] + 1;
	playerMods[index].children[2].textContent = "Points: " + points[index];
	playerMods[index].children[3].disabled = true;
	playerMods[index].children[4].disabled = true;
	
	checkRoundFinished();
}

function playerShot(index)
{
	completedRound[index] = true;
	shot[index] = true;
	playerMods[index].children[2].textContent = "Eliminated";
	playerMods[index].children[3].disabled = true;
	playerMods[index].children[4].disabled = true;
	
	checkRoundFinished();
}

function checkRoundFinished()
{
	let roundFinishedTemp = true;
	let everyoneDeadCheck = true;
	
	for(let i = 0; i < playerMods.length; i++)
	{
		if(completedRound[i] == false && shot[i] == false && playerMods[i].children[1].value != "")
		{
			roundFinishedTemp = false;
		}
		
		if(shot[i] == false && playerMods[i].children[1].value != "")
		{
			everyoneDeadCheck = false;
		}
	}
	
	if(roundFinishedTemp == true && everyoneDeadCheck == false)
	{
		AllPrompts.splice(promptIndex, 1);
		
		
		
		randomParameter();
		for(let i = 0; i < playerMods.length; i++)
		{
			if(shot[i] == false)
			{
			completedRound[i] = false;
			playerMods[i].children[3].disabled = false;
			playerMods[i].children[4].disabled = false;
			}
		}
	}
	else if(everyoneDeadCheck == true)
	{
		prompter.textContent = "Game Over! Play Again?";
	}
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

