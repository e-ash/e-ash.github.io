let gameStarted = false;

let ps1 = "@ ~ $ ";
const setPs1 = header => {
  ps1 = header;
  cline.firstChild.nodeValue = ps1;
  update();
};

const input = document.querySelector(".i");
const log = document.querySelector(".log");
const cline = document.querySelector(".cl");
onclick = e => {
  e.preventDefault();
  input.focus();
};

const processCommand = command => {
  if (gameStarted) {
    
  } else {
    if (command == "help") {
      print("ls\n");
      print("  list information about the files in the current directory.\n");
      print("run [program]\n");
      print("  run program specified (e.g. \"run file.sh\").\n");
    } else if (command == "ls") {
      print("-rwxr-xr-x 2 gnaiih ring ?<_! !!@ portal.sh\n");
    } else if (command == "run portal.sh") {
      gameStarted = true;
      setPs1("> ");
      print("hello.\n");
    }
  }
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
    processCommand(input.value);
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
});
const print = msg => {
  log.innerHTML += msg.replace(/ /g, "\u00A0").replace(/\n/g, "<br />");
};
const clear = () => {
  log.innerHTML = "";
};
const update = () => {
  const value = () => (input.value + " ").replace(/ /g, "\u00A0");
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
};

print("atkins shell 2\n\nprotip: atkins shell will not harm you\ntype help for help\n\n");

input.focus();
