const pad = s => s.length % 2 ?
  `0${s}` :
  s;
const paddedToBytes = s => s.match(/.{1,2}/g).map(s => parseInt(s, 16));
const numToPadded = n => paddedToBytes(pad(n.toString(16)));
const paddedToNum = a => a.reduceRight((p, n, i, a) => p + n * Math.pow(16, a.length - i - 1), 0);
const Vm = function Vm(lib) {
  this.lib = lib;
}
Vm.prototype.tokenize = function tokenize(s) {
  const a = [];
  let cons = "";
  let stringMode = false;
  let escaped = false;
  let ws = false;
  for (let i = 0; i < s.length; i++) {
    if (/\n| /.test(s[i])) {
      if (!ws) {
        a.push(cons);
        cons = "";
        ws = true;
      }
    } else {
      ws = false;
      if (stringMode) {
        if (escaped) {
          cons += s[i];
        } else if (s[i] == "\\") {
          escaped = true;
        } else if (s[i] == "\"") {
          a.push(cons);
          cons = "";
        } else {
          cons += s[i];
        }
      } else if (s[i] == "\"" && cons == "") {
        cons = s[i];
        alert(cons);
        stringMode = true;
      } else {
        cons += s[i];
      }
    }

  }
  if (cons != "") a.push(cons);
  return a;
}
Vm.prototype.parse = function(s) {
  s = this.tokenize(s);
  let memory = 0;
  let vars = {};
  let k = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] == ";") break;
    else if (s[i][0] == "\"") {
      leftovers.push(s[i]);
    } else if (i % 2) {
      vars[k] = {
        index: memory,
        size: s[i]
      };
      memory += s[i];
    } else k = s[i];
  }
  return {
    vars,
    memory,
    code: s.slice(i + 1)
  };
};
Vm.prototype.exec = function(s) {
  s = this.parse(s);
  let mem = new Uint8Array(s.memory);
  let argStack = [];

  for (let i = 0; i < s.code.length; i++) {
    if (s.code[i][0] == "$" && !isNaN(parseInt(s.code[i].substr(1), 16))) {
      argStack.push(paddedToBytes(s.code[i].substr(1)));
    } else if (s.code[i] == "SET") {
      mem.set(argStack.pop(), paddedToNumber(argStack.pop())); // number as array of bytes, pointer as array of bytes
    } else if (s.code[i] == "GET") {
      let ptr = rRt(argStack.pop());
      argStack.push(mem.slice(ptr, ptr + paddedToNumber(argStack.pop()) + 1)); // pointer as array of bytes, number as array of bytes
    } else if (s.code[i] == ";") {
      argStack = [];
    } else if (s.code[i] in this.lib) {
      this.lib[s.code[i]](argStack.reverse(), argStack, mem); // call external lib
    } else if (s.code[i][0] == "@") {
      argStack.push(mem.slice(s.vars[s.code[i].substr(1)].index, s.vars[s.code[i].substr(1)].index + s.vars[s.code[i].substr(1)].size)); // pointer as array of bytes, number as array of bytes
    } else {
      argStack.push(eRt(s.vars[s.code[i]].index)); // get pointer as array of bytes from label
    }
  }
}

const vm = new Vm({
  OUT(argStack) {
    console.log(argStack[argStack.length - 1].reduce((p, c) => p + String.fromCharCode(c), ""));
  }
});
vm.exec($("pre").html());
