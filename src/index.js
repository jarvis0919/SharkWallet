const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { contextIsolated, Start_addressill } = require('process');
const fs = require('fs');
const Web3 = require('web3');
const readline = require('readline');
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const util = require('ethereumjs-util');
const Tx = require('ethereumjs-tx');
const crypto = require('crypto');
const { keccak } = require('ethereumjs-util');
const CryptoJS = require('crypto-js');
const QRCode = require('qrcode');
const clipboard = require('electron').clipboard
const { autoUpdater } = require('electron-updater')
const userhome = require('userhome');


const USE_HOME = userhome('AppData', 'Local', 'SharkWallet', 'Accountfile', 'json');
const eptionmcpath = userhome('AppData', 'Local', 'SharkWallet', 'Accountfile', 'eptionmc.txt');
const hashpath = userhome('AppData', 'Local', 'SharkWallet', 'Accountfile', 'hash.txt');
const accountpath = userhome(USE_HOME, 'account.json');
const netpath = userhome(USE_HOME, 'net.json');
const tokenlistpath = userhome(USE_HOME, 'tokenlist.json');
const transactionpath = userhome(USE_HOME, 'transaction.json');
const erc20abi = userhome(USE_HOME, 'erc20abi.json');



if (require('electron-squirrel-startup')) {
  app.quit();
}
var pass = "";
app.on('render-process-gone', (event, details) => {
  console.log("====>" + event);
  console.log("====>" + details);
})

const createWindow = (Start_address, height, width) => {

  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '../img/logo1.png'),
    width: width,
    height: height,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, Start_address));
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  function handleUpdate() {
    const returnData = {
      error: { status: -1, msg: '检测更新查询异常' },
      checking: { status: 0, msg: '正在检查应用程序更新' },
      updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
      updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' },
    };

    //和之前package.json配置的一样
    // autoUpdater.setFeedURL({
    //   rovider: 'github'
    //   , owner: 'jarvis0919'
    //   , repo: 'SharkWallet'
    //   , token: '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'
    //   , private: false
    // });

    //更新错误
    autoUpdater.on('error', function (error) {
      sendUpdateMessage(returnData.error)
    });

    //检查中
    autoUpdater.on('checking-for-update', function () {
      sendUpdateMessage(returnData.checking)
    });

    //发现新版本
    autoUpdater.on('update-available', function (info) {
      sendUpdateMessage(returnData.updateAva)
    });

    //当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      setTimeout(function () {
        sendUpdateMessage(returnData.updateNotAva)
      }, 1000);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      mainWindow.webContents.send('downloadProgress', progressObj)
    });


    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      ipcMain.on('isUpdateNow', (e, arg) => {
        //some code here to handle event
        autoUpdater.quitAndInstall();
      });
      // win.webContents.send('isUpdateNow')
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  }

  handleUpdate();

  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
  }

  ipcMain.on("checkForUpdate", (event, data) => {
    console.log('执行自动更新检查!!!');
    // event.sender.send('reply', 'hi lee my name is yuan, age is 17');
    autoUpdater.checkForUpdates();
  });

};

app.on('second-instance', () => {
  for (i = 1; i < 3; i++) {
    console.log("i====>" + i)
    if (process.platform === 'win32') {
      console.log(BrowserWindow.fromId(i))
      if (BrowserWindow.fromId(i) != null) {
        if (BrowserWindow.fromId(i).isMinimized()) {
          BrowserWindow.fromId(i).restore()
        }
        if (BrowserWindow.fromId(i).isVisible()) {
          BrowserWindow.fromId(i).focus()
        } else {
          BrowserWindow.fromId(i).show()
        }
      }
    }
  }
});

