const fs = require('fs');

let importData = fs.readFileSync('layout.json');
let parsedData = JSON.parse(importData);

let returnAndNewlineChar = "\r\n";


//start process
if(parsedData.root){
    //go thru all levels
    if(parsedData.root.child.length > 0){
        processCSVLine(parsedData.root.publicID, '', '', '', parsedData.root.entityCodeID, true);

        iterateChild(parsedData.root.child, parsedData.root.publicID,  parsedData.root.amount);
    }
}
else{
    console.log("root only");
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



































// const fs = require('fs');

// let importData = fs.readFileSync('layout2.json');
// let parsedData = JSON.parse(importData);

// let hierarchy = [];
// //let parentName = '';
// let returnAndNewlineChar = "\r\n";
// let csvString = '';


// //start process
// if(parsedData.root){
//     //go thru all levels
//     if(parsedData.root.child.length > 0){
//         buildHierarchy(parsedData.root.publicID, parsedData.root.entityCodeID, parsedData.root.amount, '');
//         iterateChild(parsedData.root.child, parsedData.root.publicID);
//     }
//     //console.log(hierarchy);
//     buildOrder();
// }
// else{
//     console.log("root only");
// }

// //recursively traverse all children
// function iterateChild(childArray, parentName){
//     if(childArray.length > 0){

//         //if childArray.length > 1, need a copy in parentNamePlaceholder or will stack append names incorrectly
//         if(childArray.length > 1){
//             for(var i=0; i < childArray.length; i++){
//                 let parentNamePlaceholder = ''; //reset on each element
//                 parentNamePlaceholder = JSON.parse(JSON.stringify(parentName));

//                 buildHierarchy(childArray[i].publicID, childArray[i].entityCodeID, childArray[i].amount, parentNamePlaceholder);

//                 if(childArray[i].child.length > 0){
//                     parentNamePlaceholder = parentNamePlaceholder + "/" + childArray[i].publicID;
//                     iterateChild(childArray[i].child, parentNamePlaceholder);
//                 }
//                 else{
//                     parentNamePlaceholder = '';
//                 }
//             }
//         }
//         else{
//             //only one element in array, no need to manage parentName, wont stack appends
//             for(var j=0; j < childArray.length; j++){
//                 buildHierarchy(childArray[j].publicID, childArray[j].entityCodeID, childArray[j].amount, parentName);

//                 if(childArray[j].child.length > 0){
//                     parentName = parentName + "/" + childArray[j].publicID;
//                     iterateChild(childArray[j].child, parentName);
//                 }
//                 else{
//                     parentName = '';
//                 }
//             }
//         }
//     }
//     else{
//         console.log("empty child");
//     }
// }

// function buildOrder(){
//     let lineCount = '';

//     for(var a=0; a < hierarchy.length; a++){
//         //special case
//         /*if(a===0){
//             processCSVLine(hierarchy[a], lineCount, true);
//         }*/

//         let previousElementFullName = '';

//         //special case
//         if(a === 1){
//             previousElementFullName = hierarchy[a-1].publicID;

//             if(hierarchy[a].parents !== previousElementFullName){
//                 /*console.log('start1');
//                 console.log(previousElementFullName);
//                 console.log("break1");
//                 console.log(hierarchy[a].parents);*/
//             }
//             else{
//                 /*console.log('start2');
//                 console.log(previousElementFullName);
//                 console.log("keep going1");
//                 console.log(hierarchy[a].parents);*/
//             }
//         }

//         //rest of array
//         if(a > 1){
//             previousElementFullName = hierarchy[a-1].parents + "/" + hierarchy[a-1].publicID;
            
//             if(hierarchy[a].parents !== previousElementFullName){
//                 /*console.log('start3');
//                 console.log(previousElementFullName);
//                 console.log("break2");
//                 console.log(hierarchy[a].parents);*/
//             }
//             else{
//                 /*console.log('start4');
//                 console.log(previousElementFullName);
//                 console.log("keep going2");
//                 console.log(hierarchy[a].parents);*/
//             }
//         }
//     }




//     /*for(var a=0; a < 4; a++){
//         let csvLine = hierarchy[a].publicID + "," + hierarchy[a].parents + "," + hierarchy[a].entityCodeID; 
//         //console.log(csvLine);
//         if(a === 0){
//             writeToCSV(csvLine, true);
//         }
//         else{
//             writeToCSV(csvLine, false);
//         }
//     }*/
// }

// function processCSVLine(hierarchyData, lineCount, isFirstLine){
//     let csvLineAsString = hierarchyData.publicID + lineCount + "," + hierarchyData.parents + "," + hierarchyData.entityCodeID; 
//     if(isFirstLine){
//         writeToCSV(csvLineAsString, isFirstLine);
//     }
//     else{
//         writeToCSV(csvLineAsString, isFirstLine);
//     }
// }

// function writeToCSV(dataToWrite, initialWrite){
//     if(initialWrite){
//         //initial csv creation
//         fs.writeFileSync("output.csv", dataToWrite);
//     }
//     else{
//         //add lines to csv
//         fs.appendFileSync("output.csv", returnAndNewlineChar + dataToWrite);
//     }
// }

// function buildHierarchy(publicID, entityCodeID, amount, parents){
//     hierarchy.push({publicID: publicID, entityCodeID: entityCodeID, amount: amount, parents: parents});
// }