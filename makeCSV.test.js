const { beginProcessing, parseJSON } = require("./makeCsv");

const fs = require('fs');


const rootOnlyOutput = 'Acme Lab,,Building';

test("beginProcessing", () => {
    beginProcessing('testRoot.json');
    let textInFile = fs.readFileSync('output.csv','utf8');

    expect(textInFile).toBe(rootOnlyOutput);
});

const rootOnlyStructure = {
    "root": {
        "publicID": "Acme Lab",
        "entityCodeID": "Building",
        "amount": 1,
        "child": []
    }
}

test("parseJSON", () => {
    expect(parseJSON('testRoot.json')).toMatchObject(rootOnlyStructure);
});