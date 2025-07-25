const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  // Для разработки — открываем Vite dev-сервер
  mainWindow.loadURL('http://localhost:5173');
  // Для production (если собран build):
  // mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  mainWindow.on('close', (event) => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Показать админку', click: () => mainWindow.show() },
    { label: 'Выйти', click: () => { app.quitting = true; app.quit(); } },
  ]);
  tray.setToolTip('ShopBoom Admin');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow.show());
});

app.on('window-all-closed', () => {
  // Не закрываем приложение полностью
}); 