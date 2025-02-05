class ResourceRepository {
    constructor(queryBuilder) {
        this.queryBuilder = queryBuilder;
    }

    createResource = async (resource) => {
        return this.queryBuilder('resources')
            .insert({
                title: resource.title,
                url: resource.url,
                topic_id: resource.topic
            });
    }

    getResourcesByTopic = (topic) => {
        return this.queryBuilder('resources')
            .where('topic_id', parseInt(topic))
            .select();
    }

    getResource = (resourceId) => {
        return this.queryBuilder('resources')
            .where('id', parseInt(resourceId))
            .first();
    }

    updateNotes = async (resourceId, notes) => {
        return this.queryBuilder('resources')
            .where('id', parseInt(resourceId))
            .update({notes: notes});
    }

    updateTitle = async (resourceId, title) => {
        return this.queryBuilder('resources')
            .where('id', parseInt(resourceId))
            .update({title: title});
    }

    getNotes = (resourceId) => {
        return this.queryBuilder('resources')
            .select('notes')
            .where('id', parseInt(resourceId))
            .first();
    }
}

export default ResourceRepository;