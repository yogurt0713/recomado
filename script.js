import Recomado from "./recomado.js";
const recomado = new Recomado();

let movieURL;
let annotationsURL;
document.getElementById("movie").addEventListener("change", (e) => {
  const file = e.target.files[0];
  movieURL = URL.createObjectURL(file);
});
document.getElementById("annotations").addEventListener("change", (e) => {
  const file = e.target.files[0];
  annotationsURL = URL.createObjectURL(file);
});
document.getElementById("apply").addEventListener("click", (e) => {
  recomado.init({
    video: document.querySelector("video"),
    ul: document.querySelector("ul"),
    autoscroll: document.querySelector("#autoscroll"),
    movie: movieURL,
    annotations: annotationsURL,
    _tempStartTime: "2023-01-01T00:00:00.000Z",
  });
});
document.getElementById("save").addEventListener("click", (e) => {
  const textareas = [...document.querySelectorAll("textarea.action")];
  const text = textareas.map((t) => t.value).join("\n");
  const logText = document.getElementById("logText");
  logText.value = text;
});
