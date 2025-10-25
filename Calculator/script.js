const display = document.getElementById("display");
const standardButtons = document.getElementById("standard-buttons");
const scientificButtons = document.getElementById("scientific-buttons");
const conversionButtons = document.getElementById("conversion-buttons");
const historyList = document.getElementById("history-list");
const clearHistory = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");

let currentInput = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

// ======== BUTTONS ========
const stdKeys = [
  "C","DEL","%","/",
  "7","8","9","*",
  "4","5","6","-",
  "1","2","3","+",
  "0",".","="
];

const sciKeys = [
  {label:"sin", func:"Math.sin"},
  {label:"cos", func:"Math.cos"},
  {label:"tan", func:"Math.tan"},
  {label:"√", func:"Math.sqrt"},
  {label:"x²", func:"sqr"},
  {label:"log", func:"Math.log"}
];

const convKeys = [
  {label:"°C ➜ °F", func:"CtoF"},
  {label:"°F ➜ °C", func:"FtoC"}
];

// ======== RENDER BUTTONS ========
function renderButtons(container, keys){
  keys.forEach(key=>{
    const btn=document.createElement("button");
    if(typeof key==="string"){
      btn.textContent = key;
      btn.dataset.value = key;
    } else {
      btn.textContent = key.label;
      btn.dataset.func = key.func;
    }
    container.appendChild(btn);
  });
}
renderButtons(standardButtons,stdKeys);
renderButtons(scientificButtons,sciKeys);
renderButtons(conversionButtons,convKeys);

// ======== INPUT HANDLER ========
document.querySelectorAll("#standard-buttons button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const val = btn.dataset.value;
    if(val==="C"){ currentInput=""; display.value=""; }
    else if(val==="DEL"){ currentInput=currentInput.slice(0,-1); display.value=currentInput; }
    else if(val==="="){ calculate(); }
    else { currentInput+=val; display.value=currentInput; }
  });
});

document.querySelectorAll("#scientific-buttons button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const func = btn.dataset.func;
    try{
      if(func==="sqr"){ currentInput = Math.pow(eval(currentInput),2); }
      else { currentInput = eval(`${func}(${currentInput})`); }
      display.value=currentInput;
      addHistory(`${func}() = ${currentInput}`);
    } catch { display.value="Error"; currentInput=""; }
  });
});

document.querySelectorAll("#conversion-buttons button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const func = btn.dataset.func;
    let val = parseFloat(currentInput);
    if(isNaN(val)) return;
    if(func==="CtoF"){ currentInput = ((val*9/5)+32).toFixed(2); }
    if(func==="FtoC"){ currentInput = ((val-32)*5/9).toFixed(2); }
    display.value=currentInput;
    addHistory(`${btn.textContent} => ${currentInput}`);
  });
});

// ======== CALCULATE ========
function calculate(){
  try{
    let expr = currentInput.replace(/×/g,"*").replace(/÷/g,"/");
    currentInput = eval(expr);
    display.value=currentInput;
    addHistory(expr+" = "+currentInput);
  } catch { display.value="Error"; currentInput=""; }
}

// ======== HISTORY ========
function addHistory(entry){
  history.push(entry);
  if(history.length>10) history.shift();
  localStorage.setItem("calcHistory",JSON.stringify(history));
  renderHistory();
}
function renderHistory(){
  historyList.innerHTML="";
  history.slice().reverse().forEach(item=>{
    const li=document.createElement("li");
    li.textContent=item;
    historyList.appendChild(li);
  });
}
renderHistory();

clearHistory.addEventListener("click",()=>{
  history=[];
  localStorage.removeItem("calcHistory");
  renderHistory();
});

// ======== THEME ========
themeToggle.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});
