import React from "react";
import DayTimes from "./DayTimes";

export default function Times({ value, tableTimes }) {
    return (
        <div className="times">
            <p><b>{value}</b></p>
            <div className="day-times-list">
                {tableTimes.map((time, index) => (
                    <DayTimes key={index} day={time.day} startTime={time.startTime} endTime={time.endTime} />
                ))}
            </div>
        </div>
    );
}
