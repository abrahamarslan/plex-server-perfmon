import React from "react";
import moment from "moment";
function Platform(props) {
    return (
        <div className="col-sm-3 col-sm-offset-1 cpu-info">
            <h3>Operating System</h3>
            <div className="widget-text">{props.platformData.osType}</div>
            <h3>Time Online</h3>
            <div className="widget-text">{moment.duration(props.platformData.osUptime).humanize()}</div>
            <h3>Processor Information</h3>
            <div className="widget-text"><strong>Type:</strong> {props.platformData.cpuModel}</div>
            <div className="widget-text"><strong>Number of Cores:</strong> {props.platformData.cpuCores}</div>
            <div className="widget-text"><strong>Clock Speed:</strong> {props.platformData.cpuClockSpeed}</div>
        </div>
    );
}
export default Platform;
