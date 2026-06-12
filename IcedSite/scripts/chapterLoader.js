const title = document.getElementById('title');
let audioReadingSource = document.getElementById('audioReadingSource');
let audioReading = document.getElementById('audioReading');
let mdBlockContainer = document.getElementById('mdBlockContainer');
const prevButton = document.getElementById('prevButton');
const chapterDropdown = document.getElementById('chapterDropdown');
const nextButton = document.getElementById('nextButton');
const chapterTitle = document.getElementById('chapterTitle');
const pageHeader = document.getElementById('pageHeader');

let params = new URLSearchParams(document.location.search);
let story = params.get("story");
let chapter = params.get("chapter");


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
	let storyArray = jsonInput.stories[story].items;
	console.log(storyArray);
	const thisChapter = storyArray.find(item => item.title == chapter);
	const myIndex = storyArray.findIndex(item => item.title == chapter);
	console.log(thisChapter);
	
	let newBlock = document.createElement("md-block");
	newBlock.setAttribute('src', thisChapter.filepath);
	mdBlockContainer.appendChild(newBlock);
	chapterTitle.innerHTML = thisChapter.title;
	pageHeader.innerHTML = jsonInput.stories[story].title + " | " + thisChapter.title;
	title.innerHTML = jsonInput.stories[story].title;
	audioReadingSource.setAttribute('src', thisChapter.audiopath);
	audioReading.load();
	
	if(myIndex - 1 >= 0)
	{
		prevButton.setAttribute('onclick', "window.location.href=\'" + "ChapterPage.html?story=" + story + "&chapter=" + storyArray[myIndex-1].title + "\'");
	}
	else
	{
		prevButton.disabled = true;
	}
	
	if(myIndex + 1 < storyArray.length)
	{
		nextButton.setAttribute('onclick', "window.location.href=\'" + "ChapterPage.html?story=" + story + "&chapter=" + storyArray[myIndex+1].title + "\'");
	}
	else
	{
		nextButton.disabled = true;
	}
	
	for(let i = 0; i < storyArray.length; i++)
	{
		let newChapterObj = document.createElement("option");
		newChapterObj.value = "ChapterPage.html?story="+story+"&chapter="+storyArray[i].title;
		newChapterObj.innerHTML = storyArray[i].title;
		chapterDropdown.appendChild(newChapterObj);
	}
	
	
	includeHTML();
	
	postMarkdownRender(newBlock);
	
	
	
}

async function postMarkdownRender(markdownBlock) {
  while (!markdownBlock.hasAttribute('rendered')) {
    await delay(100); 
  }
  
	let mdBlockImages = markdownBlock.querySelectorAll('img');
	console.log(mdBlockImages);
	for(let i = 0; i < mdBlockImages.length; i++)
	{

		mdBlockImages[i].setAttribute('src', 'stories/'+story+'/'+mdBlockImages[i].getAttribute('src'));
	}
}