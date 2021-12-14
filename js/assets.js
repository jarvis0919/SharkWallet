let { ipcRenderer } = require('electron');


function minimizeindex() {
    ipcRenderer.send("minimizeindex");
}
function tocloseindex() {
    ipcRenderer.send("tocloseindex");
}
function getbalance(net, address, netid) {
    ipcRenderer.send("getbalance", net, address, netid);
}
function exportaccount(address, password) {
    console.log(address, password);
    ipcRenderer.send("exportaccount", address, password);
}
ipcRenderer.on("Privatekey", (event, Privatekey) => {
    console.log(Privatekey);
    document.getElementById("getPrivatekeybox").style.display = "block"
    document.getElementById("getPrivatekey").innerHTML = Privatekey;
})

