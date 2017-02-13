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

function generateGraph(points){
    //Generate graph
    let graph = new Graph();
    for(let i = 0; i < points; i++){
        graph.addNode(Math.random() * 300, Math.random() * 300, newId());
    }
    return graph;
}

function generatePath(graph){
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
    return pathNodes;
}

function showPath(path, graph){
    var ctx = document.getElementById("myCanvas").getContext("2d");
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
    document.getElementById("hl").innerText = "Distance: " + distance; 
}

function start(){
    let graph = generateGraph(10);
    let path = generatePath(graph);
    showPath(path, graph);
}

window.onload = start;