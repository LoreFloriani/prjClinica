const mongoose = require('mongoose');

// connessione al tuo DB
mongoose.connect('mongodb+srv://prjClinicaUser:1234@cluster0.uuczued.mongodb.net/?appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const animaleSchema = new mongoose.Schema({
    name: String,
    specie: String,
    proprietario: String,
    stato: String,
    immagine: String
});

const Animale = mongoose.model('Animale', animaleSchema);

// dati base
const stati = ["Stabile", "Critico", "In Osservazione"];

const specie = ["Cane", "Gatto", "Coniglio", "Criceto", "Uccello"];

const nomi = ["Luna", "Rocky", "Milo", "Bella", "Kira", "Leo", "Nala", "Jack", "Toby", "Mia"];

const proprietari = ["Rossi", "Bianchi", "Verdi", "Ferrari", "Russo"];

// genera animali
async function seed() {

    await Animale.deleteMany({}); // pulisce tutto

    let animali = [];

    for (let stato of stati) {
        for (let i = 0; i < 10; i++) {

            animali.push({
                name: nomi[Math.floor(Math.random() * nomi.length)] + i,
                specie: specie[Math.floor(Math.random() * specie.length)],
                proprietario: proprietari[Math.floor(Math.random() * proprietari.length)],
                stato: stato,
                immagine: null
            });
        }
    }

    await Animale.insertMany(animali);

    console.log("✔ 30 animali inseriti con successo");

    mongoose.disconnect();
}

seed();