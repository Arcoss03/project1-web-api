import express from "express";
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Person } from './types'
import { Data } from './types'
import { getMaxId } from './tools'
const adapter = new JSONFile<Data>('./db.json')
const defaultData: Data = { persons:[] }
const db = new Low(adapter, defaultData)


const app: express.Application = express();
app.use(express.json());

const hostname = '127.0.0.1';
const port = 3000;


app.get('/', function (req: any, res: any) {
    res.send("Hello World!");
});

app.get('/test', function (req: any, res: any) {
    res.send("Test!!!!!");
});


app.get('/person', async (req: any, res: any) => {
    try {
        await db.read();
        //await db.write();
        res.json(db.data.persons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
});

app.get('/person/:id', async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id); // Récupérer l'ID à partir de l'URL et le convertir en nombre
        await db.read();
        const person = db.data.persons.find((person: Person) => person.id === id);

        if (person) {
            // Si l'utilisateur existe, renvoyez ses données
            res.json(person);
        } else {
            // Si l'utilisateur n'existe pas, renvoyez une réponse 404
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
});

//post person

app.post('/person', async (req: any, res: any) => {
    try {
        await db.read();

        // Vérification que name et surname ne sont pas vides
        if (!req.body.name || !req.body.surname) {
            res.status(400).json({ error: 'Les champs "name" et "surname" sont requis.' });
            return; // Sortir de la fonction en cas de données manquantes
        }

        const nextId: number = getMaxId(db.data.persons) + 1;

        const newPerson: Person = {
            id: nextId,
            name: req.body.name,
            surname: req.body.surname,
        };

        db.data.persons.push(newPerson);
        await db.write();
        res.json({"Personne ajoutée":newPerson});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données', req: req.body });
    }
});





app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});