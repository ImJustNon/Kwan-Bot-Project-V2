import { Node } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";

function NodesEvent(client: ClientParams): void {
    poru?.on("debug", (args: any) =>{
        
    });
    poru?.on("raw", (topic: string, args: any) =>{
        
    });
    poru?.on("nodeConnect", (node: Node) =>{
        console.log(`[Nodes] Node ${node.name}: Ready!`);
    });
    poru?.on("nodeDisconnect", (node: Node, event: any) =>{
        console.log(`[Nodes] Node ${node.name}: Disconnected`);
    });
    poru?.on("nodeReconnect", (node: Node) =>{
       console.log(`[Nodes] Node ${node.name} is reconnecting`);
    });
    poru?.on("nodeError", (node: Node, event: any) =>{
        console.log(`[Nodes] Node ${node.name} had an error: ${event}`);
    });
}

export default NodesEvent;