let { ipcRenderer } = require('electron');
var fs = require("fs");

function minimizeindex() {
    ipcRenderer.send("minimizeindex");
}
function tocloseindex() {
    ipcRenderer.send("tocloseindex");
}
function createoneaccount() {
    ipcRenderer.send("createaccount", 1);
}
function importaccount(state, decryptfile, pass) {
    console.log(state);
    console.log(decryptfile);
    console.log(pass);
    if (decryptfile != "") {
        if (state == "0") {
            ipcRenderer.send("importaccount", state, decryptfile, pass);
        } else if (state == "1") {
            ipcRenderer.send("importaccount", state, decryptfile, pass);
        }
    } else {
        console.log("不能为空");
    }
}
ipcRenderer.on("import", (event, Account) => {
    console.log(Account);
    document.getElementById("importstate").innerHTML = Account;
})
function exportaccount(address, password) {
    console.log(address, password);
    ipcRenderer.send("exportaccount", address, password);
}
ipcRenderer.on("Privatekey", (event, Privatekey) => {
    console.log(Privatekey);
    document.getElementById("getPrivatekeybox").style.display = "block"
    document.getElementById("getPrivatekey").innerHTML = Privatekey;
})
function editaccount(address, id) {
    console.log(address, id);
    ipcRenderer.send("editaccount", address, id);
}

function connectNet(net, chainid) {
    ipcRenderer.send("connectNet", net, chainid);
}
ipcRenderer.on("chainid", (event, chainid) => {
    console.log(chainid);

})
function addToken(tokenaddress, address, net) {
    // var abi = addtoken.abi.value;
    ipcRenderer.send("addToken", tokenaddress, address, net);
}
function addNet(id, net, chainid) {
    ipcRenderer.send("addNet", id, net, chainid);
}
function editnet(id, net, chainid, netstate) {
    console.log("edit==>" + id + net + chainid + netstate)
    ipcRenderer.send("editnet", id, net, chainid, netstate);
}
ipcRenderer.on("net", (event, state) => {
    console.log(state);
    if (state == "true") {
        document.getElementById("addnetstate").innerHTML = "添加成功";
        console.log("成功");
    } else {
        document.getElementById("addnetstate").innerHTML = state;
        console.log("添加失败")
    }
})
function removenet(netstate){
    ipcRenderer.send("removenet", netstate);
}
function removeaccount(address){
    ipcRenderer.send("removeaccount", address);
}
// function remove1(id) {
//     fs.readFile('./json/net.json', function (err, data) {
//         if (err) {
//             return console.error(err);
//         }
//         var person = data.toString();//将二进制的数据转换为字符串
//         person = JSON.parse(person);//将字符串转换为json对象
//         var delbool = true;
//         for (k = 0; k < person.data.length; k++) {
//             if (person.data[k].id == id) {
//                 console.log(k)
//                 person.data.splice(k, 1);
//                 delbool = false;
//             }
//         }
//         person.total = person.data.length;//定义一下总条数，为以后的分页打基础
//         var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
//         if (!delbool) {
//             fs.writeFile('./json/net.json', str, function (err) {
//                 if (err) {
//                     console.error(err);
//                     console.log("删除失败")
//                 }
//                 readNet();
//                 console.log('删除成功');
//             })
//         } else {
//             readNet();
//             console.log('删除失败');
//         }
//     })
// }
// function remove2(id) {
//     fs.readFile('./json/account.json', function (err, data) {
//         if (err) {
//             return console.error(err);
//         }
//         var person = data.toString();//将二进制的数据转换为字符串
//         person = JSON.parse(person);//将字符串转换为json对象
//         var delbool = true;
//         for (k = 0; k < person.data.length; k++) {
//             if (person.data[k].id == id) {
//                 console.log(k)
//                 person.data.splice(k, 1);
//                 delbool = false;
//             }
//         }
//         //定义一下总条数，为以后的分页打基础
//         var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
//         if (!delbool) {
//             fs.writeFile('./json/account.json', str, function (err) {
//                 if (err) {
//                     console.error(err);
//                     console.log("删除失败")
//                 }
//                 readNet();
//                 console.log('删除成功');
//             })
//         } else {
//             readNet();
//             console.log('删除失败');
//         }
//     })
// }
function toRearrange(password,newpassword){
    ipcRenderer.send("toRearrange", password,newpassword);
}
function toinitialization(password){
    ipcRenderer.send("toinitialization", password);
}
function tomnemonics(password){
    ipcRenderer.send("tomnemonics", password);
}