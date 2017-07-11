const electron = require('electron');
const path = require('path');
var ping = require('net-ping');
const url = require('url');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let win;
app.on('ready', () => {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
    	protocol: 'file:',
    	slashes: true
  	}));
	win.on('closed', () => {
		win = null;
	});
});
app.on('window-all-closed', () => {
	app.quit();
});
