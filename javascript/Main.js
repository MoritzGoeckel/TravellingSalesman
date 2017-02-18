let graph = new Graph();
let ongoingGenetic = undefined;

window.onload = function(){ 
    let canvas = document.getElementById("points_canvas");
    showPoints(undefined, "points_canvas");

    canvas.addEventListener("mousedown", function(event){
        graph.addNode(event.offsetX, event.offsetY, newId());
        showPoints(graph, "points_canvas");

        if(graph.getNodeIds().length > 1)
        {
            if(ongoingGenetic != undefined)
                clearInterval(ongoingGenetic);

            ongoingGenetic = generatePathGenetic(graph);
            generatePathNearestNeighbour(graph);
        }

    }, false);
};