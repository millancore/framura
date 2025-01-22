export const topicApi = {
    all: () => {
        return api.request("topic.all")
    }
}

export const resourceApi = {
    delete: (resourceId) => {
        return api.request("resource.delete", resourceId)
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
    }

}