let { ipcRenderer } = require('electron');

var tokenstate = false;
var sendok = false;
var sendbalancestate = true;
function minimizeindex() {
  ipcRenderer.send("minimizeindex");
}
function tocloseindex() {
  ipcRenderer.send("tocloseindex");
}

function selecttoken1(symbol) {
  // console.log("good"+symbol)
  if (!sendok) {
    if (!tokenstate) {
      document.getElementById("sendbalance").style.display = "none";
      document.getElementById("tokenlist1").style.display = "block";
      document.getElementById("choicetoken").style.display = "block";
      document.getElementById("sendok").style.display = "none";
      tokenstate = !tokenstate;
      // sendbalancestate = !sendbalancestate;
      console.log("tokenstate打开了！！！" + tokenstate);
    } else {
      document.getElementById("sendbalance").style.display = "block";
      document.getElementById("tokenlist1").style.display = "none";
      document.getElementById("choicetoken").style.display = "none";
      document.getElementById("sendok").style.display = "none";
      tokenstate = !tokenstate;
      // sendbalancestate = !sendbalancestate;
      console.log("tokenstate关闭了！！！" + tokenstate);
    }
  } else if (!sendbalancestate) {
    if (!tokenstate) {
      document.getElementById("sendbalance").style.display = "none";
      document.getElementById("tokenlist1").style.display = "block";
      document.getElementById("choicetoken").style.display = "block";
      document.getElementById("sendok").style.display = "none";
      tokenstate = !tokenstate;
      // sendok = !sendok;
      console.log("tokenstate打开了！！！" + tokenstate);
    } else {
      document.getElementById("sendbalance").style.display = "none";
      document.getElementById("tokenlist1").style.display = "none";
      document.getElementById("choicetoken").style.display = "none";
      document.getElementById("sendok").style.display = "block";
      tokenstate = !tokenstate;

      // sendok = !sendok;
      console.log("tokenstate关闭了！！！" + tokenstate);
    }
  }
  if (symbol != 0) {
    document.getElementById("nowtoken").innerHTML = symbol;
  }
}
function truesend() {
  if (sendbalancestate) {
    document.getElementById("sendbalance").style.display = "none";
    document.getElementById("sendok").style.display = "block";
    document.getElementById("from").innerHTML = document.getElementById("address").innerHTML;
    document.getElementById("to").innerHTML = document.getElementById("HandoverCompany").value;
    console.log(document.getElementById("sendvalue").value)
    if (document.getElementById("sendvalue").value == 0) {
      console.log("这里")
      document.getElementById("sendingETH").innerHTML = "0";
    } else {
      document.getElementById("sendingETH").innerHTML = document.getElementById("sendvalue").value;
    }
    sendbalancestate = !sendbalancestate;
    sendok = !sendok;

  } else {
    console.log("错误，请检查软件")
  }
}
function cancel() {
  if (!sendbalancestate) {
    document.getElementById("sendbalance").style.display = "block";
    document.getElementById("sendok").style.display = "none";
    sendbalancestate = !sendbalancestate;
    sendok = !sendok;
  } else {
    console.log("错误，请检查软件")
  }
}
ipcRenderer.on("tologin", (event, arg) => {
  if (arg == 0) {
    document.getElementById("state").innerHTML = "登入成功" + "=====三秒后将会跳转至主页面";
    setTimeout(() => { window.location.href = 'assets.html'; }, 3000);
  } else {
    document.getElementById("state").innerHTML = "登入失败";
  }
})
function getbalance(net, address, netid) {
  ipcRenderer.send("getbalance", net, address, netid);
}
function getpirce(net) {
  ipcRenderer.send("getGasPrice", net);
}
function sendbalance(net, address, address1, value1, sendGaslimit, Maxfee, token) {
  ipcRenderer.send("sendbalance", net, address, address1, value1, sendGaslimit, Maxfee, token);
}
ipcRenderer.on("transactionhash", (event, state, transaction) => {
  console.log(transaction);
  if (state == 0) {
    document.getElementById("transaction").innerHTML = transaction + "交易成功";
  } else {
    document.getElementById("transaction").innerHTML = "交易失败";
  }
})
function opentransaction(id, state) {
  console.log(id);
  ipcRenderer.send("opentransaction", id, state);
}

ipcRenderer.on("trackTransaction", (event, state) => {
  console.log(state);
})

function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString();
}

