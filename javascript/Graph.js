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

    /*getPathTimetable(path){
        for(let i = 0; i < path.length - 1; i++)
        {
            this.getDistance(path[i], path[i + 1])
        }
        return distance;
    }*/

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