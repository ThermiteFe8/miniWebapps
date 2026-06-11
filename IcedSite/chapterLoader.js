const title = document.getElementById('title');
const audioReading = document.getElementById('audioReading');
const mdBlockContainer = document.getElementById('mdBlockContainer');
const prevButton = document.getElementById('prevButton');
const chapterDropdown = document.getElementById('chapterDropdown');
const nextButton = document.getElementById('nextButton');

let params = new URLSearchParams(document.location.search);
let id = params.get("id");