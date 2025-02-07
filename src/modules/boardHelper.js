const findCoords = (i) => {
    // Find x and y coordinates from the position of the box in the nodeList/Array
    let x = Math.floor(i/10); 
    let y = i%10;
    return {x,y};
}  

export {findCoords};