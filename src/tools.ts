import { Person } from './types';


export function getMaxId(persons: Person[]) {
    let maxId = 0;
    persons.forEach((person: Person) => {
        if (person.id > maxId) {
            maxId = person.id;
        }
    });
    return maxId;
}

export function printHello() {
    console.log("Hello World!");

}



