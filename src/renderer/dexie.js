import Dexie from 'dexie';

const db = new Dexie('db');

db.version(1).stores({
    topics: `
        id,
        title,
        created_at,
        updated_at,
        archived_at
    `,
    resources: `
        id,
        topic_id,
        title,
        url,
        notes,
        created_at,
        updated_at,
        archived_at
    `,
    marks: `
       id,
       title,
       resource_id,
       mark_type,
       mark,
       created_at,
       updated_at
    `
})


export default db;