const grid_items=1500
const items_per_line=60
const obstacles_per_line=20
let user_start=false
let user_end=false


type Cell =HTMLElement | null | undefined
type Parentiality= {
parent: HTMLElement | null | undefined
current: HTMLElement | null | undefined
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

function handleStartingNodes(){
    if(!user_start){
        for (let i=0;i<grid_items;i++){
            let item=document.getElementById(i.toString());
            if(item?.style.backgroundColor!=='green'){
                item?.addEventListener('click',()=>{
                    item?.classList.add('start');
                })
            }

    }
    user_start = true;
    return ;
}
    if(!user_end){
        for (let i=0;i<grid_items;i++){
            let item=document.getElementById(i.toString());
            if(item?.style.backgroundColor!=='green'){
                item?.addEventListener('click',()=>{
                    item?.classList.add('end');
                })
            }
        }
        user_end=true;
        return;
    }
    if(user_start && user_end){
        for(let i=0;i<grid_items;i++){
            let item=document.getElementById(i.toString());
            item?.removeEventListener('click',()=>{});
        }
    }
}

function addNodes(){
    for(let i=0;i<grid_items;i++){
        let item=document.getElementById(i.toString());
        if (!item) continue
        const currentColor = getComputedStyle(item).backgroundColor;
        item?.addEventListener('click',()=>{
            if(currentColor!=="rgb(0, 128, 0)"){
                if(!user_start){
                    item.classList.add('start');
                    user_start=true;
                    return;
                }
                if(user_start && !user_end){
                    item.classList.add('end');
                    user_end=true;
                    const button = document.getElementById('bfs') as HTMLButtonElement;
                    button.addEventListener('click', BFS);
                    return;
                }
        }
        })

    }
}

function BFS(){
    console.log('BFS')
    let visited:Parentiality[] = [];
    //for fast retrieval
    let visitedSet = new Set<Cell>();
    let queue=[]
    let path: Cell[] = []
    let rel=[];
    let parent;

    //pushing starting item
    for(let i=0;i<grid_items;i++){
        let item=document.getElementById(i.toString());
        if(item?.classList.contains('start')){
            queue.push(item);
        }
    }
    visited.push(
        {
            parent: null,
            current: queue[0]
        }
    )
    visitedSet.add(queue[0])
    while(queue.length>0){
        let neighbors=[]
        const current=queue.shift();
        if(rel.length>0){
            for(let i=0;i<rel.length;i++){
                if(current && rel[i].neighbors.includes(current)){
                    parent=rel[i].parent;
                    break;
                }
        }
        visited.push({
            parent: parent,
            current: current
        })
    }
        if (current?.classList.contains('end')){
            break;
        }
        visitedSet = new Set(visited.map(v => v.current))

        let id = parseInt(current?.id || '');
        if (!isNaN(id) && id - items_per_line >= 0) {
            neighbors.push(document.getElementById((id-60).toString()));
        }
        if (!isNaN(id) && id + items_per_line <= grid_items-1) {
            neighbors.push(document.getElementById((id+60).toString()));
        }
        if (!isNaN(id) && id%items_per_line!=0) {
            neighbors.push(document.getElementById((id-1).toString()));
        }
        if (!isNaN(id) && (id+1)%items_per_line!=0) {
            neighbors.push(document.getElementById((id+1).toString()));
        }
        for(let i=0;i<neighbors.length;i++){
            if (!neighbors[i]?.classList.contains('obstacle') && !neighbors[i]?.classList.contains('start') && !visitedSet.has(neighbors[i])) {
                queue.push(neighbors[i]);
            }
        }
       rel.push({
        parent:current,
        neighbors:neighbors
       })
        
    }
    console.log(rel)
    //finding path
    let i=visited.length-1  
    while(visited[i].parent){
        console.log(`Parent: ${visited[i].parent?.id} of current: ${visited[i].current?.id}`);
        path.push(visited[i].parent);
        i=visited.findIndex(v => v.current === visited[i].parent);
    }
    //adding classes
    for(let i=1;i<visited.length-1;i++){
        visited[i].current?.classList.add('visited')
    }
    for(let i=0;i<path.length-1;i++){
        path[i]?.classList.add('path')
    }
}

createGrid();
addObstacles();
addNodes();


