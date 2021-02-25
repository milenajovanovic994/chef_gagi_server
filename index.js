import express from 'express'
import cors from 'cors'
// import CryptoJS from 'crypto-js'
// import md5 from 'crypto-js/md5.js'

const app = express()

import bcrypt from 'bcrypt'
// const bcrypt = require('bcrypt')
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

const isUser = (arr, username, email) => {
    if (arr.find(user => user.username === username || user.email === email)) {
        return true
    }
}

const RECIPES = '/recipes'

const USERS = '/users'

const LOGIN = '/login'

let recipes = [
    {
        id: 1,
        recipe: 'nesto1',
        author: 'Chef Gagi',
        title: 'ime1',
        ingredients: ['jabuka','narandza','kruska','sljiva','secer'],
        dishType: 'Sweets'
    },
    {
        id: 2,
        recipe: 'nesto2',
        author: 'Chef Gagi',
        title: 'ime2',
        ingredients: ['krompir','paradajz','sargarepa','ulje','so'],
        dishType: 'Baked goods'
    },
    {
        id: 3,
        recipe: 'nesto3',
        author: 'Chef Gagi',
        title: 'ime3',
        ingredients: ['avokado','brasno','voda'],
        dishType: 'Fruit dish'
    },
    {
        id: 4,
        recipe: 'nesto4',
        author: 'Chef Gagi',
        title: 'ime4',
        ingredients: ['cokolada','mleko','secer','gustin'],
        dishType: 'Sweets'
    },
    {
        id: 5,
        recipe: 'nesto5',
        author: 'Chef Gagi',
        title: 'ime5',
        ingredients: ['jabuka','narandza','sljiva','secer'],
        dishType: 'Sweets'
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



app.post(USERS, async (req, res) => {


    if(isUser(users, req.body.username, req.body.email)){
        res.status(400).json({ error: 'User already exists with this username or email.' })
        return
    }
    else{
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const newUser = req.body

            newUser.password = hashedPassword

            const id = users.length > 0 ?
                Math.max(...users.map(user => user.id)) + 1
                : 1
            newUser.id = id

            users.push(newUser)
            res.status(201).json(newUser)
        } catch {
            res.status(500).send()
        }
    }

    // if (!isUser(users, req.body.username, req.body.email)) {

    //     // req.body.password = CryptoJS.MD5(req.body.password).toString()

    //     try {
    //         const hashedPassword = await bcrypt.hash(req.body.password, 10)

    //         const newUser = req.body

    //         newUser.password = hashedPassword

    //         const id = users.length > 0 ?
    //             Math.max(...users.map(user => user.id)) + 1
    //             : 1
    //         newUser.id = id

    //         users.push(newUser)
    //         res.status(201).json(newUser)
    //     } catch {
    //         res.status(500).send()
    //     }
    // }
    // else {
    //     res.status(400).json({ error: 'User already exists with this username or email.' })
    //     return
    // }

})

app.post(`${USERS}${LOGIN}`, async (req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
            return

            // res.status(404).send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }

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