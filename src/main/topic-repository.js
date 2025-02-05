class TopicRepository {
    constructor(queryBuilder) {
        this.queryBuilder = queryBuilder;
    }

    getTopics = () => {
        return this.queryBuilder('topics').select();
    }

    createTopic = async (title) => {
        return this.queryBuilder('topics')
            .insert({title: title.toString()});
    }

    getTopic = async (topicId) => {
        return this.queryBuilder('topics')
            .where('id', parseInt(topicId))
            .first();
    }
}

export default TopicRepository;
