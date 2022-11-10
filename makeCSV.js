const fs = require('fs');

const returnAndNewlineChar = "\r\n";


function parseJSON(fileName){
    let importData = fs.readFileSync(fileName);
    let parsedData = JSON.parse(importData);

    return parsedData;
}

//start process
function beginProcessing(fileName){
    let parsedData = parseJSON(fileName);

    if(parsedData.root){
        //go thru all levels
        if(parsedData.root.child.length > 0){
            processCSVLine(parsedData.root.publicID, '', '', '', parsedData.root.entityCodeID, true);

            iterateChild(parsedData.root.child, parsedData.root.publicID,  parsedData.root.amount);
        }
        else{
            processCSVLine(parsedData.root.publicID, '', '', '', parsedData.root.entityCodeID, true);
        }
    }
    else{
        console.log("empty");
    }
}

//recursively traverse all children
function iterateChild(childArray, parentName, parentAmount){
    //if childArray.length > 1, need a copy in parentNamePlaceholder or will stack append names incorrectly
    if(childArray.length > 1){
        for(var i=0; i < childArray.length; i++){
            let parentNamePlaceholder = ''; //reset on each element
            parentNamePlaceholder = JSON.parse(JSON.stringify(parentName));

            for(var a=0; a < childArray[i].amount; a++){
                //needed to reset for each amount per level
                let copyOfParentNamePlaceholder = parentNamePlaceholder;

                //special case, dont add amount count if only one
                if(childArray[i].amount < 2){
                    processCSVLine(childArray[i].publicID, '', copyOfParentNamePlaceholder, '', 
                        childArray[i].entityCodeID, false);

                    if(childArray[i].child.length > 0){
                        copyOfParentNamePlaceholder = copyOfParentNamePlaceholder + "/" + childArray[i].publicID;
                        iterateChild(childArray[i].child, copyOfParentNamePlaceholder, '');
                    }
                }
                else{
                    processCSVLine(childArray[i].publicID, a+1, copyOfParentNamePlaceholder, parentAmount, 
                        childArray[i].entityCodeID, false);

                    if(childArray[i].child.length > 0){
                        copyOfParentNamePlaceholder = copyOfParentNamePlaceholder + "/" + childArray[i].publicID;
                        iterateChild(childArray[i].child, copyOfParentNamePlaceholder, a+1);
                    }
                }
            }

            parentNamePlaceholder = ''; //reset per element on this level
        }
    }
    else{
        //only one element in array, no need to manage parentName, wont stack appends
        for(var j=0; j < childArray.length; j++){

            for(var b=0; b < childArray[j].amount; b++){
                //needed to reset for each amount per level
                let copyOfParentName = parentName;

                //special case, dont add amount count if only one
                if(childArray[j].amount < 2){
                    processCSVLine(childArray[j].publicID, '', copyOfParentName, '', 
                        childArray[j].entityCodeID, false);

                    if(childArray[j].child.length > 0){
                        copyOfParentName = copyOfParentName + "/" + childArray[j].publicID;
                        iterateChild(childArray[j].child, copyOfParentName, '');
                    }
                }
                else{
                    processCSVLine(childArray[j].publicID, b+1, copyOfParentName, parentAmount, 
                        childArray[j].entityCodeID, false);

                    if(childArray[j].child.length > 0){
                        copyOfParentName = copyOfParentName + "/" + childArray[j].publicID;
                        iterateChild(childArray[j].child, copyOfParentName, b+1);
                    }
                }
            }

            parentName = ''; //reset per element on this level
        }
    }
}

function processCSVLine(publicID, lineCount, parents, parentCount, entityCodeID, isFirstLine){
    let csvLineAsString = publicID + lineCount + "," + parents + parentCount + "," + entityCodeID; 
    if(isFirstLine){
        writeToCSV(csvLineAsString, isFirstLine);
    }
    else{
        writeToCSV(csvLineAsString, isFirstLine);
    }
}

function writeToCSV(dataToWrite, initialWrite){
    if(initialWrite){
        //initial csv creation
        fs.writeFileSync("output.csv", dataToWrite);
    }
    else{
        //add lines to csv
        fs.appendFileSync("output.csv", returnAndNewlineChar + dataToWrite);
    }
}

//entry point
beginProcessing('layout.json');

module.exports = {beginProcessing, parseJSON};