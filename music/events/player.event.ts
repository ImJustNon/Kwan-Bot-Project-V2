import { Player, Track } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";

function PlayerEvent(client: ClientParams): void {
    poru?.on("playerCreate", (player: Player) =>{
        // console.log("playerCreate");
    });
    poru?.on("playerUpdate", (player: Player) =>{
        // console.log("playerUpdate");
    });
    poru?.on("playerDestroy", (player: Player) =>{
        // console.log("playerDestroy");
    });
}


export default PlayerEvent;