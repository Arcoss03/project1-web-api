function getMaxId(persons) {
    let maxId = 0;
    persons.forEach((person) => {
        if (person.id > maxId) {
            maxId = person.id;
        }
    });
    return maxId;
}
export default { getMaxId };
