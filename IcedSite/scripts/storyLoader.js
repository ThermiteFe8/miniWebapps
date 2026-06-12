const chapterTitle = document.getElementById('chapterTitle');
const normalPageHeader = document.getElementById('normalPageHeader');
const allStories = document.getElementById('allStories');




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
	let storyArray = jsonInput.stories;
	console.log(storyArray);
	let storyKeys = Object.keys(storyArray);
	
	
	for(let i = 0; i < storyKeys.length; i++)
	{
		console.log(storyKeys[i]);
		if(storyKeys[i] == "title")
		{
			
		}
		else
		{
			let keys = storyKeys[i];
			
			let storyTitle = document.createElement('a');
			storyTitle.setAttribute('href', 'ChapterPage.html?story='+storyKeys[i]+'&chapter='+storyArray[keys].items[0].title);
			storyTitle.innerHTML = storyArray[keys].title;
			storyTitle.id = "storyTitle";
			
			let storyDate = document.createElement('h3');
			storyDate.classList.add("storyDate");
			storyDate.innerHTML = storyArray[keys].items[0].date.replaceAll("/", "-");
			
			let storySynopsis = document.createElement('p');
			storySynopsis.classList.add("storySynopsis");
			storySynopsis.innerHTML = storyArray[keys].items[0].synopsis;
			
			let storyThumbnail = document.createElement('img');
			storyThumbnail.classList.add("storyThumbnail");
			storyThumbnail.setAttribute('onerror', "this.onerror=null; this.src='placeholder/placeholderThumbnail.png';");
			storyThumbnail.setAttribute('src', storyArray[keys].items[0].imagepath);
			
			let storyTitleDateContainer = document.createElement('div');
			storyTitleDateContainer.classList.add("storyTitleDateContainer");
			
			let titleSynopsisContainer = document.createElement('div');
			titleSynopsisContainer.classList.add("titleSynopsisContainer");
			
			let storyContainer = document.createElement('div');
			storyContainer.classList.add('storyContainer');
			
			
			storyTitleDateContainer.appendChild(storyTitle);
			storyTitleDateContainer.appendChild(storyDate);
			
			titleSynopsisContainer.appendChild(storyTitleDateContainer);
			titleSynopsisContainer.appendChild(storySynopsis);
			
			storyContainer.appendChild(storyThumbnail);
			storyContainer.appendChild(titleSynopsisContainer);
			
			allStories.appendChild(storyContainer);
			
		}
	}
	
	/*const thisChapter = storyArray.find(item => item.title == chapter);
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
	
	*/
	
}
