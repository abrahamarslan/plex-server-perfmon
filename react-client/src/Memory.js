import React from "react";
import drawCircle from "./utilities/canvas";
function Memory(props) {
    const {totalMemory, freeMemory, usedMemory,memoryUsage, memoryWidgetId} = props.memoryData;
    const canvas = document.querySelector(`.${props.memoryData.memoryWidgetId}`);
    drawCircle(canvas,memoryUsage*100);
    return (
        <div className="col-sm-3 mem">
            <h3>Memory Use</h3>
            <div className="canvas-wrapper">
                <canvas className={props.memoryData.memoryWidgetId} width="200" height="200"></canvas>
                <div className="mem-text">
                    {memoryUsage*100}%
                </div>
            </div>
            <div>
                Total Memory: {Math.floor(totalMemory/1073741824*100)/100} GBs
            </div>
            <div>
                Free Memory: {Math.floor(freeMemory/1073741824*100)/100} GBs
            </div>
        </div>
    )
}
export default Memory;
