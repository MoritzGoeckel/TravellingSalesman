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

    showPath(pathNodes, graph, "canvasNN", "nn_h1", "Nearest Neighbour Method: ");      
}