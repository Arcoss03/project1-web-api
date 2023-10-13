import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Person } from "./types";
import { Data } from "./types";
import { getMaxId } from "./tools";
import { ValidationError } from "yup";
import { PersonSchema } from "./schemas";

const adapter = new JSONFile<Data>("./db.json");
const defaultData: Data = { persons: [] };
const db = new Low(adapter, defaultData);

const app: express.Application = express();
app.use(express.json());

const hostname = "127.0.0.1";
const port = 3000;

app.get("/", function (req: any, res: any) {
  res.send("Hello World!");
});

// route GET

app.get("/person", async (req: any, res: any) => {
  try {
    await db.read();
    res.json(db.data.persons);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données." });
  }
});

app.get("/person/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id); // get ID from URL and convert string to number
    const person = db.data.persons.find((person: Person) => person.id === id);

    if (person) {
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données." });
  }
});

//route POST

app.post("/person", async (req: any, res: any) => {
  try {
    await db.read();
    const nextId: number = getMaxId(db.data.persons) + 1;
    const validatedData = await PersonSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const newPerson = { id: nextId, ...validatedData }; // add new  persone to the list
    db.data.persons.push(newPerson);
    await db.write();

    res.json({ "Personne ajoutée": newPerson });
  } catch (error) {
    if (error instanceof ValidationError) {
      res
        .status(400)
        .json({ error: "Validation a échoué", details: error.errors });
    } else {
      console.error(error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données",
        req: req.body,
      });
    }
  }
});

// route PUT
app.put("/person/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await db.read();

    const personIndex = db.data.persons.findIndex(
      (person: Person) => person.id === id
    );

    if (personIndex === -1) {
      res.status(404).json({ error: "Utilisateur non trouvé." });
      return;
    }

    const updatedPerson = {
      id,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
    };

    await PersonSchema.validate(updatedPerson, {
      stripUnknown: true,
      abortEarly: false,
    });

    db.data.persons[personIndex] = updatedPerson;
    await db.write();

    res.json({ message: "Personne mise à jour avec succès", updatedPerson });
  } catch (error) {
    if (error instanceof ValidationError) {
      res
        .status(400)
        .json({ error: "Validation a échoué", details: error.errors });
    } else {
      console.error(error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données",
        req: req.body,
      });
    }
  }
});

// route DELETE
app.delete("/person/:id", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await db.read();

    const personIndex = db.data.persons.findIndex(
      (person: Person) => person.id === id
    );

    if (personIndex === -1) {
      res.status(404).json({ error: "Utilisateur non trouvé." });
      return;
    }

    db.data.persons.splice(personIndex, 1);
    await db.write();

    res.json({ message: "Personne supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

app.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});
