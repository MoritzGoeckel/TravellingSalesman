let Graph = class{
    constructor(){
        this.nodes = {};
    }

    getNodeIds(){
        let output = [];
        for(let id in this.nodes)
            output.push(id);
        return output; 
    }

    addNode(x, y, id){
        this.nodes[id] = {x:x, y:y};
    }

    getPathDistance(path){
        let distance = 0;
        for(let i = 0; i < path.length - 1; i++)
            distance += this.getDistance(path[i], path[i + 1]);
        return distance;
    }

    getDistance(node_id, other_id)
    {
        return this.getDistance_Nodes(this.nodes[node_id], this.nodes[other_id]);
    }

    getDistance_Nodes(a, b){
        let x = Math.abs(b.x - a.x);
        let y = Math.abs(b.y - a.y);

        return x + y;
    }

    getDistances(node_id){

        if(this.nodes[node_id] == undefined)
            throw new Error("Node id not existing " + node_id);

        let output = [];
        for(let other_id in this.nodes)
        {
            if(node_id != other_id)
                output.push({id:other_id, distance:this.getDistance_Nodes(this.nodes[other_id], this.nodes[node_id])});            
        }
        return output;
    }
}

let newId = function(){ 
    let id = 0; 
    return function(){return id++;}
}();

//Generate graph with random nodes
function generateGraph(points){
    let graph = new Graph();
    for(let i = 0; i < points; i++){
        graph.addNode(Math.random() * 300, Math.random() * 300, newId());
    }
    return graph;
}

//Generate the path with the nearest neighbour method
function generatePathNearestNeighbour(graph){
    let nodeIds = graph.getNodeIds();
    let pathNodes = [nodeIds[0]]; //Start with first
    while(true)
    {
        let distances = graph.getDistances(pathNodes[pathNodes.length - 1]);
        distances.sort(function(a, b){ return a.distance - b.distance; });
        distances = distances.filter(function(a){return pathNodes.indexOf(a.id) == -1;}) //only not in pathnodes

        if(distances.length == 0)
            break;

        pathNodes.push(distances[0].id); //Shortest
    }

    pathNodes.push(pathNodes[0]);

    showPath(pathNodes, graph, "canvasNN", "nn_h1", "Nearest Neighbour: ");      
}

//functions for the genetic generation of best paths

//Generate a random path to start from
function generateRandomPath(graph){
    let nodeIds = graph.getNodeIds();
    let pathNodes = []; //Start with first
    
    for(let i = 0; i < nodeIds.length; )
    {
        let a = Math.round(Math.random() * (nodeIds.length - 1));
        pathNodes.push(nodeIds[a]);
        nodeIds.splice(a, 1);
    }

    pathNodes.push(pathNodes[0]);

    return pathNodes;
}

//Mutate the path a little
function mutatePath(path){
    let outputPath = path.slice();
    let lastAndFirst = outputPath.pop();

    if(lastAndFirst != outputPath[0])
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

    outputPath.push(outputPath[0]);

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
    setInterval(function(){
        generation = doGeneration(graph, generation, offspringPerGeneration, survivorsPerRound, randomPerRound);
        console.log("Best in round "+ round++ +": " + graph.getPathDistance(generation[0]));
        showPath(generation[0], graph, "canvasGenetic", "genetic_h1", "Genetic: ");
    }, 1);
}

//Show path and points
function showPath(path, graph, canvasId, headlineId, headlineprefix){
    var ctx = document.getElementById(canvasId).getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 1000);
    
    ctx.strokeStyle = "black"; 
    ctx.fillStyle = "blue";
       
    ctx.beginPath();
    ctx.moveTo(graph.nodes[path[0]].x, graph.nodes[path[0]].y);
    ctx.fillRect(graph.nodes[path[0]].x - 5, graph.nodes[path[0]].y - 5, 10, 10);
    
    for(let i = 1; i < path.length; i++)
    {
        ctx.lineTo(graph.nodes[path[i]].x, graph.nodes[path[i]].y);
        ctx.fillRect(graph.nodes[path[i]].x - 3, graph.nodes[path[i]].y - 3, 6, 6);
    }
    ctx.lineWidth = 3;
    ctx.stroke();

    let distance = graph.getPathDistance(path);
    document.getElementById(headlineId).innerText = headlineprefix + distance; 
}

//---------------- MAIN ------------------

function newGraph(){
    let graph = generateGraph(30);
    findPaths(graph);
}

function findPaths(graph){
    generatePathGenetic(graph);
    generatePathNearestNeighbour(graph);
}

window.onload = function(){ newGraph(); };