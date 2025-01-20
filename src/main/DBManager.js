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
    }
};

export const resourceManager = {
    createResource: (topicID, resource) => {
        const stm = db.prepare('INSERT INTO resources (title, url, topic_id) VALUES (?, ?, ?)');
        return stm.run(resource.title, resource.url, topicID)
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

    getNotes: (resourceId) => {
        return db.prepare('SELECT notes FROM resources WHERE id = ?').get(resourceId);
    }
}
