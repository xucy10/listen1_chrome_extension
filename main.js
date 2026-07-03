const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { initialize } = require('@electron/remote/main');

initialize();

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  const indexPath = `file://${path.join(__dirname, 'listen1.html')}`;
  mainWindow.loadURL(indexPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('openUrl', (event, url) => {
  if (url) {
    shell.openExternal(url);
  }
});

ipcMain.on('control', (event, action) => {
  if (!mainWindow) {
    return;
  }

  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
      break;
    case 'restore':
      mainWindow.restore();
      break;
    case 'close':
      mainWindow.close();
      break;
    default:
      break;
  }
});
