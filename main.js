const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow
let addWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  //Quit all windows when closing main window
  mainWindow.on('closed', () =>{
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

ipcMain.on('item:add', (e, item) => {
 mainWindow.webContents.send('item:add', item);
 addWindow.close()
})


createAddWindow = () =>{
  addWindow = new BrowserWindow({
    width: 350,
    height: 250,
    title: 'Add new ToDo'
  })
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  addWindow.on('close', () => {
    addWindow = null;
  })
}

//Menu
const mainMenuTemplate = [
  {
    label: 'File', submenu: [
      {
        label: 'Add Todo',
        click(){
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear')
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
]

if(process.platform === 'darwin'){
  mainMenuTemplate.unshift({})
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev Tools', submenu: [{
      label: 'Toggle dev tools',
      accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools()
      }
    },
      {
        role: 'reload'
      }]
  })
}