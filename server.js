//express
const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))//Rende la cartella public accessibile ad express

//upload file
const multer = require("multer")
const path = require("path")

app.use("/uploads", express.static("public/uploads"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
        const nomeAnimale = req.body.name
        const estensione = path.extname(file.originalname)
        const now = Date.now()
        const nomeFile = nomeAnimale + "-" + now + estensione // crea un nome unico per il file
        cb(null, nomeFile)
    }
})

const upload = multer({ storage: storage }); //quando chiamo la funzione upload, multer sa già dove salvare i file e come chiamarli

//Gestione DB
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://prjClinicaUser:1234@cluster0.uuczued.mongodb.net/?appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err))

const animaleSchema = new mongoose.Schema({
    name: { type: String, required: true }, //nome dell'animale
    specie: { type: String, required: true }, //specie dell'animale
    proprietario: { type: String, required: true }, //nome del proprietario
    stato: { type: String, required: true }, //stato di salute (Stabile, Critico, In Osservazione, Dimesso)
    immagine: String //percorso dell'immagine dell'animale
})

const Animale = mongoose.model('Animale', animaleSchema)

//Rotte

const headerHtml = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Clinica Animali</title>

    <link rel="stylesheet" href="/css/style.css">
</head>
<body>

<header>
    <h1>Clinica Animali</h1>

    <nav>
        <button onclick="window.location.href='/animali'">Lista pazienti</button>
        <button onclick="window.location.href='/animali/dimessi'">Dimessi</button>
    </nav>
</header>
<main>`

const footerHtml = `
</main>
</body>
</html>`

app.get('/', (req, res) => {
    res.redirect('/animali')
})

app.get('/animali', async (req, res) => {
    let animali = await Animale.find()
    const ordine = {
        "Critico": 1,
        "In Osservazione": 2,
        "Stabile": 3,
        "Dimesso": 4
    };

    animali.sort((a, b) => {// a e b sono 2 animali confrontati alla volta, se il loro stato risulta negativo,
    //a viene prima di b, se positivo b viene prima di a, se 0 restano invariati
    //ordine serveda arrey di decodifica
        return ordine[a.stato] - ordine[b.stato];
    });

    let html = headerHtml + `<div class="container">`


    animali.filter(animale => animale.stato !== "Dimesso")
        .forEach(animale => {
            html += `
            <div class="animale ${animale.stato}">
                <img src="${animale.immagine}" onerror="this.src='/uploads/default.png'" alt="${animale.name}">
                <h2>${animale.name}</h2>
                <p>${animale.specie}</p>
                <p>${animale.proprietario}</p>
                <select
                    class="badge badge-${animale.stato === 'Stabile' ? 'stabile' : animale.stato === 'Critico' ? 'critico' : 'osservazione'}"
                    onchange="
                        const map = {'Stabile':'stabile','Critico':'critico','In Osservazione':'osservazione'};
                        this.className = 'badge badge-' + map[this.value];
                        window.location.href='/stato/${animale.id}/' + this.value;
                    ">`
                + //${animale.stato === 'Stabile' ? 'selected' : ''} serve per selezionare l'opzione che corrisponde allo stato attuale dell'animale
                    `<option value="Critico" ${animale.stato === 'Critico' ? 'selected' : ''}>Critico</option>
                    <option value="In Osservazione" ${animale.stato === 'In Osservazione' ? 'selected' : ''}>In Osservazione</option>
                    <option value="Stabile" ${animale.stato === 'Stabile' ? 'selected' : ''}>Stabile</option> 
                </select>
                <button onclick="window.location.href='/dimetti/${animale.id}'">dimetti</button>
            </div>`
        })

    html += `</div>`
    html += `
        <div class="azioni">
            <button class="btn-primario" onclick="window.location.href='/aggiungi'">+ Aggiungi Animale</button>
            <button class="btn-secondario" onclick="window.location.href='/dimetti/'">Dimetti tutti stabili</button>
        </div>`
    res.send(html + footerHtml)
})

app.get('/stato/:id/:stato', async (req, res) => {
    await Animale.findByIdAndUpdate(req.params.id, { stato: req.params.stato })
    res.redirect('/animali')
})

app.get(['/dimetti/:id', '/dimetti'], async (req, res) => {
    if (req.params.id) {
        await Animale.findByIdAndUpdate(req.params.id, { stato: "Dimesso" })
    } else{
        await Animale.updateMany(
            { stato: "Stabile" }, //tutti quelli con stato stabile
            { stato: "Dimesso" } //vengono aggiornati a dimesso
        )
    }
    res.redirect('/animali')
})

app.get('/animali/dimessi', async (req, res) => {
    let animali = await Animale.find()
    let html = headerHtml + `<div class="container">`


    animali.filter(animale => animale.stato === "Dimesso")
        .forEach(animale => {
            html += `
            <div class="animale">
                <img src="${animale.immagine}" onerror="this.src='/uploads/default.png'" alt="${animale.name}">
                <h2>${animale.name}</h2>
                <p>${animale.specie}</p>
                <p>${animale.proprietario}</p>
                <span class="badge badge-dimesso">${animale.stato}</span>

            </div>`
        })

    html += `</div>`
    res.send(html + footerHtml)
})

app.get('/aggiungi', (req, res) => {
    let html = headerHtml +`
    <form action="/aggiungi/salva" method="POST" enctype="multipart/form-data">

        <label for="name">Nome</label>
        <input type="text" id="name" name="name" required>

        <label for="specie">Specie</label>
        <input type="text" id="specie" name="specie" required>

        <label for="proprietario">Proprietario</label>
        <input type="text" id="proprietario" name="proprietario" required>

        <label for="stato">Stato</label>
        <select id="stato" name="stato" required>
            <option value="Stabile">Stabile</option>
            <option value="Critico">Critico</option>
            <option value="In Osservazione">In Osservazione</option>
        </select>

        <label for="immagine">Immagine</label>
        <input type="file" id="immagine" name="immagine" accept="image/*">

        <button type="submit">Salva</button>

    </form>`
    res.send(html + footerHtml)
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