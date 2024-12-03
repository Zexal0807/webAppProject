import React from "react";
import TeamMembers from "../teamMembers/TeamMembers";

export default function TeamsGrid({ teams }) {
    return (
        <div className="container">
            <div className="row">
                {teams.map((team, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-4">
                        <div className="team-component border p-3 rounded shadow-sm">
                            <h4 className="mb-3">{team.value}</h4>
                            <div className="team-members">
                                {team.members && team.members.length > 0 ? (
                                    team.members.map((member, index) => (
                                        <TeamMembers key={index} name={member.name} role={member.role} />
                                    ))
                                ) : (
                                    <p>Nessun membro trovato</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
