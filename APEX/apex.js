const ps1 = "@ ~ $ ";

const input = document.querySelector(".i");
const log = document.querySelector(".log");
const cline = document.querySelector(".cl");
onclick = e => {
  e.preventDefault();
  input.focus();
};

let prev = 0;
let prevBak = false;
input.onkeydown = e => setTimeout(() => {
  const docLen = document.body.scrollHeight;
  scrollTo(0, docLen - innerHeight);
  const ps = ps1.replace(/ /g, "\u00A0");
  const value = () => (input.value + " ").replace(/ /g, "\u00A0");
  if (e.keyCode == "13") {
    print(ps1 + value() + "\n");
    
    input.value = "";
  }
  const selStart = input.selectionStart;
  const selEnd = input.selectionEnd > input.selectionStart ? input.selectionEnd - 1 : input.selectionEnd;
  const selLen = selEnd - selStart;
  const rSelLen = input.selectionEnd - input.selectionStart;
  
  const classes = ["inv"];
  if (e.keyCode == 37 && rSelLen > prev || e.keyCode == 39 && rSelLen < prev || prevBak == true && rSelLen == prev) {
    classes.push("rev");
    prevBak = true;
  } else {
    prevBak = false;
  }
  
  if (input.selectionEnd - input.selectionStart) {
    classes.push("hl");
  }
  
  cline.innerHTML = `${ps}${value().substr(0, selStart)}<span class="${classes.join(" ")}">${value().substr(selStart, selLen + 1)}</span>${value().substr(selEnd + 1)}`;
  
  prev = rSelLen;
})
const print = msg => {
  log.innerHTML += msg.replace(/\n/g, "<br />");
}

print("atkins shell 2\n\nprotip: atkins shell will not harm you\n\n");

input.focus();
