import { faker } from "@faker-js/faker";

/**
 * 
 * @param {Number} number The number of desired random signal names
 * @returns The object containing the id of a signal and its name
 *          or a list of such objects, when {@link number} is defined
 */
function createRandomSignal(number) {
    const prefix = "CAN.";
    const newManufacturerName = () => faker.vehicle.manufacturer().replace(/\s/g, ""); // Remove whitespaces

    if (number) {
        const signalNames = [];

        for (let i = 0; i < number; i++) {
            const signalName = `${prefix}${newManufacturerName()}`;

            signalNames.push({ id: i, name: signalName });
        }

        return signalNames;
    }
    else {
        const signalName = `${prefix}${newManufacturerName()}`;

        return { id: 0, name: signalName };
    }
}

// Taken from stackoverflow
const shuffleArray = (array) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}