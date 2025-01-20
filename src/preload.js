import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('api', {
    getAll: async () => {
        return await ipcRenderer.invoke('getTopics');
    },
    createTopic: async (topic, parentId) => {
        return await ipcRenderer.invoke('createTopic', topic, parentId);
    },
    createResource: async (topicID, resource) => {
        return await ipcRenderer.invoke('createResource', topicID, resource);
    },
    getResourcesByTopic: async (topic) => {
        return await ipcRenderer.invoke('getResourcesByTopic', topic);
    },
    getResource: async (resourceID) => {
        return await ipcRenderer.invoke('getResource', resourceID);
    },
    updateNotes: async (resourceID, notes) => {
        return await ipcRenderer.invoke('updateNotes', resourceID, notes);
    },
    getNotes: async (resourceID) => {
        return await ipcRenderer.invoke('getNotes', resourceID);
    }
});

