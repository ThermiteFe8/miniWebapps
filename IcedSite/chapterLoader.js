const title = document.getElementById('title');
let audioReading = document.getElementById('audioReading');
let mdBlockContainer = document.getElementById('mdBlockContainer');
const prevButton = document.getElementById('prevButton');
const chapterDropdown = document.getElementById('chapterDropdown');
const nextButton = document.getElementById('nextButton');
const chapterTitle = document.getElementById('chapterTitle');

let params = new URLSearchParams(document.location.search);
let story = params.get("story");
let chapter = params.get("chapter");
getData('markdownFiles.json');


async function getData(urlName) {
  const url = urlName;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
	jsonInputHandler(json);
  } catch (error) {
    console.error(error.message);
  }
}

function jsonInputHandler(jsonInput)
{
	let storyArray = jsonInput.stories[story];
	const thisChapter = storyArray.find(item => item.title == chapter);
	const myIndex = storyArray.findIndex(item => item.title == chapter);
	console.log(thisChapter);
	
	let newBlock = document.createElement("md-block");
	newBlock.setAttribute('src', thisChapter.filepath);
	mdBlockContainer.appendChild(newBlock);
	chapterTitle.innerHTML = thisChapter.title;
	title.innerHTML = chapter;
	audioReading.setAttribute('src', thisChapter.audiopath);
	
	if(myIndex - 1 >= 0)
	{
		prevButton.setAttribute('onclick', "window.location.href=\'" + "/chapterPage.html?story=" + story + "&chapter=" + storyArray[myIndex-1].title + "\'");
	}
	else
	{
		prevButton.disabled = true;
	}
	
}