function tostart() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    console.log("启动失败，已有启动项");
    app.focus()
    app.quit();
  } else {
    startup();
  }
}
app.on('ready', () => {

  fs.mkdir(USE_HOME, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } else {
      fs.readFile(eptionmcpath, (err, data) => {
        if (err) {
          fs.writeFile(eptionmcpath, "", err => {
            if (err) {
              console.log(err)
            }
            fs.readFile(hashpath, (err, data) => {
              if (err) {
                fs.writeFile(hashpath, "", err => {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log("eptionmcpath+hashpath")
                    tostart()
                  }
                })
                console.log(err);
              } else {
                tostart();
                console.log("eptionmcpath")
              }
            })
          })
          console.log(err);
        } else {
          fs.readFile(hashpath, (err, data) => {
            if (err) {
              fs.writeFile(hashpath, "", err => {
                if (err) {
                  console.log(err)
                }
                console.log("hashpath")
                tostart();
              })
              console.log(err);
            } else {
              tostart();
              console.log("=====")
            }
          })
        }
      })
      fs.readFile(accountpath, (err, data) => {
        if (err) {
          var person1 = {
            code: 0,
            data: [],
            total: 0,
            import: 0
          }
          var str = JSON.stringify(person1);
          fs.writeFile(accountpath, str, err => {
            if (err) {
              console.log(err)
            }
          })
          console.log(err);
        }
      })
      fs.readFile(netpath, (err, data) => {
        if (err) {
          var person1 = {
            "code": 0,
            "data": [
              {
                "id": "以太坊Ethereum主网络",
                "net": "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "chainid": 1,
                "state": 1
              },
              {
                "id": "Ropsten测试网络",
                "net": "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "chainid": 3,
                "state": 2
              },
              {
                "id": "Rinkeby测试网络",
                "net": "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "chainid": 4,
                "state": 3
              },
              {
                "id": "Goerli测试网络",
                "net": "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "chainid": 5,
                "state": 4
              },
              {
                "id": "Kovan测试网络",
                "net": "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "chainid": 42,
                "state": 5
              },
              {
                "id": "本地链",
                "net": "http://localhost:8545",
                "chainid": "4224",
                "state": 6
              }
            ],
            "total": 6
          }
          var str = JSON.stringify(person1);
          fs.writeFile(netpath, str, err => {
            if (err) {
              console.log(err)
              return false
            }
          })
          console.log(err);
          return false;
        }
      });
      fs.readFile(tokenlistpath, (err, data) => {
        if (err) {
          var person1 = { "code": 0, "total": 0 };
          var str = JSON.stringify(person1);
          fs.writeFile(tokenlistpath, str, err => {
            if (err) {
              console.log(err)
              return false
            }
          })
          console.log(err);
          return false;
        }
      });
      fs.readFile(transactionpath, (err, data) => {
        if (err) {
          var person1 = { code: 0, total: 0, data: [] }
          var str = JSON.stringify(person1);
          fs.writeFile(transactionpath, str, err => {
            if (err) {
              console.log(err)
              return false
            }
          })
          console.log(err);
          return false;
        }
      })
      fs.readFile(transactionpath, (err, data) => {
        if (err) {
          var person1 = { code: 0, total: 0, data: [] }
          var str = JSON.stringify(person1);
          fs.writeFile(transactionpath, str, err => {
            if (err) {
              console.log(err)
              return false
            }
          })
          console.log(err);
          return false;
        }
      })
      console.log('ok!');
    }
  });
});
ipcMain.on('updateApp', (event) => {
  // 刚刚封装的方法
  updater(event)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on('minimize', () => BrowserWindow.fromId(1).minimize())
ipcMain.on('close', () => { BrowserWindow.fromId(1).close(); })
ipcMain.on('minimizeindex', () => BrowserWindow.fromId(2).minimize())
ipcMain.on('tocloseindex', () => BrowserWindow.fromId(2).close())
function startup() {
  fs.readFile(hashpath, 'utf8', (err, files) => {
    if (err) {
      console.log(err)
      Start_address = "../html/register.html"
    }
    console.log('--------------------', files)
    if (files.length != 0) {
      console.log("Login===>");
      var height = 600;
      var width = 400;
      Start_address = "../html/login.html"
      createWindow(Start_address, height, width);
    } else {
      console.log("register===>");
      var height = 600;
      var width = 400;
      Start_address = '../html/register.html'
      createWindow(Start_address, height, width);
    }


  })
}
function addPreZero(num) {
  var t = (num + '').length,
    s = '';
  for (var i = 0; i < 64 - t; i++) {
    s += '0';
  }
  return s + num;
}
function pass1(p) {
  pass = p;
  if ((pass.length / 2) < 17) {
    for (var i = 0; i < (17 - (pass.length / 2)); i++) {
      pass += "0";
    }
  }
}
function encrypt(word) {
  var key = CryptoJS.enc.Utf8.parse(pass);
  console.log(key);
  var plaintText = word; // 明文
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log("加密前：" + plaintText);
  console.log("加密后：" + encryptedData);
  //var str = JSON.stringify(encryptedData);
  console.log("类型" + typeof (encryptedData));
  console.log("=====" + encryptedData.ciphertext.toString());
  return encryptedData.ciphertext.toString();
}
function decrypt(encryptedData) {
  var key = CryptoJS.enc.Utf8.parse(pass);
  console.log(key);
  //encryptedData = encrypted.ciphertext.toString();
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
  console.log("解密后:" + decryptedStr);

  return decryptedStr;
}
const getbalanceass = async (net, address, k) => {
  fs.readFile(tokenlistpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    fs.readFile(erc20abi, function (err, abi) {
      if (err) {
        return console.error(err);
      }
      var contractAbi = abi.toString();
      contractAbi = JSON.parse(contractAbi);
      var contractAddress = person[address][k].address;
      console.log("========address" + person[address][k]);
      console.log("========address" + contractAddress);
      web3 = new Web3(new Web3.providers.HttpProvider(net))
      if (contractAddress == "ETH") {
        web3.eth.getBalance(address, function (error, balance) {
          if (!error) {
            console.log(balance);
            if (balance == "0") {
              console.log("0")
              BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, balance);
            } else {
              BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, balance / Math.pow(10, Number(person[address][k].decimals)));
            }

          } else {
            console.error(error + "查询失败");
            BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, "查询失败")

          }
        })
      } else {
        console.log("symbol" + person[address][k].symbol)
        var myContract = new web3.eth.Contract(contractAbi, contractAddress);
        myContract.methods.balanceOf(address).call({ from: address }, function (error, balance) {
          if (!error) {
            console.log(balance);
            if (balance == null) {
              console.log("0")
              BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, balance);
            } else {
              BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, balance / Math.pow(10, Number(person[address][k].decimals)));
            }

          } else {
            console.log(error + "查询失败");
            BrowserWindow.fromId(2).webContents.send("balance", person[address][k].symbol, "查询失败")

          }
        });
      }

    })
  });
}
const trackTransaction = async (hash, id) => {
  var i = 0;
  var ref = setInterval(function () {
    web3.eth.getTransaction(hash, function (err, obj) {
      if (err) {
        return console.error(err);
      }
      if (obj.transactionIndex != null) {
        fs.readFile(transactionpath, function (err, data) {
          if (err) {
            return console.error(err);
          }
          var person = data.toString();//将二进制的数据转换为字符串
          person = JSON.parse(person);
          person.data[id - 1].transactionIndex = obj.transactionIndex;
          person.data[id - 1].transactionstoptime = Math.round(new Date() / 1000);
          var str = JSON.stringify(person);
          fs.writeFile(transactionpath, str, function (err) {
            if (err) {
              console.error(err);
            }
            BrowserWindow.fromId(2).webContents.send("trackTransaction", 0, id);
            console.log('交易已被确认');
            clearInterval(ref);
          })
        })
      } else {
        i = i + 1;
        if (i > 10) {
          BrowserWindow.fromId(2).webContents.send("trackTransaction", 1, id);
        }
      }
    })
  }, 5000);
}
const getTransaction = async (hash, net) => {
  web3 = new Web3(new Web3.providers.HttpProvider(net))
  web3.eth.getTransaction(hash, function (err, obj) {
    if (err) {
      return console.error(err);
    }
    if (obj.input == "0x") {
      //transactionIndex value gasPrice gas from to hash
      console.log(" ETH交易");
      console.log(obj.transactionIndex);
      fs.readFile(transactionpath, function (err, data) {
        if (err) {
          return console.error(err);
        }
        var person = data.toString();//将二进制的数据转换为字符串
        person = JSON.parse(person);
        var transactionobj = {
          id: person.total + 1,
          hash: hash,
          from: obj.from.toLocaleLowerCase(),
          to: obj.to.toLocaleLowerCase(),
          contract: "0",
          net: net,
          nonce: obj.nonce,
          value: obj.value,
          gas: obj.gas,
          gasPrice: obj.gasPrice,
          transactionIndex: obj.transactionIndex,
          transactionstarttime: Math.round(new Date() / 1000),
          transactionstoptime: 0
        }
        trackTransaction(hash, person.total + 1);
        person.total = person.total + 1;
        person.data.push(transactionobj);
        var str = JSON.stringify(person);
        fs.writeFile(transactionpath, str, function (err) {
          if (err) {
            console.error(err);
          }
          BrowserWindow.fromId(2).webContents.send("writetransa");
          console.log('----------新增成功-------------');
        })
      })
    } else {
      console.log(" 代币交易交易");
      console.log(obj.transactionIndex);
      fs.readFile(transactionpath, function (err, data) {
        if (err) {
          return console.error(err);
        }
        var person = data.toString();//将二进制的数据转换为字符串
        person = JSON.parse(person);
        var input = obj.input;
        var to = '0x' + input.substring(34, 74);
        var value16 = input.substring(74, 138);
        var value = parseInt(value16, 16)
        var transactionobj = {
          id: person.total + 1,
          hash: hash,
          from: obj.from.toLocaleLowerCase(),
          to: to.toLocaleLowerCase(),
          contract: obj.to,
          net: net,
          nonce: obj.nonce,
          value: value,
          gas: obj.gas,
          gasPrice: obj.gasPrice,
          transactionIndex: obj.transactionIndex,
          transactionstarttime: Math.round(new Date() / 1000),
          transactionstoptime: 0
        }
        trackTransaction(hash, person.total + 1);
        person.total = person.total + 1;
        person.data.push(transactionobj);
        var str = JSON.stringify(person);
        fs.writeFile(transactionpath, str, function (err) {
          if (err) {
            console.error(err);
          }
          BrowserWindow.fromId(2).webContents.send("writetransa");
          console.log('----------新增成功-------------');
        })
      })
    }
  })
}
const createaccounts = async (arg, nub) => {
  console.log(arg + "===========" + nub)
  var word = bip39.entropyToMnemonic(arg);
  console.log(word);
  let seed = await bip39.mnemonicToSeed(word);
  console.log("seed：" + util.bufferToHex(seed));
  let hdWallet = hdkey.fromMasterSeed(seed)

  fs.readFile(accountpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();//将二进制的数据转换为字符串
    person = JSON.parse(person);
    console.log(pass);
    for (i = 0; i < nub; i++) {
      //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
      let key = hdWallet.derivePath("m/44'/60'/0'/0/" + person.total)
      //5.从keypair中获取私钥
      console.log("私钥：" + util.bufferToHex(key._hdkey._privateKey))
      //6.从keypair中获取公钥
      console.log("公钥：" + util.bufferToHex(key._hdkey._publicKey))
      //7.使用keypair中的公钥生成地址
      let address = util.pubToAddress(key._hdkey._publicKey, true)
      //编码地址
      console.log(address.toString());
      console.log('account', i + 1, '0x' + address.toString('hex'))
      var private = util.bufferToHex(key._hdkey._privateKey);
      var res = private.substr(2);
      console.log(util.bufferToHex(key._hdkey._privateKey))
      console.log(res);
      let Encryptedprivate = encrypt(res);
      console.log(Encryptedprivate);
      var account = {
        id: "Account" + (person.total + 1),
        address: ('0x' + address.toString('hex')),
        Publickey: util.bufferToHex(key._hdkey._publicKey),
        Encryptedprivate: Encryptedprivate,
        type: "create"
      };
      person.data.push(account);
      person.total = person.total + 1;
      addtokenlist('0x' + address.toString('hex'));
    }
    var str = JSON.stringify(person);
    fs.writeFile(accountpath, str, function (err) {
      if (err) {
        console.error(err);
      }

      console.log('----------新增成功-------------');
    })
  })
}
const importAccount = async (Pkey, Account) => {
  fs.readFile(accountpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    var findaccount = false;
    for (k = 0; k < person.data.length; k++) {
      if (person.data[k].address == Account) {
        findaccount = true;
      }
    }
    if (!findaccount) {
      let Encryptedprivate = encrypt(Pkey.substr(2));
      var account = {
        id: ("import" + person.import),
        address: Account.toLocaleLowerCase(),
        Publickey: "",
        Encryptedprivate: Encryptedprivate,
        type: "import"
      };
      person.data.push(account);
      person.import = person.import + 1;
      var str = JSON.stringify(person);
      fs.writeFile(accountpath, str, function (err) {
        if (err) {
          console.error(err);
        }
        addtokenlist(Account.toLocaleLowerCase());
        console.log('----------新增成功-------------');
        BrowserWindow.fromId(2).webContents.send("import", "添加成功" + Account);
      })
    } else {
      BrowserWindow.fromId(2).webContents.send("import", " 列表里已有该账户，请勿重复添加");
    }
  })
}
const addtokenlist = async (account) => {
  fs.readFile(tokenlistpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var token = {
      symbol: "ETH",
      address: "ETH",
      net: 0,
      Company: "ETH",
      decimals: "18"

    };
    var person = data.toString();//将二进制的数据转换为字符串
    person = JSON.parse(person);
    person[account] = [token];
    var str = JSON.stringify(person);
    fs.writeFile(tokenlistpath, str, function (err) {
      if (err) {
        console.error(err);
      }
    })
  })
}
const addToken = async (tokenaddress, address, net) => {
  fs.readFile(tokenlistpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var json1 = true;
    var person = data.toString();//将二进制的数据转换为字符串
    person = JSON.parse(person);
    for (k = 1; k < person[address].length; k++) {
      if (tokenaddress == person[address][k].address && net == person[address][k].net) {
        BrowserWindow.fromId(2).webContents.send("addtokenstate", "重复！代币已经添加");
        json1 = false;
      }
    }
    if (json1) {
      fs.readFile(erc20abi, function (err, abi) {
        if (err) {
          return console.error(err);
        }

        var contractAbi = abi.toString();
        contractAbi = JSON.parse(contractAbi);
        console.log("=======>" + net)
        web3 = new Web3(new Web3.providers.HttpProvider(net))
        console.log("=======>" + tokenaddress)
        console.log(contractAbi)

        var contract = new web3.eth.Contract(contractAbi, tokenaddress.toString());
        contract.methods.name().call(function (error, name) {
          if (error) {
            console.error(error);
            BrowserWindow.fromId(2).webContents.send("addtokenstate", "无法找到该代币", null);
          }
          contract.methods.symbol().call(function (error, symbol) {
            if (error) {
              console.error(error);
            }
            contract.methods.decimals().call(function (error, decimals) {
              if (error) {
                console.error(error);
              } else {
                var token = {
                  symbol: name,
                  address: tokenaddress,
                  net: net,
                  Company: symbol,
                  decimals: decimals
                };
                person[address].push(token);
                person.total = person.total + 1;
                var str = JSON.stringify(person);
                fs.writeFile(tokenlistpath, str, function (err) {
                  if (err) {
                    console.error(err);
                  }
                  BrowserWindow.fromId(2).webContents.send("addtokenstate", "添加成功", name);
                })

              }
            })
          })
        })
      })
    }
  })
}
ipcMain.on('getMnemonic', (event, arg) => {
  event.reply('getMnemonic', "注册");
  console.log(arg);
  let mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
  var encrytMnemonic = bip39.mnemonicToEntropy(mnemonic)
  console.log(encrytMnemonic);
  fs.writeFile(eptionmcpath, encrytMnemonic, function (err) {
    if (err) {
      console.error(err);
    }
    console.log('----------成功-------------');
  });
  let finalpsd = arg + encrytMnemonic;
  console.log(finalpsd);
  var hash = crypto.createHash('SHA256').update(finalpsd).digest('hex');
  fs.writeFile(hashpath, hash, err => {
    if (err) {
      console.log(err)
      return false
    }
    console.log('写入成功');
    pass1(arg);
    console.log(hash);
    event.sender.send("Mnemonic", mnemonic);
  })

})
ipcMain.on('togo', (event, url) => {
  var no = '../html/login.html';
  if (url == no) {
    setTimeout(() => {
      app.relaunch();
      app.quit();
    }, 1000);
  } else {
    BrowserWindow.fromId(1).close();
    createWindow('../html/assets.html', 600, 900);
  }
})
ipcMain.on('login', (event, arg) => {
  event.reply('login', "登入")
  console.log(arg)
  fs.readFile(eptionmcpath, (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log(data.toString());
    var finalpsd = arg + data.toString();
    console.log(finalpsd);
    fs.readFile(hashpath, (err, data1) => {
      if (err) {
        console.log(err);
        return false;
      }
      var hash = crypto.createHash('SHA256').update(finalpsd).digest('hex');
      console.log(hash);
      console.log(data1.toString());
      if (hash == data1.toString()) {
        pass1(arg);
        event.sender.send("tologin", 0)
      } else {
        event.sender.send("tologin", 1)
      }
    })
  })
})
ipcMain.on('createaccount', (event, nub) => {
  event.reply('createaccount', "创建账户")
  console.log("接收到了傻逼")
  fs.readFile(eptionmcpath, (err, data) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("草泥马的比")
      createaccounts(data.toString(), nub);
      //event.sender.send("fuck", data.toString());
      // event.sender.send("fuck", eptionmc)
    }
  })
})
ipcMain.on('importaccount', (event, state, decryptfile, pass) => {
  event.reply('importaccount', "导入账户")
  console.log(state);
  console.log(decryptfile);
  web3 = new Web3(new Web3.providers.HttpProvider());
  if (state == 0) {
    try {
      var account = web3.eth.accounts.privateKeyToAccount('0x' + decryptfile);
      importAccount(account.privateKey, account.address);
    } catch (error) {
      event.sender.send("import", "检查密钥是否正确");
    }
  } else if (state == 1) {
    fs.readFile(decryptfile, function (err, data) {
      if (err) {
        event.sender.send("import", "读取失败");
        return console.error(err);
      }
      var person = data.toString();
      try {
        var account = web3.eth.accounts.decrypt(person, pass);
        importAccount(account.privateKey, account.address);
      } catch (error) {
        event.sender.send("import", "检查文件以及密码");
      }
    })
  }
})
ipcMain.on('exportaccount', (event, address, password) => {
  if ((password.length / 2) < 17) {
    for (var i = 0; i < (17 - (password.length / 2)); i++) {
      password += "0";
    }
  }
  console.log(password)
  console.log(pass)
  if (password == pass) {
    fs.readFile(accountpath, function (err, data) {
      if (err) {
        event.sender.send("", "读取失败");
        return console.error(err);
      }
      var person = data.toString();
      person = JSON.parse(person);
      for (k = 0; k < person.data.length; k++) {
        if (person.data[k].address == address) {
          var Encryptedprivate = person.data[k].Encryptedprivate;
          var Privatekey = decrypt(Encryptedprivate);
          event.sender.send("Privatekey", Privatekey);
        }
      }
    })
  } else {
    event.sender.send("Privatekey", "密码错误");
  }
})
ipcMain.on('editaccount', (event, address, id) => {
  event.reply('editaccount', "delfile")
  fs.readFile(accountpath, function (err, data) {
    if (err) {
      // event.sender.send("import", "读取失败");
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    for (k = 0; k < person.data.length; k++) {
      if (person.data[k].address == address) {
        person.data[k].id = id;
        var str = JSON.stringify(person);
        fs.writeFile(accountpath, str, (err) => {
          if (err) {
            return err;
          }
          event.sender.send("editaccountstate", "修改成功");

        })
      }
    }
  })


})

ipcMain.on('getbalance', (event, net, address, netid) => {
  event.reply('getblance', "获取余额")
  // console.log(net);
  //console.log(address);
  fs.readFile(tokenlistpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    event.sender.send("balancestart");
    console.log(address);
    for (i = 0; i < person[address].length; i++) {
      console.log("i====" + i)
      console.log("netid===" + netid)
      if (person[address][i].net == netid || person[address][i].net == 0) {
        console.log("symbol" + person[address][i].symbol)
        getbalanceass(net, address, i);
      }
    }
  })
})
ipcMain.on('getGasPrice', (event, net) => {
  event.reply('getGasPrice', "gasprice");
  web3 = new Web3(new Web3.providers.HttpProvider(net))
  web3.eth.getGasPrice().then(function (gasPrice1) {
    // console.log(web3.utils.fromWei(gasPrice1, 'Gwei'))
    var i = Number(web3.utils.fromWei(gasPrice1, 'Gwei'))
    var Low = i + 0.01;
    var Medium = (i + 0.11).toFixed(2);
    var High = Math.ceil(web3.utils.fromWei(gasPrice1, 'Gwei')) + 0.01;
    // console.log("最低" + web3.utils.fromWei(gasPrice1, 'Gwei'))
    // console.log("中等" + (i + 0.1).toFixed(1))
    // console.log("最高" + Math.ceil(web3.utils.fromWei(gasPrice1, 'Gwei')))
    event.sender.send("GasPrice", Low, Medium, High);
  })
})
ipcMain.on('sendbalance', (event, net, address, address1, value1, sendGaslimit, Maxfee, token) => {
  event.reply('sendbalance', "转账")

  web3 = new Web3(new Web3.providers.HttpProvider(net))
  var sendvalue;
  var date1 = '';
  var toaddress;
  var transferAmount;
  if (token == "ETH") {
    sendvalue = value1;
    transferAmount = web3.utils.toHex(web3.utils.toWei(sendvalue.toString(), 'ether'));
    console.log("transferAmount===>" + transferAmount);
    console.log("hextransferAmount===>" + web3.utils.toHex(transferAmount));
    toaddress = address1;

  } else {
    toaddress = token;
    date1 = '0x' + 'a9059cbb' + addPreZero(address1.substr(2)) + addPreZero(web3.utils.toHex(value1).substr(2));
    transferAmount = '0x00';
  }

  // var gaspricevalue = web3.utils.fromWei(sb, 'ether');
  console.log(net);
  console.log("from====>" + address);
  console.log("to======>" + address1);
  console.log("value===>" + value1);
  console.log("token===>" + token);
  console.log("sendGaslimit=====>" + sendGaslimit)
  // console.log("gaspricevalue===>" + sb);
  web3.eth.getTransactionCount(address, web3.eth.defaultBlock.pending).then(function (nonce) {
    fs.readFile(netpath, function (err, data) {
      if (err) {
        return console.error(err);
      }
      var person = data.toString();//将二进制的数据转换为字符串
      person = JSON.parse(person);
      console.log(pass);
      for (k = 0; k < person.data.length; k++) {
        if (person.data[k].net == net) {
          var txData = {
            // nonce每次++，以免覆盖之前pending中的交易
            chainId: web3.utils.toHex(person.data[k].chainid),
            nonce: web3.utils.toHex(nonce++),
            // 设置gasLimit和gasPrice
            gasLimit: web3.utils.toHex(sendGaslimit),
            gasPrice: web3.utils.toHex(web3.utils.toWei(Maxfee.toString(), 'Gwei')),
            // 要转账的哪个账号  
            to: toaddress,
            // 从哪个账号转
            from: address,
            // 0.001 以太币
            value: transferAmount,

            data: date1
          }
          //console.log(web3.utils.toHex(10e17));
          var tx = new Tx(txData);
          fs.readFile(accountpath, function (err, data1) {
            if (err) {
              return console.error(err);
            }
            var person1 = data1.toString();//将二进制的数据转换为字符串
            person1 = JSON.parse(person1);
            console.log(pass);
            for (k = 0; k < person1.data.length; k++) {
              if (person1.data[k].address == address) {
                console.log(k)
                let o = decrypt(person1.data[k].Encryptedprivate);

                const privateKey = new Buffer.from(o.toString(), 'hex');
                tx.sign(privateKey);
                var serializedTx = tx.serialize().toString('hex');
                console.log("私钥=============》" + o.toString());
                web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
                  if (!err) {
                    console.log(hash);
                    getTransaction(hash, net);
                    event.sender.send("transaction", 0, hash);
                  } else {
                    if (err.toString() == "Error: Returned error: already known") {
                      console.log("错误已捕捉");
                    } else {
                      console.error(err);
                      event.sender.send("transaction", 1, err);

                    }

                  }
                });
              }
            }
          })
        }
      }
    })
  })
});
ipcMain.on('opentransaction', (event, id, state) => {
  event.reply('opentransaction', "获取交易信息")
  fs.readFile(transactionpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    var str = person.data[id - 1]
    console.log(person.data[id - 1]);
    event.sender.send("transactionopen", str, state);

  })
})

