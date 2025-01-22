import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('api', {
    request: async (endpoint, ...params) => {
        return await ipcRenderer.invoke('dbManager', endpoint, params)
    }
})

