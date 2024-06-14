import { app, BrowserWindow } from 'electron'

app.whenReady().then(async () => {
    const win = new BrowserWindow({
        title: 'EasyMark',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    })

    await win.loadURL("http://localhost:3000")

    win.reload()
})