const path = require('path');
const { app } = require('electron')

const dbPath = app.isPackaged
    ? path.join(app.getPath('userData'), 'duenote.db')
    : path.join(process.cwd(), 'duenote.db');

const knex = require('knex')({
    client: 'better-sqlite3',
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true
});

import Migrations from "./migrations";

const migrations = new Migrations(knex);

// Run migrations
migrations.run()

import TopicRepository from "./topic-repository";
import ResourceRepository from "./resource-repository";
import MarkRepository from "./mark-repository";

const topicRepository = new TopicRepository(knex);
const resourceRepository = new ResourceRepository(knex);
const markRepository = new MarkRepository(knex);

const endpoints = [];

function register(endpoint, handler) {
    endpoints.push({
        name: endpoint,
        handler: handler
    });
}

register('topic.all', topicRepository.getTopics);
register('topic.create', topicRepository.createTopic);
register('topic.get', topicRepository.getTopic);
register('topic.archive', topicRepository.archive);

register('resource.by.topic', resourceRepository.getResourcesByTopic);
register('resource.get', resourceRepository.getResource);
register('resource.notes', resourceRepository.getNotes);
register('resource.notes.update', (params) => {
    resourceRepository.updateNotes(...params);
});

register('resource.title.update', (params) => {
    resourceRepository.updateTitle(...params);
});

register('resource.create', (params) => {
    return resourceRepository.createResource(...params)
});

register('resource.get.archived', resourceRepository.getArchived)
register('resource.archive', resourceRepository.archive);
register('resource.restore', resourceRepository.restore);
register('resource.delete', resourceRepository.delete);

/**** Marks ****/
register('mark.create', (params) => {
    return markRepository.create(...params);
});

register('mark.by.resource', (params) => {
    return markRepository.getByResourceId(...params);
});

register('mark.title.update', (params) => {
    return markRepository.updateTitle(...params);
});

register('mark.delete', (params) => {
    return markRepository.delete(...params);
});


const dbManager = {
    query: (endpoint, params) => {
        let handler = endpoints.find(e => e.name === endpoint).handler;

        return handler(...params);
    }
}

export default dbManager;

