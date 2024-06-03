import { Request, Response } from "express";
import { ClientParams } from "../../types/ClientTypes";
import os from "os";
import si, { baseboard, chassis, cpuCache, cpuCurrentSpeed, cpuFlags, currentLoad, fullLoad, memLayout } from "systeminformation";
import byteToSize from "../utils/byteToSize";;

async function SystemInfoController(req: Request, res: Response, client: ClientParams): Promise<Response | void> {
    return res.json({
        version: (si.version()),
        system: {
            ...(await si.system())
        },
        bios: {
            ...(await si.bios())
        },
        baseboard: {
            ...(await si.baseboard())
        },
        chassis: {
            ...(await si.chassis())
        },
        time: {
            ...(si.time())
        },
        osInfo: {
            ...(await si.osInfo())
        },
        versions: {
            ...(await si.versions())
        },
        shell: (await si.shell()),
        uuid: (await si.uuid()),
        cpu: {
            ...(await si.cpu())
        },
        cpuFlags: (await si.cpuFlags()),
        cpuCache: {
            ...(await si.cpuCache())
        },
        cpuCurrentSpeed: {
            ...(await si.cpuCurrentSpeed())
        },
        cpuTemperature: {
            ...(await si.cpuTemperature())
        },
        currentLoad: {
            ...(await si.currentLoad())
        },
        fullLoad: (await si.fullLoad()),
        mem: {
            ...(await si.mem())
        },
        memLayout: {
            ...(await si.memLayout())
        },
        battery: {
            ...(await si.battery())
        },
        graphics: {
            ...(await si.graphics())
        },
        fsSize: {
            ...(await si.fsSize())
        },
        fsOpenFiles: {
            ...(await si.fsOpenFiles())
        },
        blockDevices: {
            ...(await si.blockDevices())
        },
        fsStats: {
            ...(await si.fsStats())
        },
        disksIO: {
            ...(await si.disksIO())
        },
        diskLayout: {
            ...(await si.diskLayout())
        },
        networkInterfaceDefault: (await si.networkInterfaceDefault()),
        networkGatewayDefault: (await si.networkGatewayDefault()),
        networkInterfaces: {
            ...(await si.networkInterfaces())
        },
        networkStats: {
            ...(await si.networkStats())
        },
        networkConnections: {
            ...(await si.networkConnections())
        },
        inetLatency: (await si.inetLatency()),
        wifiNetworks: {
            ...(await si.wifiNetworks())
        },
        wifiInterfaces: {
            ...(await si.wifiInterfaces())
        },
        wifiConnections: {
            ...(await si.wifiConnections())
        },
        users: {
            ...(await si.users())
        },
        processes: {
            ...(await si.processes())
        },
        dockerInfo: {
            ...(await si.dockerInfo())
        },
        dockerImages: {
            ...(await si.dockerImages())
        },
        dockerContainers: {
            ...(await si.dockerContainers())
        },
        dockerContainerStats: {
            ...(await si.dockerContainerStats())
        },
        dockerContainerProcesses: {
            ...(await si.dockerContainerProcesses())
        },
        dockerVolumes: {
            ...(await si.dockerVolumes())
        },
        dockerAll: {
            ...(await si.dockerAll())
        },
        vboxInfo: {
            ...(await si.vboxInfo())
        },
        printer: {
            ...(await si.printer())
        },
        usb: {
            ...(await si.usb())
        },
        audio: {
            ...(await si.audio())
        },
        bluetoothDevices: {
            ...(await si.bluetoothDevices())
        },
        getStaticData: {
            ...(await si.getStaticData())
        },
        getDynamicData: {
            ...(await si.getDynamicData())
        },
        getAllData: {
            ...(await si.getAllData())
        },  
    });
}


export {
    SystemInfoController,
}