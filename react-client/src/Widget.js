import React, {Component} from "react";
import CPU from "./CPU";
import Memory from "./Memory";
import Platform from "./Platform";
class Widget extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        const {
            macAddress,
            osType,
            freeMemory,
            totalMemory,
            usedMemory,
            memoryUsage,
            cpus,
            cpuCores,
            cpuModel,
            cpuClockSpeed,
            cpuLoad,
            osUptime
        } = this.props.data;
        const cpuData = {cpuLoad};
        const memoryData = {totalMemory, freeMemory, usedMemory,memoryUsage};
        const platformData = {macAddress, osType, osUptime, cpuClockSpeed, cpuCores, cpuModel}
        return (
            <div>
                <h1>Widget</h1>
                <CPU cpuData={cpuData} />
                <Memory memoryData={memoryData} />
                <Platform platformData={platformData} />
            </div>
        );
    }
}
export default Widget;