ipcMain.on('addToken', (event, tokenaddress, address, net) => {
  event.reply('addToken', "添加代币")
  addToken(tokenaddress, address, net);
  //event.sender.send("token", "ok");
})

ipcMain.on('addNet', (event, id, net, chainid) => {
  event.reply('addNet', "添加网络")
  let web3 = new Web3(new Web3.providers.HttpProvider(net));
  web3.eth.getChainId(function (error, result) {
    if (!error) {
      if (chainid == result) {
        fs.readFile(netpath, function (err, data) {
          if (err) {
            return console.error(err);
          }
          var person = data.toString();//将二进制的数据转换为字符串
          person = JSON.parse(person);
          var web = {
            id: id,
            net: net,
            chainid: chainid,
            state: person.total + 1
          };
          var json1 = true;
          for (k = 0; k < person.data.length; k++) {
            if ((person.data[k].id == web.id) || (person.data[k].net == web.net)) {
              json1 = false;
            }
          }
          if (json1) {
            person.data.push(web);//将传来的对象push进数组对象中
            person.total = person.data.length;//定义一下总条数，为以后的分页打基础
            var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
            fs.writeFile(netpath, str, function (err) {
              if (err) {
                console.error(err);
              }
              console.log('----------新增成功-------------');
              event.sender.send("net", "true");
            })
          } else {
            event.sender.send("net", "重复！rpc 网络名称均不可重复");
            console.log("添加失败")
          }
        })
      } else {
        event.sender.send("net", "chain与获取到的不符，应为" + result);
      }
    }
    else {
      event.sender.send("net", "链连接失败，请检查网络");
    }
  });
})

