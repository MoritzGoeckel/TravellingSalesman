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

//Generate graph
let graph = new Graph();
for(let i = 0; i < 10; i++){
    graph.addNode(Math.random() * 100, Math.random() * 100, newId());
}

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

console.log(pathNodes);