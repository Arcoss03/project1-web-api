import express from "express";
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Person } from './types'
import { Data } from './types'
import { getMaxId } from './tools'
import {ValidationError} from 'yup';
import { PersonSchema } from './schemas'

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

// app.post('/person', async (req: any, res: any) => {
//     try {
//         await db.read();
//         const nextId: number = getMaxId(db.data.persons) + 1;

//         const newPerson = {
//             id: nextId,
//             name: req.body.name,
//             surname: req.body.surname,
//             email: req.body.email
//         };

//         // Valider les données de la personne avec le schéma Yup
//         await PersonSchema.validate(newPerson, { abortEarly: false });

//         // Ajouter la personne à la base de données
//         db.data.persons.push(newPerson);
//         await db.write();

//         res.json({ "Personne ajoutée": newPerson });
//     } catch (error) {
//         if (error instanceof ValidationError) {
//             // Si la validation échoue, renvoyer les erreurs de validation
//             res.status(400).json({ error: 'Validation a échoué', details: error.errors });
//         } else {
//             // Gérer les autres erreurs, par exemple des erreurs de lecture/écriture
//             console.error(error);
//             res.status(500).json({ error: 'Erreur lors de la récupération des données', req: req.body });
//         }
//     }
// });

app.post('/person', async (req: any, res: any) => {
    try {
        await db.read();
        const nextId: number = getMaxId(db.data.persons) + 1;

        // Valider les données de la personne avec le schéma Yup et supprimer les attributs inconnus
        const validatedData = await PersonSchema.validate(req.body, { stripUnknown: true });

        // Ajouter la personne à la base de données
        const newPerson = { id: nextId, ...validatedData };
        db.data.persons.push(newPerson);
        await db.write();

        res.json({ "Personne ajoutée": newPerson });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Si la validation échoue, renvoyer les erreurs de validation
            res.status(400).json({ error: 'Validation a échoué', details: error.errors });
        } else {
            // Gérer les autres erreurs, par exemple des erreurs de lecture/écriture
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données', req: req.body });
        }
    }
});


// route PUT
app.put('/person/:id', async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id); // Récupérer l'ID de la personne à mettre à jour
        await db.read();
        
        // Vérifier si la personne avec l'ID spécifié existe
        const personIndex = db.data.persons.findIndex((person: Person) => person.id === id);
        
        if (personIndex === -1) {
            // Si la personne n'existe pas, renvoyez une réponse 404
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
            return;
        }

        const updatedPerson = {
            id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email
        };

        // Valider les données de la personne avec le schéma Yup
        await PersonSchema.validate(updatedPerson, { abortEarly: false });

        // Mettre à jour les données de la personne
        db.data.persons[personIndex] = updatedPerson;
        await db.write();

        res.json({ message: 'Personne mise à jour avec succès', updatedPerson });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Si la validation échoue, renvoyer les erreurs de validation
            res.status(400).json({ error: 'Validation a échoué', details: error.errors });
        } else {
            // Gérer les autres erreurs, par exemple des erreurs de lecture/écriture
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données', req: req.body });
        }
    }
});


// Suppression d'une personne (route DELETE)
app.delete('/person/:id', async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id); // Récupérer l'ID de la personne à supprimer
        await db.read();

        // Trouver l'index de la personne à supprimer
        const personIndex = db.data.persons.findIndex((person: Person) => person.id === id);

        if (personIndex === -1) {
            // Si la personne n'existe pas, renvoyez une réponse 404
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
            return;
        }

        // Supprimer la personne de la liste
        db.data.persons.splice(personIndex, 1);
        await db.write();

        res.json({ message: 'Personne supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});






app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});

