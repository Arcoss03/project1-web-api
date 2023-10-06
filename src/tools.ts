import { Person } from './types';

function getMaxId(persons: Person[]) {
    let maxId = 0;
    persons.forEach((person: Person) => {
        if (person.id > maxId) {
            maxId = person.id;
        }
    });
    return maxId;
}

export default {getMaxId};