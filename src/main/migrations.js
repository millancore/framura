class Migrations {
    constructor(knex) {
        this.knex = knex;
    }

    up = async () => {

        /* Topics Table */
        let topicsExists = await this.hasTable('topics');

        if (!topicsExists) {
            await this.knex.schema.createTable('topics', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.timestamp('updated_at').defaultTo(this.knex.fn.now());
                table.timestamp('archived_at').nullable();
            });
        }

        /* Resources Table */
        let resourcesExists = await this.hasTable('resources');

        if (!resourcesExists) {
            await this.knex.schema.createTable('resources', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.string('url').notNullable();
                table.text('notes').nullable();
                table.integer('topic_id').unsigned().references('id').inTable('topics').onDelete('CASCADE');
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.timestamp('updated_at').defaultTo(this.knex.fn.now());
                table.timestamp('archived_at').nullable()
            });
        }

        /* Marks Table */
        let marksExists = await this.hasTable('marks');

        if (!marksExists) {
            await this.knex.schema.createTable('marks', (table) => {
                table.increments('id').primary();
                table.integer('resource_id').unsigned().notNullable().references('id').inTable('resources').onDelete('CASCADE');
                table.string('mark_type').notNullable();
                table.string('title').defaultTo('');
                table.string('mark').notNullable();
            });
        }
    }

    down = async () => {

        /* Drop Marks Table */
        let marksExists = await this.hasTable('marks');

        if (marksExists) {
            this.knex.schema.dropTable('marks');
        }

        /* Drop Resources Table */
        let resourcesExists = await this.hasTable('resources');

        if (resourcesExists) {
            this.knex.schema.dropTable('resources');
        }

        /* Drop Topics Table */
        let topicsExists = await this.hasTable('topics');

        if (topicsExists) {
            this.knex.schema.dropTable('topics');
        }
    }

    run = async () => {
        await this.up();
    }


    hasTable = async (tableName) => {
        return this.knex.schema.hasTable(tableName);
    }
}

export default Migrations;