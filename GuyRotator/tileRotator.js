let fileName = "dataBlanked.json";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const centerSrc = document.getElementById("centerSrc");
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

function handleFileSelect(inputFile, index) {
	const file = inputFile; // Grab the actual File
	console.log("handling file select");

	if (!file) return;

	fileName = "blanked" + file.name;

	const reader = new FileReader();

	reader.onload = function (e) {
		const dataUrl = e.target.result; // ✅ result, not results

		if (index == 0) {
			centerUrl = dataUrl;
			console.log(centerUrl);
			const img = new Image();
			img.onload = function () {
				// Optional: resize canvas to image size
				ctx.canvas.width = img.width;
				ctx.canvas.height = img.height;

				ctx.drawImage(img, 0, 0);
				handleFileSelect(edgeSrc.files[0], 1);
			};

			img.src = dataUrl;
			testPreview.src = dataUrl; // preview <img>
			centerImg.src = dataUrl;
			
			stuffLoaded++;
			console.log(stuffLoaded);
		}
		else if (index == 1) {
			edgeUrl = dataUrl;
			edgeImg.src = dataUrl;
			stuffLoaded++;
			console.log(stuffLoaded);
		}
		else if (index == 2) {
			cornerUrl = dataUrl;
			cornerImg.src = dataUrl;
			stuffLoaded++;
			console.log(stuffLoaded);
		}
	};

	reader.readAsDataURL(file); // ✅ correct for images
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
		let tempImage = edgeImg;
		if(cornerEnabled)
		{
			tempImage = cornerImg;
		}
		rotateImage(centerImg, 0,centerImg.width/2,centerImg.height/2);
		
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



function rotateImage(image, angleInDegrees, x, y) {
  // 1. Save the current canvas state (prevents other drawings from being rotated)
  ctx.save();

  // 2. Translate the canvas origin to the desired center of rotation
  ctx.translate(x, y);

  // 3. Rotate the canvas by the specified angle (in radians)
  // Convert degrees to radians: radians = degrees * Math.PI / 180
  const angleInRadians = angleInDegrees * Math.PI / 180;
  ctx.rotate(angleInRadians);

  // 4. Draw the image
  // Draw the image at a negative offset from the new origin so its center aligns with (x, y)
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // 5. Restore the canvas to its state before the transformations
  // This resets the origin and rotation for subsequent drawing operations
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