import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const logger = (req, _, next) => {
    console.log('HTTP zahtev: ', req.method)
    console.log('Putanja: ', req.path)
    console.log('Telo zahteva: ', req.body)
    console.log('-----------')
    next()
}

app.use(logger)

const defaultEndpoint = (_, res) => {
    res.status(404).json({ error: 'Nepoznata putanja' })
}

const RECEPTI = '/recepti'

let recepti = [
    {
        id: 1,
        recept: 'nesto1',
        autor: 'Chef Gagi'
    },
    {
        id: 2,
        recept: 'nesto2',
        autor: 'Chef Gagi'
    },
    {
        id: 3,
        recept: 'nesto3',
        autor: 'Chef Gagi'
    },
    {
        id: 4,
        recept: 'nesto4',
        autor: 'Chef Gagi'
    },
    {
        id: 5,
        recept: 'nesto5',
        autor: 'Chef Gagi'
    }
]


app.get(RECEPTI, (_, res) => {
    res.status(200).json(recepti)
})

app.get(`${RECEPTI}/:id`, (req, res) => {
    const id = req.params.id
    const recept = recepti.find(r => r.id == id)

    if (recept)
        res.json(recept)
    else res.status(404).end()
})

app.post(RECEPTI, (req, res) => {
    
    const noviRecept = req.body

    if(noviRecept.recept.trim().length === 0 || noviRecept.autor.trim().length === 0){
        res.status(400).json({ error: 'Polja za recept i ime autora moraju biti popunjeni.' })
        return
    }

    const id = recepti.length > 0 ?
    Math.max(...recepti.map(recept => recept.id)) + 1
    : 1
    noviRecept.id = id

    recepti.push(noviRecept)

    res.status(201).json(noviRecept)
})

app.delete(`${RECEPTI}/:id`, (req,res) => {
    const id = req.params.id
    recepti = recepti.filter(r => r.id != id)

    res.status(204).end()
})

app.use(defaultEndpoint)

const PORT = 3005
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`)
})