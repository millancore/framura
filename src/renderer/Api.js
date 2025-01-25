export const topicApi = {
    all: () => {
        return api.request("topic.all")
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