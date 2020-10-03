import React, {Component} from "react";
import CPU from "./CPU";
import Memory from "./Memory";
import Platform from "./Platform";
import './widget.css';
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
            osUptime,
            isActive
        } = this.props.data;
        const cpuWidgetId = `cpu-widget-${macAddress.replace(/:\s*/g,'-')}`;
        const memoryWidgetId = `mem-widget-${macAddress.replace(/:\s*/g,'-')}`;
        const cpuData = {cpuLoad, cpuWidgetId};
        const memoryData = {totalMemory, freeMemory, usedMemory,memoryUsage, memoryWidgetId};
        const platformData = {macAddress, osType, osUptime, cpuClockSpeed, cpuCores, cpuModel}
        let isOffline = '';
        if(!isActive) {
            isOffline = <div className="not-active">Offline</div>
        }
        return (
            <div className="widget col-sm-12">
                {isOffline}
                <CPU cpuData = {cpuData} />
                <Memory memoryData = {memoryData} />
                <Platform platformData={platformData} />
            </div>
        );
    }
}
export default Widget;
