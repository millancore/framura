export const topicApi = {
    all: () => {
        return api.request("topic.all")
    },
    create: (title) => {
        return api.request("topic.create", title)
    },
    get: (id) => {
        return api.request("topic.get", id)
    }
}

export const resourceApi = {
    create: (params) => {
      return api.request("resource.create", params)
    },
    delete: async (resourceId) => {
        return await api.request("resource.delete", resourceId)
    },
    get: (resourceId) => {
        return api.request("resource.get", resourceId)
    },
    getByTopic: (topicId) => {
        return api.request("resource.by.topic", topicId)
    },
    notes: (resourceId) => {
        return api.request("resource.notes", resourceId)
    },
    updateNotes: (resourceId, notes) => {
        api.request("resource.notes.update", resourceId, notes)
    },
    update: (resourceId, title) => {
        api.request("resource.title.update", resourceId, title)
    }
}

export const markApi = {
    create: (params) => {
        return api.request("mark.create", params)
    },
    getByResource: (resourceID) => {
        return api.request("mark.by.resource", resourceID)
    },
    updateTitle: (markId, title) => {
        return api.request("mark.title.update", markId, title)
    },
    delete: (markId) => {
        return api.request("mark.delete", markId)
    }
}