# PrjClinica

Applicazione web per la gestione dei pazienti di una clinica veterinaria. Il progetto permette di visualizzare gli animali ricoverati, modificarne lo stato, aggiungere nuovi pazienti con immagine e consultare l'elenco degli animali dimessi.

Repository GitHub: [LoreFloriani/prjClinica](https://github.com/LoreFloriani/prjClinica)

## Gruppo di lavoro

Progetto realizzato in gruppo per TPSIT.

| Nome | Ruolo |
| --- | --- |
| Lorenzo Floriani | Team leader |
| Ethan Villani | Membro del team |
| Pietro Avironcador | Membro del team |

## Funzionalita principali

- Visualizzazione della lista dei pazienti della clinica.
- Ordinamento degli animali in base allo stato di salute.
- Gestione degli stati: `Critico`, `In Osservazione`, `Stabile`, `Dimesso`.
- Cambio dello stato direttamente dalla scheda dell'animale.
- Dimissione di un singolo animale.
- Dimissione automatica di tutti gli animali stabili.
- Pagina dedicata agli animali dimessi.
- Form per aggiungere un nuovo animale.
- Upload opzionale dell'immagine dell'animale.
- Immagine di default se non viene caricata nessuna foto o se il file non e disponibile.
- Script per popolare il database con dati di prova.

## Tecnologie utilizzate

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Multer
- Nodemon
- HTML generato lato server
- CSS custom

## Struttura del progetto

```text
prjClinica/
+-- public/
|   +-- css/
|   |   +-- style.css
|   +-- uploads/
|       +-- default.png
+-- package.json
+-- package-lock.json
+-- popolamentoDb.js
+-- server.js
+-- README.md
```

## Requisiti

Prima di avviare il progetto servono:

- Node.js installato
- npm installato
- Connessione a internet per raggiungere MongoDB Atlas

## Installazione

Clonare il repository:

```bash
git clone https://github.com/LoreFloriani/prjClinica.git
```

Entrare nella cartella del progetto:

```bash
cd prjClinica
```

Installare le dipendenze:

```bash
npm install
```

## Avvio del progetto

Avvio normale:

```bash
npm start
```

Avvio in modalita sviluppo con Nodemon:

```bash
npm run dev
```

Dopo l'avvio, aprire nel browser:

```text
http://localhost:3000
```

La rotta principale reindirizza automaticamente a `/animali`.

## Popolamento del database

Per inserire dati di prova nel database:

```bash
npm run dPop
```

Attenzione: lo script `popolamentoDb.js` elimina gli animali presenti nella collezione e inserisce 30 nuovi animali generati automaticamente.

## Rotte principali

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| `GET` | `/` | Reindirizza alla lista animali |
| `GET` | `/animali` | Mostra gli animali non dimessi |
| `GET` | `/animali/dimessi` | Mostra gli animali dimessi |
| `GET` | `/aggiungi` | Mostra il form di inserimento |
| `POST` | `/aggiungi/salva` | Salva un nuovo animale |
| `GET` | `/stato/:id/:stato` | Aggiorna lo stato di un animale |
| `GET` | `/dimetti/:id` | Dimette un animale specifico |
| `GET` | `/dimetti` | Dimette tutti gli animali stabili |

## Modello dati

Ogni animale salvato nel database contiene:

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `name` | String | Nome dell'animale |
| `specie` | String | Specie dell'animale |
| `proprietario` | String | Cognome o nome del proprietario |
| `stato` | String | Stato clinico dell'animale |
| `immagine` | String | Percorso dell'immagine caricata |

## Note sul database

Il progetto usa MongoDB Atlas tramite Mongoose. La stringa di connessione e attualmente configurata direttamente in `server.js` e in `popolamentoDb.js`.

Per un utilizzo piu sicuro in produzione, sarebbe consigliato spostare la stringa di connessione in una variabile d'ambiente, ad esempio dentro un file `.env` non caricato su GitHub.

## Comandi npm

| Comando | Descrizione |
| --- | --- |
| `npm start` | Avvia il server con Node |
| `npm run dev` | Avvia il server con Nodemon |
| `npm run dPop` | Popola il database con dati di test |
| `npm test` | Non configurato |

## Stato del progetto

Il progetto include le funzionalita principali richieste per la gestione dei pazienti della clinica. La cronologia Git mostra lo sviluppo progressivo di:

- visualizzazione degli animali;
- gestione upload immagini;
- form di aggiunta animale;
- visualizzazione degli animali dimessi;
- gestione delle dimissioni;
- miglioramenti grafici con header, footer e CSS;
- popolamento del database per debug e test.

## Licenza

Il progetto usa licenza ISC, come indicato in `package.json`.
