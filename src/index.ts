import express, { Request, Response } from 'express';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const port: number = 3000;

const app = express();
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const defaultData = { posts: [], persons: [] };
const db = new Low(adapter, defaultData);

app.get('/person', (req: Request, res: Response) => {
    // Récupérer toutes les personnes de la base de données
    const persons = db.read;
    console.log(persons);

    // Renvoyer les données au format JSON
    res.json(persons);
});

// Define the static file path
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the test page
app.get('/test', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Start the server
app.listen(3000, () => {
    console.log(`Server started: http://localhost:${port}`);
});
