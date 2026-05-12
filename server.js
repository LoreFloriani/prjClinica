//express
const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }))

//upload file
const multer = require("multer")
const path = require("path")

app.use("/uploads", express.static("uploads"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        const nomeAnimale = req.body.nomeAnimale
        const estensione = path.extname(file.originalname)
        const now = Date.now()
        const nomeFile = nomeAnimale + "-" + now + estensione
        cb(null, nomeFile)
    }
})

const upload = multer({ storage: storage });

//Gestione DB
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://prjClinicaUser:1234@cluster0.uuczued.mongodb.net/?appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err))

const animaleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specie: { type: String, required: true },
    proprietario: { type: String, required: true },
    stato: { type: String, required: true },
    immagine: String
})

const Animale = mongoose.model('Animale', animaleSchema)

//Rotte
app.get('/', (req, res) => {
    res.redirect('/animali')
})

app.get('/animali', async (req, res) => {
    let animali = await Animale.find()
    let html = `<div class="container">`


    animali.forEach(animale => {
        html += `
        <div class="animale ${animale.stato}">
            img src="${animale.immagine}" alt="${animale.name}">
            <h2>${animale.name}</h2>
            <p>Specie: ${animale.specie}</p>
            <p>Proprietario: ${animale.proprietario}</p>
            <p>Stato: ${animale.stato}</p>
        </div>`
    })

    html += `</div>`
    res.send(html)
})





app.listen(port, () => console.log(`Server Clinica in ascolto sulla porta: ${port}!`))