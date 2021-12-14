let { ipcRenderer } = require('electron');


function minimize() {
  ipcRenderer.send("minimize");
}
function toclose() {
  ipcRenderer.send("close");
}
function registrpsd(psd1, psd2) {
  if (psd1.length < 6 || psd1.length > 16) {
    document.getElementById("state").innerHTML = "密码只能为6~16位字符！";
    setTimeout(() => { document.getElementById("state").innerHTML = "输入密码,注册您的小鲨鱼钱包。"; }, 2000);
    return false;
  } else {
    if (psd1 != psd2) {
      document.getElementById("state").innerHTML = "两次输入密码不一致！";
    } else {
      ipcRenderer.send("getMnemonic", psd1);
    }
  }
}
function nodisplay() {
  var container = document.getElementById('register1');
  var oDiv = container.getElementsByClassName('tab_re');
  var container1 = document.getElementById('tologin');
  var oDiv1 = container1.getElementsByClassName('tab_re');
  oDiv[0].style.display = "none";
  oDiv[1].style.display = "none";
  oDiv[2].style.display = "none";
  oDiv[3].style.display = "none";
  oDiv1[0].style.display = "block";
  oDiv1[1].style.display = "block";
  oDiv1[2].style.display = "block";
}

function yesdisplay() {
  var container = document.getElementById('register1');
  var oDiv = container.getElementsByClassName('tab_re');
  var container1 = document.getElementById('tologin');
  var oDiv1 = container1.getElementsByClassName('tab_re');
  oDiv[0].style.display = "block";
  oDiv[1].style.display = "block";
  oDiv[2].style.display = "block";
  oDiv[3].style.display = "block";
  oDiv1[0].style.display = "none";
  oDiv1[1].style.display = "none";
  oDiv1[2].style.display = "none";
  ipcRenderer.send("delfile", 2);
  document.getElementById("state").innerHTML = "输入密码,注册您的小鲨鱼钱包。";
  document.getElementById("mnemonic").innerHTML = "";
}
function tologin(state) {
  if (state == 1) {
    var container = document.getElementById('register1');
    var oDiv = container.getElementsByClassName('tab_re');
    oDiv[0].style.display = "none";
    oDiv[1].style.display = "none";
    oDiv[2].style.display = "none";
    oDiv[3].style.display = "none";
  } else {
    document.getElementById("state").innerHTML = "三秒后跳转至登录页面";
  }
  var container1 = document.getElementById('tologin');
  var oDiv1 = container1.getElementsByClassName('tab_re');
  oDiv1[0].style.display = "none";
  oDiv1[1].style.display = "none";
  oDiv1[2].style.display = "none";
  ipcRenderer.send("createaccount", 1);
  a = '<div style="color: #fff;"><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop "style="font-size: 60px;"></i></div>';
  document.getElementById("registering").innerHTML = a;
  setTimeout(() => {
    var body1 = document.getElementById("body1"); body1.style.height = "600px";
    var body2 = document.getElementById("body2"); body2.style.display = "none";
  }, 1000);
  setTimeout(() => { ipcRenderer.send("togo", '../html/login.html'); }, 3000);
}

ipcRenderer.on("Mnemonic", (event, arg) => {
  setTimeout(() => { nodisplay(); }, 500);
  setTimeout(() => {
    document.getElementById("state").innerHTML = "注册成功,请牢记您的助记词，并拒绝透露给其他人";
    document.getElementById("mnemonic").innerHTML = arg;
  }, 1000);

})
ipcRenderer.on("k", (event, arg) => {
  console.log(arg);

})
function countSegments(s) {
  s = s.replace(/\s+/g, "中")
  var l1 = s.length

  if (s[0] != '中' && s[s.length - 1] != '中') {
    l1 += 1
  } else if (s[0] == '中' && s[s.length - 1] == '中') {
    l1 -= 1
  }
  s = s.replace(/[中]/g, "")
  var l2 = s.length
  return l2 == 0 ? 0 : l1 - l2;
}
function Getstringword(n) {
  n = n.replace(/\s+/g, "中")
  if (n[0] == '中') {
    n = n.slice(1, n.length);
  }
  if (n[n.length - 1] == '中') {
    n = n.slice(0, n.length - 1);
  }
  n = n.replace(/[中]/g, " ")
  return n;
}

function exportmnemonics(pass, mnemonics) {
  ipcRenderer.send("exportmnemonics", pass, mnemonics);
}

