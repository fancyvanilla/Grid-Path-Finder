const grid_items=1500
const items_per_line=60
const obstacles_per_line=20
let user_start=false
let user_end=false
let start_node:Cell;
let end_node:Cell;
const button = document.getElementById('bfs') as HTMLButtonElement;
const button2 = document.getElementById('dfs') as HTMLButtonElement;
const button3 = document.getElementById('astar') as HTMLButtonElement;
const clearButton=document.getElementById('clear') as HTMLButtonElement;


type Cell =HTMLElement | null | undefined

interface visitedNode {
    parent: Cell
    current: Cell
}

enum SerachType{
    BFS='BFS',
    DFS='DFS'
}

interface Stats{
    visited:number,
    time:string
}

function getNextNode(queue:Cell[],type:SerachType){
    if(type===SerachType.BFS){
        return queue.shift()
    }
    if(type===SerachType.DFS){
        return queue.pop()
    }
}

function createGrid(){
    const grid=document.getElementById('grid') as HTMLDivElement;
    for(let i=0;i<grid_items;i++){
        const item=document.createElement('div');
        item.classList.add('grid-item');
        item.id=i.toString();
        grid.appendChild(item);
    }
}

function addObstacles(){
    let lines=grid_items/items_per_line;
    let offset=0;
    for(let i=0;i<lines;i++){
        for(let j=0;j<obstacles_per_line;j++){
            let random=Math.floor(Math.random()*items_per_line)+offset;
            let item=document.getElementById(random.toString());
            item?.classList.add('obstacle');
        }
        offset+=items_per_line;
}
}

function addNodes(){
    for(let i=0;i<grid_items;i++){
        let item=document.getElementById(i.toString());
        if (!item) continue
        item?.addEventListener('click',()=>{
            if(!item.classList.contains('obstacle')){
                if(!user_start){
                    item.classList.add('start');
                    user_start=true;
                    start_node=item;
                    return;
                }
                if(user_start && !user_end && !item.classList.contains('start')){
                    item.classList.add('end');
                    user_end=true;
                    end_node=item;
                    button.addEventListener('click', () => FS(SerachType.BFS));
                    button2.addEventListener('click', () => FS(SerachType.DFS));
                    button3.addEventListener('click', () => AStar());
                    return;
                }
        }
        })

    }
}

function handleUI(){
    clearButton.addEventListener('click',()=>{
    clearGrid();
})
}

function getNeighbors(cell:Cell):Cell[]{
    let neighbors:Cell[]=[];
    let id = parseInt(cell?.id || '');
    if (!isNaN(id) && id - items_per_line >= 0) {
        neighbors.push(document.getElementById((id-items_per_line).toString()));
    }
    if (!isNaN(id) && id + items_per_line <= grid_items-1) {
        neighbors.push(document.getElementById((id+items_per_line).toString()));
    }
    if (!isNaN(id) && id%items_per_line!=0) {
        neighbors.push(document.getElementById((id-1).toString()));
    }
    if (!isNaN(id) && (id+1)%items_per_line!=0) {
        neighbors.push(document.getElementById((id+1).toString()));
    }
    return neighbors;
}

function displayNodes(visited_nodes:Cell[],path:Cell[]){
    for(const node of visited_nodes){
        if(node?.classList.contains('start')) continue;
        if(node?.classList.contains('end')) continue;
        node?.classList.add('visited')
    }
    for(const node of path){
        if(node?.classList.contains('start')) continue;
        node?.classList.add('path')
    }
    button.classList.add('hidden') 
    button2.classList.add('hidden')
    button3.classList.add('hidden')
}

function FS(type: SerachType){
    const start = performance.now();
    if(!start_node || !end_node) return;
    let visited:Map<string,visitedNode> = new Map();
    let queue:Cell[]=[]
    let path: Cell[]=[]
    let stats:Stats;
    queue.push(start_node);
    visited.set(start_node.id, {
        parent: null,
        current: start_node
    });
    while(queue.length>0){
        let neighbors:Cell[]=[]
        const current=getNextNode(queue,type);
        if (current?.classList.contains('end')){

            let node:visitedNode | undefined = visited.get(current.id);
            while(node?.parent){
                path.unshift(node.parent);
                node=visited.get(node.parent.id)
            }
            break;
        }
        neighbors=getNeighbors(current)

        for(const neighbor of neighbors){
            if (neighbor && !neighbor?.classList.contains('obstacle') && !visited.has(neighbor.id)) {
                visited.set(neighbor.id, {
                    parent: current,
                    current: neighbor
                });
                queue.push(neighbor);
            }
        } 
    }
    const end = performance.now();
    stats={
        visited:visited.size,
        time: (end-start).toFixed(2)+"ms"
    }
    console.log(stats);
    displayNodes(Array.from(visited.values()).map((node:visitedNode) => node.current),path)
}

function AStar(){
    const start = performance.now();
    if(!start_node || !end_node) return;
    let found=false
    let visited:Map<string,visitedNode> = new Map();
    let values:Map<string, Number> =new Map();
    let path:Cell[]=[];
    let current:Cell=start_node
    visited.set(start_node.id, {
        parent: null,
        current: current,
    });
    values.set(start_node.id,parseInt(end_node?.id || '0'));
    while(current && !found){
        let neighbors=getNeighbors(current)
        let min:Number = Number.POSITIVE_INFINITY;
        let min_key=null
        for(const neighbor of neighbors){
           if(!neighbor) continue;
            if(!neighbor?.classList.contains('obstacle') && !visited.has(neighbor.id)){
                visited.set(neighbor.id, {
                    parent: current,
                    current: neighbor
                })
                if(neighbor.classList.contains('end')){
                    let node:visitedNode | undefined = visited.get(neighbor.id)
                    while(node?.parent){             
                       path.unshift(node.parent)
                       node = visited.get(node.parent.id)
                   }
                   found=true;
                    break;
                };
                let current_h=Math.abs(parseInt(current?.id || '0') - parseInt(end_node?.id || '0')); 
                let f:Number = values.get(current.id)||0 - current_h + 1+ Math.abs(parseInt(neighbor?.id || '0') - parseInt(end_node?.id || '0'));
                values.set(neighbor.id,f)
        }
} 
        if(!found){
            for(const [key,value] of values){
                if(value < min){
                    min=value
                    min_key=key
                }
            }
            if (min_key !== null) {
                values.delete(min_key);
                current=document.getElementById(min_key.toString())        
            }
            else{
                console.log("No path found!")
                break;
            }
       }
        
}
   const end = performance.now();

   let stats:Stats={
    visited: visited.size,
    time:(end-start).toFixed(2)+"ms"
   } 
   console.log(stats)
   displayNodes(Array.from(visited.values()).map((node:visitedNode)=>node.current),path)  
}

function clearGrid(){
    start_node?.classList.remove('start');
    end_node?.classList.remove('end');
    start_node = null;
    end_node = null;
    user_start=false;
    user_end=false
    let visited_items=document.getElementsByClassName('visited');
    while(visited_items.length>0){
        visited_items[0].classList.remove('visited');
    }
    let path_items=document.getElementsByClassName('path');
    while(path_items.length>0){
        path_items[0].classList.remove('path');
    }
    button.classList.remove('hidden')
    button2.classList.remove('hidden')
    button3.classList.remove('hidden')
}

createGrid();
addObstacles();
addNodes();
handleUI()


