import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'

const url = process.env.MONGODB_URI
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

const Recipe = mongoose.model('Recipe', recipeSchema)
const User = mongoose.model('User', userSchema)

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

const isUser = (arr, username, email) => {
    if (arr.find(user => user.username === username || user.email === email)) {
        return true
    }
}

const RECIPES = '/recipes'

const USERS = '/users'

const LOGIN = '/login'

// let recipes = [
//     {
//         id: 1,
//         recipe: 'nesto1',
//         author: 'Chef Gagi',
//         title: 'ime1',
//         ingredients: ['jabuka','narandza','kruska','sljiva','secer'],
//         dishType: 'Sweets',
//         img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997883/samples/food/spices.jpg'
//     },
//     {
//         id: 2,
//         recipe: 'nesto2',
//         author: 'Chef Gagi',
//         title: 'ime2',
//         ingredients: ['krompir','paradajz','sargarepa','ulje','so'],
//         dishType: 'Baked goods',
//         img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997876/samples/food/pot-mussels.jpg'
//     },
//     {
//         id: 3,
//         recipe: 'nesto3',
//         author: 'Chef Gagi',
//         title: 'ime3',
//         ingredients: ['avokado','brasno','voda'],
//         dishType: 'Fruit dish',
//         img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997875/samples/food/fish-vegetables.jpg'
//     },
//     {
//         id: 4,
//         recipe: 'nesto4',
//         author: 'Chef Gagi',
//         title: 'ime4',
//         ingredients: ['cokolada','mleko','secer','gustin'],
//         dishType: 'Sweets',
//         img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997874/samples/food/dessert.jpg'
//     },
//     {
//         id: 5,
//         recipe: 'nesto5',
//         author: 'Chef Gagi',
//         title: 'ime5',
//         ingredients: ['jabuka','narandza','sljiva','secer'],
//         dishType: 'Sweets',
//         img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997870/sample.jpg'
//     }
// ]

// let users = [
//     {
//         id: 1,
//         username: 'Milena',
//         password: '12345abcd',
//         email: 'nesto@gmail.com'
//     },
//     {
//         id: 2,
//         username: 'Pera',
//         password: 'abcd12345',
//         email: 'nesto2@gmail.com'
//     }
// ]


app.get(RECIPES, (_, res) => {

    Recipe.find({}).then(result => {
        res.json(result)
    })

    // res.status(200).json(recipes)
})

app.get(USERS, (_, res) => {

    User.find({}).then(result => {
        res.json(result)
    })

    // res.status(200).json(users)
})


app.get(`${RECIPES}/:id`, (req, res) => {
    const id = req.params.id
    // const recipe = recipes.find(r => r.id == id)

    Recipe.findById(id).then(recipe => {
        if (recipe) res.json(recipe)
        else res.status(404).end()
    })
        .catch(error => {
            console.log(error)
            res.status(500).end()
        })

    // if (recipe)
    //     res.json(recipe)
    // else res.status(404).end()
})

app.get(`${USERS}/:id`, (req, res) => {
    const id = req.params.id
    // const user = users.find(u => u.id == id)

    // if (user)
    //     res.json(user)
    // else res.status(404).end()

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

    // const newRecipe = req.body

    // if (newRecipe.recipe.trim().length === 0 || newRecipe.author.trim().length === 0 || newRecipe.title.trim().length === 0) {
    //     res.status(400).json({ error: 'All fields must be filled in.' })
    //     return
    // }

    // const id = recipes.length > 0 ?
    //     Math.max(...recipes.map(recipe => recipe.id)) + 1
    //     : 1
    // newRecipe.id = id

    // recipes.push(newRecipe)

    // res.status(201).json(newRecipe)

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



app.post(USERS, (req, res) => {


    // if (isUser(users, req.body.username, req.body.email)) {
    //     res.status(400).json({ error: 'User already exists with this username or email.' })
    //     return
    // }
    // else {

    // const hashedPassword = await bcrypt.hash(req.body.password, 10)

    User.findOne({ username: req.body.username }).then(result => {
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



    // try {
    //     const hashedPassword = await bcrypt.hash(req.body.password, 10)

    //     const user = new User({
    //         username: req.body.username,
    //         password: hashedPassword,
    //         email: req.body.email
    //     })

    //     user.save().then(result => {
    //         res.json(result)
    //     })

    // const newUser = req.body

    // newUser.password = hashedPassword

    // const id = users.length > 0 ?
    //     Math.max(...users.map(user => user.id)) + 1
    //     : 1
    // newUser.id = id

    // users.push(newUser)
    // res.status(201).json(newUser)
    // } catch {
    //     res.status(500).send()
    // }
    // }

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
    // const user = users.find(user => user.username === req.body.username)

    User.findOne({ username: req.body.username, email: req.body.email }).then(result => {
        if(result){
            console.log(result) 
                if (CryptoJS.MD5(req.body.password).toString() === result.password) {
                    res.send('Success')
                } else {
                    res.send('Not Allowed')
                    return
        
                    // res.status(404).send('Not Allowed')
                }    
        }
        else{
            return res.status(400).send('Cannot find user')
        }
    }).catch(error => {
        console.log(error)
        res.status(500).end()
    })

    // if (user == null) {
    //     return res.status(400).send('Cannot find user')
    // }
    // try {
    //     if (await bcrypt.compare(req.body.password, user.password)) {
    //         res.send('Success')
    //     } else {
    //         res.send('Not Allowed')
    //         return

    //         // res.status(404).send('Not Allowed')
    //     }
    // } catch {
    //     res.status(500).send()
    // }

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runs at: ${PORT}`)
})