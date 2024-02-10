import Recomado from "./recomado.js";
let recomado;

let movieURL;
let annotationsURL;
let startUtcTime;


document.getElementById("movie").addEventListener("change", (e) => {
  const file = e.target.files[0];
  movieURL = URL.createObjectURL(file);
  console.log(movieURL);
});
document.getElementById("annotations").addEventListener("change", (e) => {
  const file = e.target.files[0];
  annotationsURL = URL.createObjectURL(file);
});

document.getElementById("recordList").addEventListener("click", (e) => {
  var rect = e.target.getBoundingClientRect();
  console.log('rect', rect);
  console.log('e.clientY', e.clientY);
  e.target.scrollTop = e.clientY - rect.top;
 
});

document.getElementById("time").addEventListener("click", (e) => {
  //valueから得られたtimeをJSTからUTCに変換
  const time = document.getElementById("startTime").value;
  const localtime = new Date(time);
  localtime.setHours(localtime.getHours() - 9);
  
  startUtcTime = new Date(localtime).toISOString();

  console.log(startUtcTime);
})

document.getElementById("apply").addEventListener("click", (e) => {
  recomado = new Recomado();
  recomado.init({
    video: document.querySelector("video"),
    ul: document.querySelector("ul"),
    movie: movieURL,
    annotations: annotationsURL,
    _tempStartTime: startUtcTime,
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
  let jsonString = recomado.getAnnotations();
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

