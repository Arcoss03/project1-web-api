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
        res.json(db.data.persons.find((person:Person) => person.id === id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
});

//post person

app.post('/person', async (req: any, res: any) => {
    try {
        await db.read();
        const nextId:number = getMaxId(db.data.persons) + 1
        console.log(req.body.name)
        const newPerson:Person = {
            id: nextId,
            name: req.body.name,
            surname: req.body.surname
        }
        db.data.persons.push(newPerson);
        await db.write();
        res.json("Personne ajoutée");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données', req:req.body });
    }
});




app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});