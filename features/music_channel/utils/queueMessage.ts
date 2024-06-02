import { Player } from "poru";
import { ClientParams } from "../../../types/ClientTypes";
import { convertTime } from "../../../utils/convertTime";

async function queueMessage(client: ClientParams, player: Player){
    let defaultQueueMessage: string = `**คิวเพลง: [${player.queue.length}]**\n`;
    let finalQueueMessage: string = "";

    for(let i: number = 0; i < player.queue.length; i++) {
        defaultQueueMessage += `> \`${i + 1})\` [${convertTime(player.queue[i].info.length)}] - ${player.queue[i].info.title}\n`;
        if(defaultQueueMessage.length >= 2000){
            break;
        }
        finalQueueMessage = defaultQueueMessage;
    }

    if(finalQueueMessage.length === 0){
        return finalQueueMessage = defaultQueueMessage + "ยังไม่รายการคิว";
    }
    else{
        return finalQueueMessage;
    }
}



export default queueMessage;