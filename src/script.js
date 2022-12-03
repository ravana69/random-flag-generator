const colours = [
    'black',
    'darkred',
    'orangered',
    'darkgreen',
    'green',
    'teal',
    'darkslateblue',
    'purple',
    'mediumvioletred',
    'saddlebrown',
];

const brightColours = [
    'greenyellow',
    'whitesmoke',
    'gold',
]

const bandAmount = [1, 2, 2, 3, 3, 3, 3, 4, 4, 5];

const bandOrientation = [
    'horizontal',
    'vertical',
    // diagonal ?
];

const shapeType = [
    'circle',
    'favorite',
    'remove_red_eye',
    'star',
    'star',
    'triangle',
    'triangle',
    '',
    '',
    '',
    '',
    '',
]

const flag = document.querySelector('.flag');

document.querySelector('.generate').addEventListener('click', (evt) => {
    evt.preventDefault();
    generateRandomFlag(colours);
});

document.querySelector('input').addEventListener('input', (evt) => {
    const encodedString = evt.target.value;
    createFlagFromString(encodedString);
});

document.addEventListener('DOMContentLoaded', () => generateRandomFlag(colours));

function clear() {
    // Reset output
    flag.classList.remove('flag--vertical');
    while (flag.firstChild) {
        flag.removeChild(flag.firstChild);
    }    
}

function createFlag(amount, orientation, colourList, shape) {
    // Set orientation
    flag.classList.add('flag--' + orientation);
    
    // Set bands
    for (let i = 0; i < amount; i += 1) {
        let band = document.createElement('div');
        band.className = 'band';
        band.style.background = colourList.shift();
        flag.appendChild(band);
    }
    
    // Set shape
    if (shape) {
        let shapeElement = document.createElement('div');
        if (['circle', 'triangle'].indexOf(shape) !== -1) {
            shapeElement.className = shape;
            shapeElement.style.borderLeftColor = colourList.shift();
        } else {
            shapeElement.className = 'icon';
            shapeElement.innerHTML = shape;
            shapeElement.style.color = colourList.shift();
        }
        flag.appendChild(shapeElement);
    }    
}

function createFlagFromString(encodedString) {
    const bandAmount = Number(encodedString[0]);
    const bandOrientation = encodedString[1] === 'v' ? 'vertical' : 'horizontal';
    const colourList = encodedString
        .substring(2, 2 + bandAmount).split('')
        .map(encodedColour => [...colours, ...brightColours][parseInt(encodedColour, 16)]);
    let shape = encodedString.length > 2 + bandAmount
        ? encodedString[2 + bandAmount]
        : '';
    if (shape) {
        const hex = encodedString[encodedString.length - 1];
        const colour = [...colours, ...brightColours][parseInt(hex, 16)];
        colourList.push(colour);
    }
    switch (shape) {
        case 'c': shape = 'circle'; break;
        case 'f': shape = 'favorite'; break;
        case 'r': shape = 'remove_red_eye'; break;
        case 's': shape = 'star'; break;
        case 't': shape = 'triangle'; break;
    }
    
    // Output
    clear();
    createFlag(bandAmount, bandOrientation, colourList, shape)    
}

function generateRandomFlag(localColours) {
    clear();
    // Get options
    const shape = pick(shapeType);
    const orientation = shape === 'triangle' ? 'horizontal' : pick(bandOrientation);
    const amount = pick(bandAmount);
    let availableColours = shape ? colours : [...colours, ...brightColours];
    colourList = pick(availableColours, amount + !!shape);
    colourList = Array.isArray(colourList) ? colourList : [colourList];
    if (!!shape && Math.random() > 0.33) {
        colourList[colourList.length - 1] = pick(brightColours);
    }
    
    // Output
    encodeOptions(amount, orientation, colourList, shape);
    createFlag(amount, orientation, colourList, shape)
}

function pick(paramList, amount = 1) {
    const list = paramList.slice();
    const splice = (list) => list.splice(Math.floor(Math.random() * list.length), 1)[0];
    if (amount === 1) { return splice(list); }
    let result = [];
    for (let i = 0; i < amount; i += 1) {
        result.push(splice(list));
    }
    return result;
}

function encodeOptions(
    bandAmount,
    bandOrientation,
    bandColours,
    shape,
    ) {
    let encodedString = '' + bandAmount;
    encodedString += bandOrientation[0];
    bandColours.forEach(bandColour => {
        let index = colours.indexOf(bandColour)
        encodedString += index === -1
            ? ('abc'[brightColours.indexOf(bandColour)])
            : index;
    });
    encodedString = shape
        ? encodedString.substring(0, encodedString.length - 1) + shape[0] + encodedString[encodedString.length - 1]
        : encodedString;
    document.querySelector('input').value = encodedString;
}
