import './style.css'

let width = 1920;
let height = 0;
let streaming = false;

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let startbutton = document.getElementById("start-button");
let photosList = document.getElementById("photos-list");
let onionskins = document.getElementById("onionskins");
let countdown = document.getElementById("countdown");
let secondsInput = document.getElementById("seconds-input");

if (window.innerWidth < window.innerHeight){
  document.body.style = "font-size:0.75em";
  countdown.style = "font-size:10em; margin-top:2em;";
  document.getElementById("countdown-input-container").style = "width:100%; text-align:center;";
  startbutton.style = "padding:0.5em 0.25em;";
  document.getElementById("app").style = "flex-direction:column;"
  photosList.style = "flex-direction:row; overflow:scroll hidden; height:unset; width:100vw; height:25vh; padding-left:3em; margin:0; box-sizing:border-box;";
  onionskins.style = "flex-direction:column;";
}

startbutton.onclick = (e) => {takePicture(); e.preventDefault();};

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error("Error: "+err);
  });

video.oncanplay = (e) => {
  if (!streaming) {
    width = video.videoWidth;
    height = video.videoHeight / (video.videoWidth / width);

    if (isNaN(height)) {
      height = width / (4 / 3);
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    streaming = true;
  }
}

const sleep = milliseconds => new Promise(r => setTimeout(r, milliseconds));

async function takePicture() {

  if (secondsInput.value != "0"){
    for (let i = secondsInput.value; i >= 0; i--){
      countdown.innerText = i+"";
      await sleep(1000);
    }
  }
    
  const context = canvas.getContext("2d");

  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");

    let newPhotoDiv = document.createElement("div");

    if (window.innerWidth < window.innerHeight){ //mobile
      newPhotoDiv.style = "display:block; height:100%;"
    } else {  //computer
      newPhotoDiv.style = "display:block; width:100%;"
    }

    let newPhoto = document.createElement("img");
    newPhotoDiv.appendChild(newPhoto);

    newPhoto.setAttribute("src", data);
    newPhoto.setAttribute("class", "prospectivePhoto");

    if (window.innerWidth < window.innerHeight){ 
      newPhoto.style = "height:50%; width:inherit;"
    }

    let newCheckBox = document.createElement("input");
    newCheckBox.setAttribute("type","checkbox");
    newCheckBox.id = "cb-"+data;
    newCheckBox.style = "position:relative;";
    newCheckBox.onclick = (e) => {e.currentTarget.checked ? addOnionSkin(newPhoto) : removeOnionSkin(newPhoto);};
    newPhotoDiv.appendChild(newCheckBox);

    newPhoto.onclick = (e) => {newCheckBox.checked = !newCheckBox.checked; newCheckBox.checked ? addOnionSkin(newPhoto) : removeOnionSkin(newPhoto);};

    let label = document.createElement("label");
    label.style = "font-size:0.9em;";
    label.innerText = "Tick to use the above photo as an onionskin"
    label.setAttribute("for", newCheckBox.id);
    newPhotoDiv.appendChild(label);
    photosList.appendChild(newPhotoDiv);
  } else {
    clearphoto();
  }
  countdown.innerText = "";
}

function addOnionSkin(originalImg){
  let newOnionSkin = document.createElement("img");
  newOnionSkin.id = originalImg.src; //intended.
  newOnionSkin.src = originalImg.src; 
  onionskins.appendChild(newOnionSkin);

  recalculateOnionSkinOpacities();
}

function recalculateOnionSkinOpacities(){
  let opacity = 1/(onionskins.childElementCount + 1);
  for (const child of onionskins.children) { //updating all onionskins to have the new opacity so that they all remain at an equal slice of the whole
    if (window.innerWidth < window.innerHeight){
      child.style = "max-width:100%;position:absolute;opacity:"+opacity;  //mobile
    } else {
      child.style = "height:100%;position:absolute;opacity:"+opacity; //computer
    }
  }
}

function removeOnionSkin(originalImg){
  document.getElementById(originalImg.src).remove();
  recalculateOnionSkinOpacities();
}

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "Are you sure you want to leave?\nMake sure you've right clicked and saved any images you want to keep before leaving.";

  (e || window.event).returnValue = confirmationMessage;
  return confirmationMessage;
});