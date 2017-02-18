//Generate a random path to start from
function generateRandomPath(graph){
    let nodeIds = graph.getNodeIds();
    let pathNodes = [nodeIds.shift()]; //Start with first
    
    for(let i = 0; i < nodeIds.length; )
    {
        let a = Math.round(Math.random() * (nodeIds.length - 1));
        pathNodes.push(nodeIds[a]);
        nodeIds.splice(a, 1);
    }

    pathNodes.push(pathNodes[0]); //End with the first again

    return pathNodes;
}

//Mutate the path a little
function mutatePath(path){
    let outputPath = path.slice();
    let lastAndFirst = outputPath.pop();

    if(lastAndFirst != outputPath.shift())
        throw new Error("Last and first should be same");

    let toMutate = Math.ceil(Math.random() * ((path.length - 1) / 50) + 1);
    toMutate = 1; //Todo: remove
    
    for(let i = 0; i < toMutate; i++){
        let randomIndex = Math.round(Math.random() * (outputPath.length - 1));
        let randomOtherIndex = Math.round(Math.random() * (outputPath.length - 1));
        
        let elem = outputPath[randomIndex];
        outputPath.splice(randomIndex, 1);
        outputPath.splice(randomOtherIndex, 0, elem);
    }

    //Start and end with beginning node
    outputPath.unshift(lastAndFirst);
    outputPath.push(lastAndFirst);

    return outputPath;
}

//Get the most fit paths to survive
function selectSurvivingPaths(paths, graph, count){
    paths.sort(function(a, b){return graph.getPathDistance(a) - graph.getPathDistance(b);});
    
    let noDoubleEntries = [];
    for(let p in paths)
        if(noDoubleEntries.indexOf(paths[p]) == -1)
            noDoubleEntries.push(paths[p]);
    
    return noDoubleEntries.splice(0, count);
}

//Create a new generation: NewGeneration = offspring -> mutation + parents -> selection
function doGeneration(graph, oldGeneration, offspringPerRound, survivorsPerRound, randomPerRound){
    
    let newGeneration = [];
    for(let p = 0; p < oldGeneration.length; p++)
        for(let i = 0; i < offspringPerRound; i++)
            newGeneration.push(mutatePath(oldGeneration[p]));

    for(let p = 0; p < oldGeneration.length; p++)
        newGeneration.push(oldGeneration[p]); //Also add the parents to the offspring

    for(let i = 0; i < randomPerRound; i++)
        newGeneration.push(generateRandomPath(graph)); //Also add random paths

    let survivors = selectSurvivingPaths(newGeneration, graph, survivorsPerRound);
    
    return survivors;
}

function generatePathGenetic(graph){

    //Main programm to do the genetic algorithm
    let offspringPerGeneration = 20;
    let survivorsPerRound = 20;
    let randomPerRound = 5;

    //Initial generation is some random paths
    let generation = [];
    for(let i = 0; i < survivorsPerRound; i++)
        generation.push(generateRandomPath(graph));

    //Going through the generations
    let round = 0;
    return setInterval(function(){
        generation = doGeneration(graph, generation, offspringPerGeneration, survivorsPerRound, randomPerRound);
        console.log("Best in round "+ round++ +": " + graph.getPathDistance(generation[0]));
        showPath(generation[0], graph, "canvasGenetic", "genetic_h1", "Genetic Method: ");
    }, 1);
}