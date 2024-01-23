import './style.css'

  const width = 1920;
  let height = 0;
  let streaming = false;

  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let startbutton = document.getElementById("startbutton");
  let photosList = document.getElementById("photos-list");
  let onionskins = document.getElementById("onionskins");
  let countdown = document.getElementById("countdown");

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

    for (let i = 20; i >= 0; i--){
      countdown.innerText = i+"";
      await sleep(1000);
    }

    const context = canvas.getContext("2d");

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");

      let newPhotoDiv = document.createElement("div");
      newPhotoDiv.style = "display:block; width:100%;"
      let newPhoto = document.createElement("img");
      newPhotoDiv.appendChild(newPhoto);

      newPhoto.setAttribute("src", data);
      newPhoto.setAttribute("class", "prospectivePhoto");
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
      child.style = "height:100%;position:absolute;transform:translate(-50%,0%);opacity:"+opacity;
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