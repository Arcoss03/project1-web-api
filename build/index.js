var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { getMaxId } from './tools';
const adapter = new JSONFile('./db.json');
const defaultData = { persons: [] };
const db = new Low(adapter, defaultData);
const app = express();
app.use(express.json());
const hostname = '127.0.0.1';
const port = 3000;
app.get('/', function (req, res) {
    res.send("Hello World!");
});
app.get('/test', function (req, res) {
    res.send("Test!!!!!");
});
app.get('/person', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.read();
        //await db.write();
        res.json(db.data.persons);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
}));
app.get('/person/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id); // Récupérer l'ID à partir de l'URL et le convertir en nombre
        yield db.read();
        res.json(db.data.persons.find((person) => person.id === id));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
}));
//post person
app.post('/person', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.read();
        const nextId = getMaxId(db.data.persons) + 1;
        console.log(req.body.name);
        const newPerson = {
            id: nextId,
            name: req.body.name,
            surname: req.body.surname
        };
        db.data.persons.push(newPerson);
        yield db.write();
        res.json("Personne ajoutée");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données', req: req.body });
    }
}));
app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
