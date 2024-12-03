import React from "react";

export default function DayTimes({ day, startTime, endTime }) {
    return (
        <div className="day-times">
            <p>{day} {startTime} - {endTime}</p>
        </div>
    );
}
