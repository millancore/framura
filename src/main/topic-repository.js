class TopicRepository {
    constructor(knex) {
        this.knex = knex;
    }

    getTopics = () => {
        return this.knex('topics')
            .whereNull('archived_at')
            .select();
    }

    archive = async (topicId) => {
        await this.knex('resources')
            .where('topic_id', parseInt(topicId))
            .update({archived_at: this.knex.fn.now()});

        return this.knex('topics')
            .where('id', parseInt(topicId))
            .update({archived_at: this.knex.fn.now()});
    }

    createTopic = async (title) => {
        return this.knex('topics')
            .insert({title: title.toString()});
    }

    getTopic = async (topicId) => {
        return this.knex('topics')
            .where('id', parseInt(topicId))
            .first();
    }
}

export default TopicRepository;
