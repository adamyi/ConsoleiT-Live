const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const ipc = require('electron').ipcMain;

var timer1 = 0;
var timer2 = 0;
var countStart1 = false;
var countStart2 = false;

function countdown()
{
  if (timer1 > 0 && timer2 > 0)
  {
    if (countStart1)
    {
      timer1--;
      winPresent.webContents.send('timer1Update', timer1);
      winControl.webContents.send('timer1Update', timer1);
    }
    if (countStart2)
    {
      timer2--;
      winPresent.webContents.send('timer2Update', timer2);
      winControl.webContents.send('timer2Update', timer2);
    }
  }
  setTimeout(countdown,1000);
}
countdown();

ipc.on('setText', function (event, arg) {
  winPresent.webContents.send('setText', arg);
})
ipc.on('setT1', function (event, arg) {
  winPresent.webContents.send('setT1', arg);
})
ipc.on('setT2', function (event, arg) {
  winPresent.webContents.send('setT2', arg);
})
ipc.on('setT3', function (event, arg) {
  winPresent.webContents.send('setT3', arg);
})
ipc.on('setT4', function (event, arg) {
  winPresent.webContents.send('setT4', arg);
})
ipc.on('setConference', function (event, arg) {
  winPresent.webContents.send('setConference', arg);
})
ipc.on('setCommittee', function (event, arg) {
  winPresent.webContents.send('setCommittee', arg);
})
ipc.on('showOverlay', function (event, arg) {
  winPresent.webContents.send('showOverlay', arg);
})
ipc.on('setOverlay', function (event, arg) {
  winPresent.webContents.send('setOverlay', arg);
})
ipc.on('countSS1', function (event, arg) {
  countStart1 = arg;
})
ipc.on('countSS2', function (event, arg) {
  countStart2 = arg;
})
ipc.on('setTimer1', function (event, arg) {
  timer1 = arg;
  winPresent.webContents.send('timer1Update', timer1);
  winControl.webContents.send('timer1Update', timer1);
})
ipc.on('setTimer2', function (event, arg) {
  timer2 = arg;
  winPresent.webContents.send('timer2Update', timer2);
  winControl.webContents.send('timer2Update', timer2);
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let winControl;
let winPresent;

function createWindowControl() {
  // Create the browser window.
  winControl = new BrowserWindow({width: 800, height: 600});

  // and load the controlling html.
  winControl.loadURL(`file://${__dirname}/control/index.html`);

  // Open the DevTools.
  //winControl.webContents.openDevTools();

  // Set the title.
  winControl.setTitle('Console iT Live Control');

  // Emitted when the window is closed.
  winControl.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winControl = null;
  });
}

function createWindowPresent() {
  // Create the browser window.
  winPresent = new BrowserWindow({width: 800, height: 600});

  // and load the presentation html.
  winPresent.loadURL(`file://${__dirname}/present/index.html`);

  // Open the DevTools.
  //winControl.webContents.openDevTools();

  // Set the title.
  winPresent.setTitle('Console iT Live');

  // Emitted when the window is closed.
  winPresent.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winPresent = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindowControl();
  createWindowPresent();
  winPresent.webContents.on('did-finish-load', () => {
    //winPresent.webContents.send('setText', 'test');
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (winControl === null) {
    createWindowControl();
  }
  if (winPresent === null) {
    createWindowPresent();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
