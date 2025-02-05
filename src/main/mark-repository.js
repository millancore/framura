class MarkRepository {
    constructor(queryBuilder) {
        this.queryBuilder = queryBuilder;
    }

    create = (mark) => {
        return this.queryBuilder('marks')
            .insert({
                resource_id: mark.resource_id,
                mark_type: mark.type,
                title: mark.title,
                mark: mark.mark
            });
    }

    getByResourceId = (resourceId) => {
        return this.queryBuilder('marks')
            .where('resource_id', parseInt(resourceId))
            .select();

    }

    updateTitle = (id, title) => {
        return this.queryBuilder('marks')
            .where('id', parseInt(id))
            .update({title});

    }

    delete = (id) => {
        return this.queryBuilder('marks')
            .where('id', parseInt(id))
            .delete();
    }
}

export default MarkRepository;