const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  const rows = await db('posts as p')
    .select('p.id as post_id', 'contents', 'username')
    .join('users as u', 'p.user_id', '=', 'u.id')
    .where('u.id', user_id)
  return rows
}

async function find() {
  const rows = await db('posts as p')
    .select('u.id as user_id', 'username')
    .count('p.id as post_count')
    .join('users as u', 'p.user_id', '=', 'u.id')
    .groupBy('u.id', 'username')

  return rows;
}

function findById(id) {
  return db('users').where({ id }).first()
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
