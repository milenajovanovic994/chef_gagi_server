import express from 'express'
import cors from 'cors'
import CryptoJS from 'crypto-js'
// import md5 from 'crypto-js/md5.js'

const app = express()
// const CryptoJS = require("crypto-js")

app.use(express.json())
app.use(cors())

const logger = (req, _, next) => {
    console.log('HTTP request: ', req.method)
    console.log('Route: ', req.path)
    console.log('Request body: ', req.body)
    console.log('-----------')
    next()
}


app.use(logger)

const defaultEndpoint = (_, res) => {
    res.status(404).json({ error: 'Unknown route' })
}

const RECIPES = '/recipes'

const USERS = '/users'

let recipes = [
    {
        id: 1,
        recipe: 'nesto1',
        author: 'Chef Gagi',
        title: 'ime1'
    },
    {
        id: 2,
        recipe: 'nesto2',
        author: 'Chef Gagi',
        title: 'ime2'
    },
    {
        id: 3,
        recipe: 'nesto3',
        author: 'Chef Gagi',
        title: 'ime3'
    },
    {
        id: 4,
        recipe: 'nesto4',
        author: 'Chef Gagi',
        title: 'ime4'
    },
    {
        id: 5,
        recept: 'nesto5',
        author: 'Chef Gagi',
        title: 'ime5'
    }
]

let users = [
    {
        id: 1,
        username: 'Milena',
        password: '12345abcd',
        email: 'nesto@gmail.com'
    },
    {
        id: 2,
        username: 'Pera',
        password: 'abcd12345',
        email: 'nesto2@gmail.com'
    }
]


app.get(RECIPES, (_, res) => {
    res.status(200).json(recipes)
})

app.get(USERS, (_, res) => {
    res.status(200).json(users)
})


app.get(`${RECIPES}/:id`, (req, res) => {
    const id = req.params.id
    const recipe = recipes.find(r => r.id == id)

    if (recipe)
        res.json(recipe)
    else res.status(404).end()
})

app.get(`${USERS}/:id`, (req, res) => {
    const id = req.params.id
    const user = users.find(u => u.id == id)

    if (user)
        res.json(user)
    else res.status(404).end()
})


app.post(RECIPES, (req, res) => {

    const newRecipe = req.body

    if (newRecipe.recipe.trim().length === 0 || newRecipe.author.trim().length === 0 || newRecipe.title.trim().length === 0) {
        res.status(400).json({ error: 'All fields must be filled in.' })
        return
    }

    const id = recipes.length > 0 ?
        Math.max(...recipes.map(recipe => recipe.id)) + 1
        : 1
    newRecipe.id = id

    recipes.push(newRecipe)

    res.status(201).json(newRecipe)
})

app.post(USERS, (req, res) => {

    req.body.password = CryptoJS.MD5(req.body.password).toString()

    // console.log(CryptoJS.MD5(req.body.password).toString())
    const newUser = req.body

    if (newUser.username.trim().length === 0 || newUser.email.trim().length === 0 || newUser.password.trim().length === 0) {
        res.status(400).json({ error: 'All fields must be filled in.' })
        return
    }

    const id = users.length > 0 ?
        Math.max(...users.map(user => user.id)) + 1
        : 1
    newUser.id = id

    users.push(newUser)

    res.status(201).json(newUser)
})


app.delete(`${RECIPES}/:id`, (req, res) => {
    const id = req.params.id
    recipes = recipes.filter(r => r.id != id)

    res.status(204).end()
})

app.delete(`${USERS}/:id`, (req, res) => {
    const id = req.params.id
    users = users.filter(u => u.id != id)

    res.status(204).end()
})

app.use(defaultEndpoint)

const PORT = 3005
app.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT}`)
})