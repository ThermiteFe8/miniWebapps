const normalPageHeader = document.getElementById('normalPageHeader');
const homeDescription = document.getElementById('homeDescription');
const recommendationContainer = document.getElementById('recommendationContainer');

const updateThumbnail = document.getElementById('updateThumbnail');
const updateTitle = document.getElementById('updateTitle');
const updateSynopsis = document.getElementById('updateSynopsis');

const blogThumbnail = document.getElementById('blogThumbnail');
const blogTitle = document.getElementById('blogTitle');
const blogSynopsis = document.getElementById('blogSynopsis');

const storyThumbnail = document.getElementById('storyThumbnail');
const storyTitle = document.getElementById('storyTitle');
const storySynopsis = document.getElementById('storySynopsis');




const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
getData('homeInfo.json');


async function getData(urlName) {
  const url = urlName;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
	getMarkdown('markdownFiles.json', json);
  } catch (error) {
    console.error(error.message);
  }
}

async function getMarkdown(urlName, homeInfo) {
  const url = urlName;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
	jsonInputHandler(json, homeInfo);
  } catch (error) {
    console.error(error.message);
  }
}

function jsonInputHandler(markdownInfo, homeInfo)
{
	
	normalPageHeader.innerHTML = homeInfo.title;
	homeDescription.innerHTML = homeInfo.description;
	
	let newUpdate = markdownInfo.updates.root.items.find(item=> item.title == homeInfo.recentUpdate);
	updateTitle.innerHTML = newUpdate.title;
	updateTitle.setAttribute('href', 'UpdatePage.html?post='+newUpdate.title);
	updateThumbnail.setAttribute('src', newUpdate.imagepath);
	updateThumbnail.setAttribute('onerror', "this.onerror=null; this.src='placeholder/placeholderThumbnail.png';");
	
	updateSynopsis.innerHTML = newUpdate.synopsis;
	
	
	let newBlog = markdownInfo.blogs.root.items.find(item=> item.title == homeInfo.newBlog);
	blogTitle.innerHTML = newBlog.title;
	blogTitle.setAttribute('href', 'BlogPage.html?post='+newBlog.title);
	blogThumbnail.setAttribute('src', newBlog.imagepath);
	blogThumbnail.setAttribute('onerror', "this.onerror=null; this.src='placeholder/placeholderThumbnail.png';");
	blogSynopsis.innerHTML = newBlog.synopsis;
	
	let storyKeys = Object.keys(markdownInfo.stories);
	let targetStory = homeInfo.featuredStory;
	let newStory;
	for(let i = 0; i < storyKeys.length; i++)
	{
		if(storyKeys[i] != "title")
		{
			
			
			if(markdownInfo.stories[storyKeys[i]].title == targetStory)
			{
				console.log(targetStory);
			console.log(storyKeys);
			console.log(markdownInfo.stories[storyKeys[i]].title);
				newStory = markdownInfo.stories[storyKeys[i]];
			}
		}
	}
	console.log(newStory);
	storyTitle.innerHTML = newStory.title;
	storyTitle.setAttribute('href', 'ChapterPage.html?story='+targetStory+'&chapter='+newStory.items[0].title);
	storyThumbnail.setAttribute('src', newStory.items[0].imagepath);
	storyThumbnail.setAttribute('onerror', "this.onerror=null; this.src='placeholder/placeholderThumbnail.png';");
	storySynopsis.innerHTML = newStory.items[0].synopsis;
	
	
	
	//let newStory = markdownInfo.stories.
	
	//const thisBlog = blogArray.find(item => item.title == story);
	/*
	let storyArray = jsonInput.blogs.root.items;
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
			storyTitle.setAttribute('href', 'BlogPage.html?post=' + storyArray[keys].title);
			storyTitle.innerHTML = storyArray[keys].title;
			storyTitle.id = "storyTitle";
			
			let storyDate = document.createElement('h3');
			storyDate.classList.add("storyDate");
			storyDate.innerHTML = storyArray[keys].date.replaceAll("/", "-");
			
			let storySynopsis = document.createElement('p');
			storySynopsis.classList.add("storySynopsis");
			storySynopsis.innerHTML = storyArray[keys].synopsis;
			
			let storyThumbnail = document.createElement('img');
			storyThumbnail.classList.add("storyThumbnail");
			storyThumbnail.setAttribute('onerror', "this.onerror=null; this.src='placeholder/placeholderThumbnail.png';");
			storyThumbnail.setAttribute('src', storyArray[keys].imagepath);
			
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
