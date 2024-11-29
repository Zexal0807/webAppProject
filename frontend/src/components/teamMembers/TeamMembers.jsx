import React from "react";

export default function TeamMembers({ name, role }) {
    return (
        <div className="team-member p-2 px-sm-4 py-sm-2">
            <h5>{name}</h5>
            <p>{role}</p>
        </div>
    );
}
