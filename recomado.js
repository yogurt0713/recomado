export default class Recomado {
  async init({ video, ul, movie, annotations, _tempStartTime }) {
    this.#video = video;
    this.#video.src = movie;

    this.#ul = ul;
    

    const startedTime = new Date(_tempStartTime);
    const response = await fetch(annotations);
    this.#annotations = await response.json();

    for (const annotation of this.#annotations) {
      const li = document.createElement("li");


      const image = appendElement(li, "image");
      image.src = "images/" + annotation.image;


      appendElement(li, "participant", annotation.participantName).addEventListener(
        "change",
        (e) => {
          annotation.participantName = e.target.value;
        }
      );

      switch (annotation.action) {
        case "note": {
          //textareaの文字が更新されたら，annotation.noteTextも更新
          appendElement(li, "action", annotation.noteText).addEventListener(
            "change",
            (e) => {
              annotation.noteText = e.target.value;
            }
          );

          break;
        }
        
        case "ふせん": {
          appendElement(li, "action", annotation.noteText);
          break;
        }
          
        case "指差し": {
          appendElement(li, "action", "☞");
          break;
        }
        case "ハート": {
          appendElement(li, "action", "♥");
          break;
        }
      }

      const annotatedTime = new Date(annotation.time);
      const elapsedTimeMS = annotatedTime.getTime() - startedTime.getTime();
      const elapsedSeconds = elapsedTimeMS / 1000;
      const seconds = Math.floor(elapsedSeconds % 60);
      const minutes = Math.floor((elapsedSeconds / 60) % 60);
      const hours = Math.floor(elapsedSeconds / 3600);
      appendElement(
        li,
        "time",
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      li.dataset.elapsedTimeMS = elapsedTimeMS;

      this.#ul.append(li);
    }



    this.#ul.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      const elapsedTimeMS = li.dataset.elapsedTimeMS;
      this.#video.currentTime = elapsedTimeMS / 1000;

    
     
    });


    let timeUpdateListener = null;
    
    this.#video.addEventListener("play", (e) => {
      if (timeUpdateListener === null) {
        timeUpdateListener = (e) => {
          const currentTime = this.#video.currentTime * 1000;
          const closestAnnotation = this.findClosestAnnotation(currentTime);
          //console.log(closestAnnotation);

          this.removeHightLight();

          if (closestAnnotation) {
            closestAnnotation.classList.add("highlight");
            //console.log("highlight");

            //スクロール位置の調整
            //ulのvisibleのTopにclosestAnnotationのTopを合わせる
            closestAnnotation.scrollIntoView({ behaviour: "smooth", block: "nearest" });
          
          
          }
        };
        this.#video.addEventListener("timeupdate", timeUpdateListener);
      }
    });

    this.#video.addEventListener("pause", (e) => {
      if (timeUpdateListener !== null) {
        this.#video.removeEventListener("timeupdate", timeUpdateListener);
        timeUpdateListener = null;
      }
    });

  }

  findClosestAnnotation(currentTime) {
      
    let closestAnnotation = null;
    let minTimeDifference = Infinity;

    for (const li of this.#ul.querySelectorAll("li")) {
      const elapsedTimeMS = parseFloat(li.dataset.elapsedTimeMS);
      const timeDifference = Math.abs(elapsedTimeMS - currentTime);

      if (timeDifference < minTimeDifference) {
        minTimeDifference = timeDifference;
        closestAnnotation = li;
      }
    }

    return closestAnnotation;

  }

  removeHightLight(){
      for (const li of this.#ul.querySelectorAll("li")) {
        li.classList.remove("highlight");
      }
    }

  logAnnotations() {
      console.log(JSON.stringify(this.#annotations, null, 2));
    }

  getAnnotations() {
      const filteredAnnotations = this.#annotations.filter((annotation) => annotation.noteText !== "");
      return JSON.stringify(filteredAnnotations, null, 2);
    }

  #annotations = null;
  #video = null;
  #ul = null;
 
}

function appendElement(parent, className, text) {
  let element;

  //classNameがactionで'note'or 'ふせん' でなく，textが空でない場合，textareaを作成

  if (text !== "☞" && text !== "♥" ) {
    switch (className) {
      case "action": {
        element = document.createElement("textarea");
        break;
      }
      case "image": {
        element = document.createElement("img");
        break;
      }
      case "participant": {
        element = document.createElement("input");
        element.value = text;
        break;
      }
      default: {
        element = document.createElement("span");
        break;
      }
    }
    element.classList.add(className);
    element.textContent = text;
    parent.append(element);
  }
  return element;
  
  }



