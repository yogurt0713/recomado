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
    _tempStartTime: "2023-09-01T01:12:52.000Z",
  });
});
document.getElementById("save").addEventListener("click", (e) => {
  const textareas = [...document.querySelectorAll("textarea.action")];
  const text = textareas.map((t) => t.value).join("");
  const logText = document.getElementById("logText");
  logText.value = text;
  recomado.logAnnotations();
});

document.getElementById("downloadButton").addEventListener("click", (e) => {
  const jsonString = recomado.getAnnotations();
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transcript.json";
  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
