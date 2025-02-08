class ResourceRepository {
    constructor(knex) {
        this.knex = knex;
    }

    createResource = async (resource) => {
        return this.knex('resources')
            .insert({
                title: resource.title,
                url: resource.url,
                topic_id: resource.topic
            });
    }

    getResourcesByTopic = (topic) => {
        return this.knex('resources')
            .where('topic_id', parseInt(topic))
            .whereNull('archived_at')
            .select();
    }

    getArchived = () => {
        return this.knex('resources')
            .whereNotNull('archived_at')
            .select();
    }

    getResource = (resourceId) => {
        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .first();
    }

    updateNotes = async (resourceId, notes) => {
        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .update({notes: notes});
    }

    updateTitle = async (resourceId, title) => {
        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .update({title: title});
    }

    archive = async (resourceId) => {
        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .update({archived_at: this.knex.fn.now()});
    }

    restore = async (resourceId) => {

        const topic = await this.knex('topics')
            .where('id', function () {
                this.select('topic_id').from('resources').where('id', parseInt(resourceId));
            })
            .first();

        if (topic && topic.archived_at) {
            await this.knex('topics')
                .where('id', topic.id)
                .update({archived_at: null});
        }

        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .update({archived_at: null});
    }

    delete = async (resourceId) => {
        return this.knex('resources')
            .where('id', parseInt(resourceId))
            .del();
    }

    getNotes = (resourceId) => {
        return this.knex('resources')
            .select('notes')
            .where('id', parseInt(resourceId))
            .first();
    }
}

export default ResourceRepository;