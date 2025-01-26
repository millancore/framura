const Database = require('better-sqlite3');

const db = new Database('duonote.db');

db.exec(`
CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    parent_id INTEGER NULL,
    FOREIGN KEY (parent_id) REFERENCES topics (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    notes TEXT DEFAULT '',
    topic_id INTEGER NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
  );
`);

export const topicManager = {
    getTopics: () => {
        return db.prepare('SELECT * FROM topics').all();
    },

    createTopic: (title, parentId) => {
        return db.prepare('INSERT INTO topics (title, parent_id) VALUES (?, ?)').run(title, parentId);
    },
    getTopic: (topicId) => {
        return db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId);
    }
};

export const resourceManager = {
    createResource: (resource) => {
        const stm = db.prepare('INSERT INTO resources (topic_id, title, url) VALUES (?, ?, ?)');
        return stm.run(resource.topicId, resource.title, resource.url);
    },

    getResourcesByTopic: (topic) => {
        return db.prepare('SELECT * FROM resources WHERE topic_id = ?').all(topic);
    },

    getResource: (resourceId) => {
        return db.prepare('SELECT * FROM resources WHERE id = ?').get(resourceId);
    },
    
    updateNotes: (resourceId, notes) => {
        const stm = db.prepare('UPDATE resources SET notes = ? WHERE id = ?');
        return stm.run(notes, resourceId);
    },
    
    updateTitle: (resourceId, title) => {
        const stm = db.prepare('UPDATE resources SET title = ? WHERE id = ?');
        return stm.run(title, resourceId);
    },

    getNotes: (resourceId) => {
        return db.prepare('SELECT notes FROM resources WHERE id = ?').get(resourceId);
    }
}

const endpoints = [];

function register(endpoint, handler) {
    endpoints.push({
        name: endpoint,
        handler: handler
    });
}

register('topic.all', topicManager.getTopics);
register('topic.create', topicManager.createTopic);
register('topic.get', topicManager.getTopic);

register('resource.by.topic', resourceManager.getResourcesByTopic);
register('resource.get', resourceManager.getResource);
register('resource.notes', resourceManager.getNotes);
register('resource.notes.update', (params) => {
    resourceManager.updateNotes(...params);
});

register('resource.title.update', (params) => {
    resourceManager.updateTitle(...params);
});

register('resource.create', (params) => {
   return resourceManager.createResource(...params)
});

register('resource.delete', (params) => {
   return db.prepare('DELETE FROM resources WHERE id = ?').run(params);
});


const dbManager = {
    query: (endpoint, params) => {
        let handler = endpoints.find(e => e.name === endpoint).handler;

        return handler(...params);
    }
}

export default dbManager;

