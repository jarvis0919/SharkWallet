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
function Cookierefresh(net, account) {
    console.log(account + "" +net );
    ipcRenderer.send("Cookierefresh", net, account);
}
ipcRenderer.on("Privatekey", (event, Privatekey) => {
    console.log(Privatekey);
    document.getElementById("getPrivatekeybox").style.display = "block"
    document.getElementById("getPrivatekey").innerHTML = Privatekey;
})
ipcRenderer.on("urlupdate", (event) => {
    ipcRenderer.send("checkForUpdate");
})

