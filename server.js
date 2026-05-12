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
        cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
        const nomeAnimale = req.body.nome
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


    animali.filter(animale => animale.stato !== "Dimesso")
        .forEach(animale => {
            let imgPath = animale.immagine ? animale.immagine : "/public/uploads/default.png"
            html += `
            <div class="animale ${animale.stato}">
                <img src="${imgPath}" alt="${animale.name}">
                <h2>${animale.name}</h2>
                <p>Specie: ${animale.specie}</p>
                <p>Proprietario: ${animale.proprietario}</p>
                <p>Stato: ${animale.stato}</p>
                <button onclick="window.location.href='/dimetti/${animale.id}'">dimetti</button>
            </div>`
        })

    html += `</div>`
    html += `<button onclick="window.location.href='/aggiungi'">Aggiungi Animale</button>
            <button onclick="window.location.href='/dimetti'">Dimetti tutti stabili</button>
            <a href="/animali/dimessi">Visualizza animali dimessi</a>`
    res.send(html)
})

app.get('/dimetti/:id', async (req, res) => {
    if (req.params.id) {
        await Animale.findByIdAndUpdate(req.params.id, { stato: "Dimesso" })
    } else{
        let animali = await Animale.find()
        animali.filter(animale => animale.stato === "Stabile")
            .forEach(animale => {
                await Animale.findByIdAndUpdate(animale.id, { stato: "Dimesso" })
            })
        
    }
    res.redirect('/animali')
})

app.get('/animali/dimessi', async (req, res) => {
    let animali = await Animale.find()
    let html = `<div class="container">`


    animali.filter(animale => animale.stato === "Dimesso")
        .forEach(animale => {
            let imgPath = animale.immagine ? animale.immagine : "/uploads/default.png"
            html += `
            <div class="animale">
                img src="${imgPath}" alt="${animale.name}">
                <h2>${animale.name}</h2>
                <p>Specie: ${animale.specie}</p>
                <p>Proprietario: ${animale.proprietario}</p>
                <button onclick="window.location.href='/dimetti/${animale.id}'">dimetti</button>
            </div>`
        })

    html += `</div>`
    html += `<a href="/animali">Torna alla lista dei pazienti</a>`
    res.send(html)
})

app.get('/aggiungi', (req, res) => {
    let html = `
    <form action="/aggiungi/salva" method="POST" enctype="multipart/form-data">

        <label for="name">Nome</label>
        <input type="text" id="name" name="name" required>
        <br><br>

        <label for="specie">Specie</label>
        <input type="text" id="specie" name="specie" required>
        <br><br>

        <label for="proprietario">Proprietario</label>
        <input type="text" id="proprietario" name="proprietario" required>
        <br><br>

        <label for="stato">Stato</label>
        <select id="stato" name="stato" required>
            <option value="Stabile">Stabile</option>
            <option value="Critico">Critico</option>
            <option value="In Osservazione">In Osservazione</option>
        </select>
        <br><br>

        <label for="immagine">Immagine</label>
        <input type="file" id="immagine" name="immagine" accept="image/*">
        <br><br>

        <button type="submit">Salva</button>

    </form>`
    res.send(html)
})

app.post('/aggiungi/salva', upload.single('immagine'), async (req, res) => {
    await Animale.create({
        name: req.body.name,
        specie: req.body.specie,
        proprietario: req.body.proprietario,
        stato: req.body.stato,
        immagine: req.file ? "/uploads/" + req.file.filename : null

    })
    res.redirect('/animali')
})

app.listen(port, () => console.log(`Server Clinica in ascolto sulla porta: ${port}!`))