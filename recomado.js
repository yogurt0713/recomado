export default class Recomado {
  async init({ video, ul, autoscroll, movie, annotations, _tempStartTime }) {
    this.#video = video;
    this.#video.src = movie;

    this.#ul = ul;
    this.#autoscroll = autoscroll;

    const startedTime = new Date(_tempStartTime);
    const response = await fetch(annotations);
    this.#annotations = await response.json();

    for (const annotation of this.#annotations) {
      const li = document.createElement("li");

      const image = appendElement(li, "image");
      image.src = "sample.jpg";

      appendElement(li, "participant", annotation.participantName);

      switch (annotation.action) {
        case "note": {
          appendElement(li, "action", annotation.noteText);
          //textareaの文字が更新されたら，annotation.noteTextも更新
          appendElement(li, "action", annotation.noteText).addEventListener(
            "change",
            (e) => {
              annotation.noteText = e.target.value;
            }
          );

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
      const elapsedTimeMS = annotatedTime - startedTime;
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

    const button = document.createElement("button");
    button.textContent = "ログを出力";
    button.addEventListener("click", () => {
      //console.log(JSON.stringify(this.#annotations));
      const textareas = [...document.querySelectorAll("textarea.action")];
      const text = textareas.map((t) => t.value).join("");
      const logText = document.getElementById("logText");
      logText.value = text;
    });
    this.#ul.after(button);

    this.#ul.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      const elapsedTimeMS = li.dataset.elapsedTimeMS;
      this.#video.currentTime = elapsedTimeMS / 1000;
    });

    this.#updateUserScrollEnabled();
    this.#autoscroll.addEventListener("change", (e) => {
      this.#updateUserScrollEnabled();
    });

    const lis = [...this.#ul.querySelectorAll("li")];
    this.#video.addEventListener("timeupdate", (e) => {
      if (!this.#autoscroll.checked) {
        return;
      }

      const focusTimeMS = this.#video.currentTime * 1000 - 1000;
      const focusable = lis.find(
        (li) => li.dataset.elapsedTimeMS > focusTimeMS
      );
      focusable.scrollIntoView(true);
    });
  }

  #updateUserScrollEnabled() {
    if (this.#autoscroll.checked) {
      this.#ul.classList.add("user_scroll_disabled");
    } else {
      this.#ul.classList.remove("user_scroll_disabled");
    }
  }

  #annotations = null;
  #video = null;
  #ul = null;
  #autoscroll = null;
}

function appendElement(parent, className, text) {
  let element;

  //classNameがactionで'note'の場合，textareaを作成
  if (className === "action" && text !== "☞" && text !== "♥") {
    element = document.createElement("textarea");
  } else {
    element = document.createElement("span");
  }
  element.classList.add(className);
  element.textContent = text;
  parent.append(element);
  return element;
}
