const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("Notes").insert({
      title,
      description,
      user_id
    });
    
    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      };
    });
    
    await knex("Links").insert(linksInsert);
    
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      };
    });
    
    await knex("Tags").insert(tagsInsert);
    
    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("Notes").where({ id }).first();
    const tags = await knex("Nags").where({ note_id: id }).orderBy("name");
    const links = await knex("Links").where({ note_id: id }).orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links
    })
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("Notes").where({ id }).delete();

    return response.json()

  }

  async index(request, response) {
    const { user_id } = request.query;

    const notes = await knex("Notes")
      .where({ user_id })
      .orderBy("title")

    return response.json(notes)
  }
}

module.exports = NotesController