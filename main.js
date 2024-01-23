import './style.css'

  const width = 1920;
  let height = 0;
  let streaming = false;

  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let startbutton = document.getElementById("startbutton");
  let photosList = document.getElementById("photos-list");
  let onionskins = document.getElementById("onionskins");

  startbutton.onclick = (e) => {takepicture(); e.preventDefault();};

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

  function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");

      let newPhoto = document.createElement("img");
      newPhoto.setAttribute("src", data);
      newPhoto.setAttribute("class", "prospectivePhoto");
      newPhoto.setAttribute("title", "Click to use as onionskin");
      newPhoto.onclick = (e) => {addOnionSkin(e.target)};
      photosList.appendChild(newPhoto);
    } else {
      clearphoto();
    }
  }

  function addOnionSkin(originalImg){
    let newOnionSkin = document.createElement("img");
    newOnionSkin.id = originalImg.src; //intended.
    newOnionSkin.src = originalImg.src; 
    onionskins.appendChild(newOnionSkin);

    let opacity = 1/(onionskins.childElementCount + 1);
    for (const child of onionskins.children) { //updating all onionskins to have the new opacity so that they all remain at an equal slice of the whole
      child.style = "height:100%;position:absolute;transform:translate(-50%,0%);opacity:"+opacity;
    }
  }