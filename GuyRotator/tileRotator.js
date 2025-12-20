let fileName = "dataBlanked.json";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
const centerSrc = document.getElementById("centerSrc");
ctx.imageSmoothingEnabled = false;
const edgeSrc = document.getElementById("edgeSrc");
const cornerSrc = document.getElementById("cornerSrc");
const testPreview = document.getElementById("testPreview");
let stuffLoaded = 0;

let allImages = [];
let allImageNames = [];

let centerUrl = "";
let edgeUrl = "";
let cornerUrl = "";
let centerImg = new Image();
let edgeImg = new Image();
let cornerImg = new Image();

function handleFileSelect(file, index) {
  if (!file) return;

  console.log("handling file select", file.name);

  // Update output filename once (based on center image)
  if (index === 0) {
    fileName = "blanked" + file.name;
  }

  // Create a URL that preserves the original file bytes (ICC included)
  const objectUrl = URL.createObjectURL(file);

  let targetImg;
  if (index === 0) targetImg = centerImg;
  else if (index === 1) targetImg = edgeImg;
  else if (index === 2) targetImg = cornerImg;

  if (!targetImg) return;

  targetImg.onload = () => {
    // Revoke URL once the image is decoded
    URL.revokeObjectURL(objectUrl);

    // For the center image, size the canvas once
    if (index === 0) {
      canvas.width  = targetImg.width;
      canvas.height = targetImg.height;

      // Draw once for the test export
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(targetImg, 0, 0);
    }

    stuffLoaded++;
    console.log("loaded", stuffLoaded);
  };

  targetImg.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    console.error("Failed to load image:", file.name);
  };

  targetImg.src = objectUrl;

  // Preview uses the same object URL (color-accurate)
  if (index === 0) {
    testPreview.src = objectUrl;
  }
}


function StartCleaning()
{
	stuffLoaded = 0;
	allImages = [];
	allImageNames = [];
	handleFileSelect(centerSrc.files[0], 0);
	handleFileSelect(edgeSrc.files[0], 1);
	handleFileSelect(cornerSrc.files[0], 2);
	logicPostLoad();
	
}

function waitUntil(conditionFn, interval = 50, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      if (conditionFn()) {
        clearInterval(timer);
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(timer);
        reject(new Error("Max wait time reached"));
      }
    }, interval);
  });
}

async function logicPostLoad() {
  console.log('Waiting for data to be ready...');
  try {
    await waitUntil(() => stuffLoaded >= 3, 50, 10000); // Check every 50ms, timeout after 3s
		
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(centerImg, 0, 0);
		allImages.push(canvas.toDataURL('image/png'));
		allImageNames.push("Test");
		for (let mask = 0; mask < 16; mask++)
        {
            let j = 0;
            // Skip invalid cases if you want
            if(CheckMultiMask(mask))
            {
                j--;
            }

            for(let i = j; i < 1; i++)
            {

                let helper = false;
                if (i == -1)
                    helper = true;

                ApplyWallMask(mask, helper);


                let name = GetTileName(mask);
                if (helper)
                    name = name + "Corner";
                else
                    name = name + "Wall";
                
				allImages.push(canvas.toDataURL('image/png'));
				allImageNames.push(name);
            }
            
        }
		
		downloadImagesAsZip();

	}
    
   catch (error) {
    console.error(error.message); // Logs 'Max wait time reached' if it takes too long
  }
}

function ApplyWallMask(mask, cornerEnabled)
{
    // CLEAR PREVIOUS DRAW
    ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.globalCompositeOperation = "source-over";

// Fill with opaque background (usually transparent-looking but color-correct)
ctx.fillStyle = "rgba(0,0,0,0)"; // ❌ NOT THIS

// DO THIS INSTEAD:
ctx.fillStyle = "#000000"; // or the dominant background color
ctx.fillRect(0, 0, canvas.width, canvas.height);



    let tempImage = cornerEnabled ? cornerImg : edgeImg;

    // draw base center
    ctx.drawImage(centerImg, 0, 0);
		
		if(cornerEnabled)
		{
			if((mask & 1) != 0)
			{
				if((mask & 2) != 0)
				{
					rotateImage(tempImage, 0 * 90,centerImg.width/2,centerImg.height/2);
				}
				
				if((mask & 8) != 0)
				{
					rotateImage(tempImage, 3 * 90,centerImg.width/2,centerImg.height/2);
				}
			}
			
			
			if((mask & 4) != 0)
			{
				if((mask & 2) != 0)
				{
					rotateImage(tempImage, 1 * 90,centerImg.width/2,centerImg.height/2);
				}
				
				if((mask & 8) != 0)
				{
					rotateImage(tempImage, 2 * 90,centerImg.width/2,centerImg.height/2);
				}
			}
		}
		else
		{
			if((mask & 1) != 0)
			{
				rotateImage(tempImage, 0 * 90,centerImg.width/2,centerImg.height/2);
			}
			
			if((mask & 2) != 0)
			{
				rotateImage(tempImage, 1 * 90,centerImg.width/2,centerImg.height/2);
			}
			
			if((mask & 4) != 0)
			{
				rotateImage(tempImage, 2 * 90,centerImg.width/2,centerImg.height/2);
			}
			
			if((mask & 8) != 0)
			{
				rotateImage(tempImage, 3 * 90,centerImg.width/2,centerImg.height/2);
			}
		}
		
		
    }

function CheckMultiMask(mask)
    {
        let counter = 0;
        if((mask & 1) != 0)
            counter++;
        if ((mask & 2) != 0)
            counter++;
        if ((mask & 4) != 0)
            counter++;
        if ((mask & 8) != 0)
            counter++;

        if (counter >= 2)
            return true;
        return false;
    }
	
	function GetTileName(mask)
    {
        let name = "";
        if ((mask & 1) != 0)
            name = name + "Left";
        if ((mask & 2) != 0)
            name = name + "Forward";
        if ((mask & 4) != 0)
            name = name + "Right";
        if ((mask & 8) != 0)
            name = name + "Back";


        return name;
    }

async function downloadImagesAsZip(zipName = "images.zip") {
  const zip = new JSZip();
  const imgFolder = zip.folder("images");

  for (let i = 0; i < allImages.length; i++) {
    const url = allImages[i];

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}`);
      continue;
    }

    const blob = await response.blob();

    // Try to infer a filename
    const extension = blob.type.split("/")[1] || "png";
    const filename = allImageNames[i] +"."+ extension;

    imgFolder.file(filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Trigger download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = zipName;
  a.click();

  URL.revokeObjectURL(a.href);
}



function rotateImage(image, angleDeg, x, y) {
  ctx.save();

  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angleDeg * Math.PI / 180);

  ctx.drawImage(
    image,
    Math.round(-image.width / 2),
    Math.round(-image.height / 2)
  );

  ctx.restore();
}


function CleanJSON(inputJson)
{
	const keys = Object.keys(inputJson);
	const blankify = document.getElementById("blankCheck").checked;
	var replacementString = "";
	if(blankify)
	{
		replacementString = "blank";
	}
	
	
	for(let i = 0; i < keys.length; i++)
	{
		console.log(inputJson[keys[i]]);
		inputJson[keys[i]] = replacementString;
		if(keys[i] == "language")
		{
			inputJson[keys[i]] = "en";
		}
	}
	
	const jsonString = "{\"en\":" + JSON.stringify(inputJson, null, 2) + "}";
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName; // Desired filename
	document.body.appendChild(a); // Append to body (optional, but ensures it's in the DOM if needed)
	a.click();
	document.body.removeChild(a); // Remove after click if it was appended
	URL.revokeObjectURL(url);
}