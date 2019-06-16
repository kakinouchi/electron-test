// valuables for serialport
let isDonglePortConnected = false;

const serialPort = require("serialport");
console.log("searching device...\n");

serialPort.list(function(err, ports) {
  if (err) {
    console.log("port error has been occured.");
  }
  ports.forEach(function(port) {
    // Dongle Part
    if (port.productId === "6001") {
      initDonglePort(port);
    }
  });
});

const initDonglePort = port => {
  console.log("Dongle has been detected. Here is port information!\n");
  console.log(port);
  console.log("\n");

  dongleSp = new serialPort(port.comName, {
    baudRate: your-baudRate,
    dataBits: your-dataBits,
    parity: your-parity,
    stopBits: your-stopBits,
    flowControl: true/false 
  });

  // definition of serialport events
  dongleSp.on("open", async function() {
    console.log("dongle port open. Data rate: " + dongleSp.baudRate);
    isDonglePortConnected = true;
  });
  dongleSp.on("data", function(res) {
    let consoleOutputString = "" + res;
    console.log(consoleOutputString);
  });
  dongleSp.on("close", function() {
    console.log("dongle port closed.");
    isDonglePortConnected = false;
  });
  dongleSp.on("error", function(error) {
    console.log("dongle serial port error: " + error);
    isDonglePortConnected = false;
  });
};

// communication with renderer process
const { ipcMain } = require("electron");
// confirmation of connect to sensor
ipcMain.on("confirm-connection", async event => {
  const userMessage = isDonglePortConnected
    ? "ドングルが接続できています"
    : "ドングルが認識できません。\n\nドングルを接続して、再起動してください。";
  event.returnValue = userMessage;
});