ipcMain.on('editnet', (event, id, net, chainid, netstate) => {
  event.reply('editnet', "修改网络")
  let web3 = new Web3(new Web3.providers.HttpProvider(net));
  fs.readFile(netpath, function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString();
    person = JSON.parse(person);
    for (k = 0; k < person.data.length; k++) {
      if (person.data[k].state == netstate) {
        person.data[k].id = id;
        person.data[k].chainid = chainid;
        person.data[k].net = net;
        var json1 = true;
        web3.eth.getChainId(function (error, result) {
          if (!error) {
            if (chainid == result) {
              for (i = 0; i < (person.data.length - 1); i++) {
                console.log(person.data[i].id + person.data[i].state + person.data[i].net)
                if ((person.data[i].id == id) && (person.data[i].state != netstate)) {
                  json1 = false;
                  event.sender.send("net", "重复！");
                } else if ((person.data[i].net == net) && (person.data[i].state != netstate)) {
                  json1 = false;
                  event.sender.send("net", "重复！");
                }
              }
              if (json1) {
                var str = JSON.stringify(person);
                fs.writeFile(netpath, str, function (err) {
                  if (err) {
                    console.error(err);
                  }
                  console.log('----------新增成功-------------');
                  event.sender.send("net", "true");
                })
              }
            } else {
              event.sender.send("net", "chain与获取到的不符，应为" + result);
            }

          } else {
            event.sender.send("net", "链连接失败，请检查网络");
          }
        })
      }
    }
  })
})

