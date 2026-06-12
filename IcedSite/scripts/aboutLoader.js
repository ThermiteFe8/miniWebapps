const normalPageHeader = document.getElementById('normalPageHeader');
const pageHeader = document.getElementById('pageHeader');

const aboutName = document.getElementById('aboutName');
const aboutDescription = document.getElementById('aboutDescription');
const mdBlockContainer = document.getElementById('mdBlockContainer');



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
getData('aboutInfo.json');


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

async function getMarkdown(urlName, aboutInfo) {
  const url = urlName;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
	jsonInputHandler(json, aboutInfo);
  } catch (error) {
    console.error(error.message);
  }
}

function jsonInputHandler(markdownInfo, aboutInfo)
{
	
	normalPageHeader.innerHTML = aboutInfo.title;
	pageHeader.innerHTML = aboutInfo.title;
	
	aboutName.innerHTML = aboutInfo.name;
	aboutDescription.innerHTML = aboutInfo.description;
	
	let newBlock = document.createElement('md-block');
	newBlock.setAttribute('src', aboutInfo.siteDescription);
	mdBlockContainer.appendChild(newBlock);
	
	
}
