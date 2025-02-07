const ship = (length) => {
    if(!Number.isInteger(length)){
        throw new Error('Ship length must be an integer');
    }
    if(length < 1) {
        throw new Error('Ship length must be greater than 0');
    }

    let hits = 0;
    let isSunk = false;

    const hit = () => {
        hits += 1;

        checkIsSunk();
    };

    const checkIsSunk = () => {
        if (hits > length) {
            hits -= 1;
            throw new Error ('Ship is already deastroyed');
        }
        if (hits === length) {
            isSunk = true;
        }
    }

    return {
        length,
        isSunk: () => isSunk,
        hit,
    }
}

export { ship };