ipcMain.on('delfile', (event) => {
  event.reply('delfile', "delfile")
  fs.writeFile(hashpath, "", (err) => {
    if (err) {
      return err;
    }
    console.log('文件:' + hashpath + '删除成功！');
  })
  fs.writeFile(eptionmcpath, "", (err) => {
    if (err) {
      return err;
    }
    console.log('文件:' + eptionmcpath + '删除成功！');
  })
})
ipcMain.on('toRearrange', (event, password, newpassword) => {
  event.reply('toRearrange', "toRearrange")
  if ((password.length / 2) < 17) {
    for (var i = 0; i < (17 - (password.length / 2)); i++) {
      password += "0";
    }
  }
  console.log(password)
  console.log(pass)
  if (password == pass) {
    fs.readFile(eptionmcpath, (err, data) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log(data.toString());
      encrytMnemonic = data.toString();
      let finalpsd = newpassword + encrytMnemonic;
      console.log(finalpsd);
      var hash = crypto.createHash('SHA256').update(finalpsd).digest('hex');
      fs.writeFile(hashpath, hash, err => {
        if (err) {
          console.log(err)
          return false
        }
        fs.readFile(accountpath, (err, account) => {
          if (err) {
            console.log(err);
            return false;
          }
          var person1 = account.toString();//将二进制的数据转换为字符串
          person1 = JSON.parse(person1);
          person1.data = [];
          person1.import = 0;
          person1.total = 0;
          var str = JSON.stringify(person1);
          fs.writeFile(accountpath, str, (err) => {
            if (err) {
              return err;
            }
            console.log('account清空');
            fs.readFile(transactionpath, (err, transaction) => {
              if (err) {
                console.log(err);
                return false;
              }
              var person1 = transaction.toString();//将二进制的数据转换为字符串
              person1 = JSON.parse(person1);
              person1.data = [];
              person1.total = 0;
              var str = JSON.stringify(person1);
              fs.writeFile(transactionpath, str, (err) => {
                if (err) {
                  return err;
                }
                console.log('account清空');
                fs.readFile(tokenlistpath, (err, tokenlist) => {
                  if (err) {
                    console.log(err);
                    return false;
                  }
                  var person1 = tokenlist.toString();//将二进制的数据转换为字符串
                  person1 = JSON.parse(person1);
                  person1 = {
                    code: 0,
                    total: 0,
                  }
                  var str = JSON.stringify(person1);
                  fs.writeFile(tokenlistpath, str, (err) => {
                    if (err) {
                      return err;
                    }
                    fs.readFile(eptionmcpath, (err, data) => {
                      if (err) {
                        console.log(err);
                        return false;
                      } else {
                        createaccounts(data.toString(), 1);
                        setTimeout(() => {
                          app.relaunch();
                          app.quit();
                        }, 5000);
                      }
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  } else {
    event.sender.send("toRearrangeerr")
  }
})
ipcMain.on('toinitialization', (event, password) => {
  event.reply('toinitialization', "toinitialization")
  if ((password.length / 2) < 17) {
    for (var i = 0; i < (17 - (password.length / 2)); i++) {
      password += "0";
    }
  }
  console.log(password)
  console.log(pass)
  if (password == pass) {
    fs.writeFile(hashpath, "", (err) => {
      if (err) {
        return err;
      }
      console.log('文件:' + hashpath + '删除成功！');
    })
    fs.writeFile(eptionmcpath, "", (err) => {
      if (err) {
        return err;
      }
      console.log('文件:' + eptionmcpath + '删除成功！');
    })
    fs.readFile(accountpath, (err, account) => {
      if (err) {
        console.log(err);
        return false;
      }
      var person1 = account.toString();//将二进制的数据转换为字符串
      person1 = JSON.parse(person1);
      person1.data = [];
      person1.import = 0;
      person1.total = 0;
      var str = JSON.stringify(person1);
      fs.writeFile(accountpath, str, (err) => {
        if (err) {
          return err;
        }
        console.log('account清空');
        fs.readFile(transactionpath, (err, transaction) => {
          if (err) {
            console.log(err);
            return false;
          }
          var person1 = transaction.toString();//将二进制的数据转换为字符串
          person1 = JSON.parse(person1);
          person1.data = [];
          person1.total = 0;
          var str = JSON.stringify(person1);
          fs.writeFile(transactionpath, str, (err) => {
            if (err) {
              return err;
            }
            console.log('account清空');
            fs.readFile(tokenlistpath, (err, tokenlist) => {
              if (err) {
                console.log(err);
                return false;
              }
              var person1 = tokenlist.toString();//将二进制的数据转换为字符串
              person1 = JSON.parse(person1);
              person1 = {
                code: 0,
                total: 0,
              }
              var str = JSON.stringify(person1);
              fs.writeFile(tokenlistpath, str, (err) => {
                if (err) {
                  return err;
                }
                fs.readFile(eptionmcpath, (err, data) => {
                  if (err) {
                    console.log(err);
                    return false;
                  } else {
                    setTimeout(() => {
                      app.relaunch();
                      app.quit();
                    }, 5000);
                  }
                })
              })
            })
          })
        })
      })
    })
  } else {
    event.sender.send("toinitializationerr")
  }
})
ipcMain.on('tomnemonics', (event, password) => {
  event.reply('tomnemonics', "tomnemonics")
  if ((password.length / 2) < 17) {
    for (var i = 0; i < (17 - (password.length / 2)); i++) {
      password += "0";
    }
  }
  console.log(password)
  console.log(pass)
  if (password == pass) {
    fs.readFile(eptionmcpath, (err, data) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log(data.toString());
      encrytMnemonic = data.toString();
      var word = bip39.entropyToMnemonic(encrytMnemonic);
      console.log(word);
      event.sender.send("tomnemonics", word)
    })
  } else {
    event.sender.send("tomnemonicserr")
  }
})

ipcMain.on('exportmnemonics', (event, pass, mnemonics) => {
  event.reply('exportmnemonics', "导入助记词");
  // console.log(arg);
  var encrytMnemonic = bip39.mnemonicToEntropy(mnemonics)
  console.log(encrytMnemonic);
  fs.writeFile(eptionmcpath, encrytMnemonic, function (err) {
    if (err) {
      console.error(err);
    }
    console.log('----------成功-------------');
    let finalpsd = pass + encrytMnemonic;
    console.log(finalpsd);
    var hash = crypto.createHash('SHA256').update(finalpsd).digest('hex');
    fs.writeFile(hashpath, hash, err => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('写入成功');
      pass1(pass);
      console.log(hash);
      fs.readFile(accountpath, (err, account) => {
        if (err) {
          console.log(err);
          return false;
        }
        var person1 = account.toString();//将二进制的数据转换为字符串
        person1 = JSON.parse(person1);
        person1.data = [];
        person1.import = 0;
        person1.total = 0;
        var str = JSON.stringify(person1);
        fs.writeFile(accountpath, str, (err) => {
          if (err) {
            return err;
          }
          fs.readFile(transactionpath, (err, transaction) => {
            if (err) {
              console.log(err);
              return false;
            }
            var person1 = transaction.toString();//将二进制的数据转换为字符串
            person1 = JSON.parse(person1);
            person1.data = [];
            person1.total = 0;
            var str = JSON.stringify(person1);
            fs.writeFile(transactionpath, str, (err) => {
              if (err) {
                return err;
              }
              console.log('account清空');
              fs.readFile(tokenlistpath, (err, tokenlist) => {
                if (err) {
                  console.log(err);
                  return false;
                }
                var person1 = tokenlist.toString();//将二进制的数据转换为字符串
                person1 = JSON.parse(person1);
                person1 = {
                  code: 0,
                  total: 0,
                }
                var str = JSON.stringify(person1);
                fs.writeFile(tokenlistpath, str, (err) => {
                  if (err) {
                    return err;
                  }
                  event.sender.send("mnemonicsok");
                })
              })
            })
          })
        })
      })
    })
  });
  event.sender.send("exportmnemonicserr")
})