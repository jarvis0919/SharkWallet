let { ipcRenderer } = require('electron');


function checkPass(psd3) {
  ipcRenderer.send("login", psd3);
}
function minimize() {
  ipcRenderer.send("minimize");
}
function toclose() {
  ipcRenderer.send("close");
}
ipcRenderer.on("tologin", (event, arg) => {
  if (arg == 0) {
    document.getElementById("state").innerHTML = "登入成功";
    a = '<div style="color: #fff;"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop "style="font-size: 80px;"></i></div>';
    document.getElementById("loging").innerHTML = a;
    setTimeout(() => {
      var body1 = document.getElementById("body1"); body1.style.height = "600px";
      var body2 = document.getElementById("body2"); body2.style.display = "none";
    }, 500);
    setTimeout(() => { ipcRenderer.send("togo", '../html/assets.html'); }, 2000);
  } else {
    b = '<div style="color: red;"><i class="layui-icon layui-icon-face-cry" ></i>&nbsp;登入失败，密码错误</div>';
    document.getElementById("state").innerHTML = b;
    setTimeout(() => { document.getElementById("state").innerHTML = "🦄输入密码来解锁您的钱包"; }, 2000);
  }
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
