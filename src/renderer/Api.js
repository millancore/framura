const api = window.api
import db from "./dexie";

export const topicApi = {
        all: () => {
            return db.topics
                .filter(topic => topic.archived_at === null)
                .toArray();
        },
        create: (title) => {
            return db.topics.add({
                id: crypto.randomUUID(),
                title: title,
                created_at: Date.now(),
                archived_at: null
            })
        },
        get: (id) => {
            return db.topics.get(id)
        },
        archive: async (id) => {

            await db.resources
                .filter(resource => resource.topic_id === id)
                .modify(resource => {
                    resource.archived_at = Date.now();
                });

            return db.topics.update(id, {archived_at: Date.now()})
        }
    }
;
export const resourceApi = {
    create: (resource) => {
        return db.resources.add({
            id: crypto.randomUUID(),
            topic_id: resource.topic,
            title: resource.title,
            url: resource.url,
            notes: {},
            created_at: Date.now(),
            updated_at: Date.now(),
            archived_at: null
        });
    },
    delete: (id) => {
        return db.resources.delete(id);
    },

    get: (id) => {
        return db.resources.get(id)
    },

    getArchived: () => {
        return db.resources
            .filter(resource => resource.archived_at !== null)
            .toArray();
    },

    archive: (id) => {
        return db.resources.update(id, {archived_at: Date.now()})
    },

    restore: async (id) => {
        const resource = await db.resources.get(id);

        if (resource) {
            const topic = await db.topics.get(resource.topic_id);
            if (topic.archived_at !== null) {
                await db.topics.update(resource.topic_id, {archived_at: null});
            }

            return db.resources.update(id, {archived_at: null});
        }
    },

    deleted: async (id) => {
        await db.resources.delete(id);
    },

    getByTopic: (topicId) => {
        return db.resources
            .where("topic_id")
            .equals(topicId)
            .filter(resource => resource.archived_at === null)
            .toArray();
    },
    notes: async (id) => {
        const resource = await db.resources.get(id);
        return resource.notes;

    },
    updateNotes: (id, notes) => {
        return db.resources.update(id, {notes: notes})
    },
    update: (id, title) => {
        return db.resources.update(id, {title: title})
    }
}

export const markApi = {
    create: (mark) => {
        return db.marks.add(mark)
    },
    getByResource: (resourceID) => {
        return db.marks
            .where("resource_id")
            .equals(resourceID)
            .sortBy("mark")
    },
    updateTitle: (id, title) => {
        return db.marks.update(id, {title: title})
    },
    delete: (id) => {
        return db.marks.delete(id)
    }
}