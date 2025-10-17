let fileName = "dataBlanked.json";

function handleFileSelect(inputFiles) {
	const file = inputFiles; // Get the first selected file
	console.log("handling file select");
	fileName = "blanked" + file.name;
	if (file) {
		const reader = new FileReader(); // Create a FileReader object

		reader.onload = function(e) {
			try {
				const jsonString = e.target.result; // Get the file content as a string
				const jsonData = JSON.parse(jsonString); // Parse the JSON string into a JavaScript object

				// Now you can work with the jsonData object
				console.log(jsonData); 
				CleanJSON(jsonData);
				console.log("the JSON thing worked");
				//document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2); // Display it
			} catch (error) {
				console.error("Error parsing JSON:", error);
				//document.getElementById('output').textContent = "Error: Invalid JSON file.";
			}
		};

		reader.readAsText(file); // Read the file content as text
	}
}

function StartCleaning()
{
	
	const textBox = document.getElementById("textField");
	if(textBox.value != "")
	{
		console.log("attempting json text processing")
		const boxJsonAttempt  =  JSON.parse(textBox.value);
		CleanJSON(boxJsonAttempt);
	}
	else
	{
		const selectedFile = document.getElementById("input").files[0];
		handleFileSelect(selectedFile);
	}
	
	
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