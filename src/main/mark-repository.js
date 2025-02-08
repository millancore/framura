class MarkRepository {
    constructor(knex) {
        this.knex = knex;
    }

    create = (mark) => {
        return this.knex('marks')
            .insert({
                resource_id: mark.resource_id,
                mark_type: mark.type,
                title: mark.title,
                mark: mark.mark
            });
    }

    getByResourceId = (resourceId) => {
        return this.knex('marks')
            .where('resource_id', parseInt(resourceId))
            .select();

    }

    updateTitle = (id, title) => {
        return this.knex('marks')
            .where('id', parseInt(id))
            .update({title});

    }

    delete = (id) => {
        return this.knex('marks')
            .where('id', parseInt(id))
            .delete();
    }
}

export default MarkRepository;