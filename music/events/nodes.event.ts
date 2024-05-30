import { Node } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";

function NodesEvent(client: ClientParams): void {
    poru?.on("debug", (args: any) =>{
        
    });
    poru?.on("raw", (topic: string, args: any) =>{
        
    });
    poru?.on("nodeConnect", (node: Node) =>{
        
    });
    poru?.on("nodeDisconnect", (node: Node, event: any) =>{
        
    });
    poru?.on("nodeReconnect", (node: Node) =>{
       
    });
    poru?.on("nodeError", (node: Node, event: any) =>{
        
    });
}

export default NodesEvent;