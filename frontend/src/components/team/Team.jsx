import React from "react";
import TeamMembers from "../teamMembers/TeamMembers"; 

export default function Team({ value, members }) {
    return (
        <div className="team-component">
            <h4>{value}</h4>
            <div className="team-members">
                {members && members.length > 0 ? (
                    members.map((member, index) => (
                        <TeamMembers key={index} name={member.name} role={member.role} />
                    ))
                ) : (
                    <p>Nessun membro trovato</p>
                )}
            </div>
        </div>
    );
}
