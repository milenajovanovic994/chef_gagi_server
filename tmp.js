

import mongoose from 'mongoose'

const url = 'mongodb+srv://milenajovanovic994:bHCSTmj8ETYx4yba@cluster0.0hhjj.mongodb.net/chefGagiApp?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const recipeSchema = new mongoose.Schema({
    recipe: String,
    author: String,
    title: String,
    ingredients: Array,  // array
    dishType: String,
    img: String
})

const Recipe = mongoose.model('Recipe', recipeSchema)

// const recipe = new Recipe({
//     recipe: 'bla bla bla bla bla',
//     author: 'Neko proba',
//     title: 'Ime proba',
//     ingredients: ['proba1', 'proba2'],
//     dishType: 'Tip proba',
//     img: 'https://res.cloudinary.com/milenajovanovic994/image/upload/v1613997883/samples/food/spices.jpg'
// })

// recipe.save().then(res => {
//     console.log('RECIPE снимљен')
//     mongoose.connection.close()
// })

// Recipe.find({}).then(res => {
//     console.log(res)
//     mongoose.connection.close()
// })

// -----------------------------------

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     email: String
// })

// const User = mongoose.model('User', userSchema)

// -----------------------------------------