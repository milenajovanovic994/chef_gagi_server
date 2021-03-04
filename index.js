import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'

const url =  'mongodb+srv://milenajovanovic994:bHCSTmj8ETYx4yba@cluster0.0hhjj.mongodb.net/chefGagiApp?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const recipeSchema = new mongoose.Schema({
    recipe: String,
    author: String,
    title: String,
    ingredients: Array,
    dishType: String,
    img: String
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
})

const recipeUserSchema = new mongoose.Schema({
    recipe: String,
    author: String,
    title: String,
    ingredients: Array,
    dishType: String,
    img: String
})

const Recipe = mongoose.model('Recipe', recipeSchema)
const User = mongoose.model('User', userSchema)
const RecipeUser = mongoose.model('RecipeUser', recipeUserSchema)

const app = express()

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

const COMMUNITY = '/community'

const USERS = '/users'

const LOGIN = '/login'



app.get(RECIPES, (_, res) => {

    Recipe.find({}).then(result => {
        res.json(result)
    })
})

app.get(COMMUNITY, (_, res) => {

    RecipeUser.find({}).then(result => {
        res.json(result)
    })
})

app.get(USERS, (_, res) => {

    User.find({}).then(result => {
        res.json(result)
    })
})


app.get(`${RECIPES}/:id`, (req, res) => {
    const id = req.params.id

    Recipe.findById(id).then(recipe => {
        if (recipe) res.json(recipe)
        else res.status(404).end()
    })
        .catch(error => {
            console.log(error)
            res.status(500).end()
        })
})

app.get(`${USERS}/:id`, (req, res) => {
    const id = req.params.id

    User.findById(id).then(user => {
        if (user) res.json(user)
        else res.status(404).end()
    })
        .catch(error => {
            console.log(error)
            res.status(500).end()
        })
})


app.post(RECIPES, (req, res) => {

    const recipe = new Recipe({
        recipe: req.body.recipe,
        author: req.body.author,
        title: req.body.title,
        ingredients: req.body.ingredients,
        dishType: req.body.dishType,
        img: req.body.img
    })

    recipe.save().then(result => {
        res.json(result)
    })
})

app.post(COMMUNITY, (req, res) => {


    const recipe = new RecipeUser({
        recipe: req.body.recipe,
        author: req.body.author,
        title: req.body.title,
        ingredients: req.body.ingredients,
        dishType: req.body.dishType,
        img: req.body.img
    })

    recipe.save().then(result => {
        res.json(result)
    })
})



app.post(USERS, (req, res) => {

    User.findOne({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    })
        .then(result => {
            console.log(result)
            if (result) {
                res.status(400).json({ error: 'User already exists with this username or email.' })
                return
            }
            else {

                req.body.password = CryptoJS.MD5(req.body.password).toString()


                const user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                })

                user.save().then(result => {
                    res.json(result)
                })
            }

        }).catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.post(`${USERS}${LOGIN}`, async (req, res) => {

    User.findOne({ username: req.body.username }).then(result => {
        if (result) {
            console.log(result)
            if (CryptoJS.MD5(req.body.password).toString() === result.password) {
                res.send('Success')
            } else {
                res.send('Not Allowed')
                return
            }
        }
        else {
            return res.status(400).send('Cannot find user')
        }
    }).catch(error => {
        console.log(error)
        res.status(500).end()
    })
})

// Plan to adding delete button, when I create Admin

app.delete(`${RECIPES}/:id`, (req, res) => {
    const id = req.params.id
    recipes = recipes.filter(r => r.id != id)

    res.status(204).end()
})

app.delete(`${COMMUNITY}/:id`, (req, res) => {
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
    console.log(`Server runs at: ${PORT}`)
})