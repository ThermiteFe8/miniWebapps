const title = document.getElementById('title');
let mdBlockContainer = document.getElementById('mdBlockContainer');
const postDate = document.getElementById('postDate');

let params = new URLSearchParams(document.location.search);
let story = params.get("post");


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
	let blogArray = jsonInput.blogs.root.items;
	console.log(blogArray);
	
	const thisBlog = blogArray.find(item => item.title == story);
	
	let newBlock = document.createElement("md-block");
	newBlock.setAttribute('src', thisBlog.filepath);
	mdBlockContainer.appendChild(newBlock);
	pageHeader.innerHTML = "Blogs | " + thisBlog.title;
	title.innerHTML = thisBlog.title;
	postDate.innerHTML = thisBlog.date.replaceAll("/", "-");
	
	
	
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

		mdBlockImages[i].setAttribute('src', 'blogs/'+mdBlockImages[i].getAttribute('src'));
	}
}