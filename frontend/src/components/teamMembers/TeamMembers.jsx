import React from "react";

export default function TeamMembers({ name, role }) {
    return (
        <div className="team-member">
            <h5>{name}</h5>
            <p>{role}</p>
        </div>
    );
}
