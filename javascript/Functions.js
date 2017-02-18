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

//Show path and points
function showPath(path, graph, canvasId, headlineId, headlineprefix){
    var ctx = document.getElementById(canvasId).getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 1000);
    
    ctx.strokeStyle = "black"; 
       
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(graph.nodes[path[0]].x, graph.nodes[path[0]].y);
    ctx.fillRect(graph.nodes[path[0]].x - 10, graph.nodes[path[0]].y - 10, 20, 20);
    
    ctx.fillStyle = "blue";
    for(let i = 1; i < path.length; i++)
    {
        ctx.lineTo(graph.nodes[path[i]].x, graph.nodes[path[i]].y);
        ctx.fillRect(graph.nodes[path[i]].x - 3, graph.nodes[path[i]].y - 3, 6, 6);
    }
    ctx.lineWidth = 3;
    ctx.stroke();

    let distance = graph.getPathDistance(path);
    document.getElementById(headlineId).innerText = headlineprefix + distance + " length"; 
}

//Only show point
function showPoints(graph, canvasId){
    var ctx = document.getElementById(canvasId).getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 1000);
    
    let ids = graph.getNodeIds();

    if(ids.length > 0) //Start
    {
        ctx.fillStyle = "red";        
        ctx.moveTo(graph.nodes[ids[0]].x, graph.nodes[ids[0]].y);
        ctx.fillRect(graph.nodes[ids[0]].x - 10, graph.nodes[ids[0]].y - 10, 20, 20);
    }

    ctx.fillStyle = "blue";
    for(let i = 1; i < ids.length; i++) //Rest
    {
        ctx.moveTo(graph.nodes[ids[i]].x, graph.nodes[ids[i]].y);
        ctx.fillRect(graph.nodes[ids[i]].x - 3, graph.nodes[ids[i]].y - 3, 6, 6);
    }
}