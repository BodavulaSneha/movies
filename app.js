const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//api-1
app.get('/movies/', async (request, response) => {
  const getmoviesQuery = `
    SELECT
      movie_name
    FROM
    movie;`
  const moviesArray = await db.all(getmoviesQuery)
  response.send(moviesArray)
})

//api-2
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addmovieQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
        ${directorId},
         '${movieName}',
         '${leadActor}'
      );`

  const dbResponse = await db.run(addmovieQuery)
  const movieId = dbResponse.lastID
  response.send('Movie Successfully Added')
})

//api-3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmovieQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`
  const moviee = await db.get(getmovieQuery)
  response.send(moviee)
})

//api-4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updatemovieQuery = `
    UPDATE
      movie
    SET
      director_id=${directorId},
      movie_name='${movieName}',
      lead_actor='${leadActor}'
    WHERE
      movie_id = ${movieId};`
  await db.run(updatemovieQuery)
  response.send('Movie Details Updated')
})

//api-5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletemovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`
  await db.run(deletemovieQuery)
  response.send('Movie Removed')
})

//api-6
app.get('/directors/', async (request, response) => {
  const getdirectorsQuery = `
    SELECT
      *
    FROM
    director;`
  const directorsArray = await db.all(getdirectorsQuery)
  response.send(directorsArray)
})

//api-7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getmovieQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id = ${directorId};`
  const moviees = await db.all(getmovieQuery)
  response.send(moviees)
})

module.exports = app
