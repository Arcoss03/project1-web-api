import Express, { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup';

import { createPersonSchema, updatePersonSchema } from './validation'
import db from './db'

const app = Express()

app.use(Express.json())

// Get all persons
app.get('/persons', async (req, res) => {
  // Load data from db.json into db.data
  await db.read()

  res.json(db.data.persons)
})

// 1. 
// GET /persons/:id
// Get person by id from DB
app.get('/persons/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  // Load data from db.json into db.data
  await db.read()
  const person = db.data.persons.find(person => person.id === id)

  if (!person) {
    res.sendStatus(404)
    return
  }

  res.json(person)
})

const validateSchema = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, {abortEarly: false});
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(error.errors);
      res.status(400).json({message: error.errors})
    }
  }
}

// 2. 
// POST /persons with body { firstName: string, lastName: string }
// Add a new person in DB
app.post('/persons', validateSchema(createPersonSchema), async (req, res) => {
  const person = req.body    
  
  // Load data from db.json into db.data
  await db.read()

  const lastCreatedPerson = db.data.persons[db.data.persons.length - 1]
  const id = lastCreatedPerson ? lastCreatedPerson.id + 1 : 1

  db.data.persons.push({ id, ...person })

  // Save data from db.data to db.json file
  await db.write()

  res.json({ id })
})

// 3.
// PATCH /persons/:id with body { firstName: string, lastName: string }
// Update a person in DB
app.patch('/persons/:id', validateSchema(updatePersonSchema), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const person = req.body

  // Load data from db.json into db.data
  await db.read()

  const personIndex = db.data.persons.findIndex(person => person.id === id)
  if (personIndex === -1) {
    res.sendStatus(404)
    return
  }

  db.data.persons[personIndex] = { ...db.data.persons[personIndex], ...person }

  // Save data from db.data to db.json file
  await db.write()

  res.sendStatus(204)
})

// 4. Qu'est-ce qu'une API REST ?
// En 2-3 slides que faut-il retenir ?
// Quelle association entre les verbes HTTP et les opérations CRUD ?
// Comment nommer les routes ? Singulier ou pluriel ? Majuscule ou minuscule ?
// Comment documenter une API REST ? Un package NPM ? Un site web ? Autre ? Avec Express ?

app.delete('/persons/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await db.read()

  const personIndex = db.data.persons.findIndex(person => person.id === id)
  if (personIndex === -1) {
    res.sendStatus(404)
    return
  }

  db.data.persons.splice(personIndex, 1)
  await db.write()
  res.sendStatus(204)
})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})