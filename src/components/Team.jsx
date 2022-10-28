export const Team = (props) => {
    return (
        <div id="team" className="text-center" style={{ marginTop: "40px" }}>
            <div className="container">
                <div
                    className="col-md-8 col-md-offset-2 section-title"
                    style={{ marginBottom: "0" }}
                >
                    <h2>Meet the Team</h2>
                </div>
            </div>

            {props.data &&
                props.data.map((each) => (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <h3>{each.title}</h3>
                        <section
                            style={{
                                width: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {each.people.map((person) => (
                                <div
                                    key={`${person.name}-${person.job}`}
                                    className="col-md-3 col-sm-6 team"
                                >
                                    <div className="thumbnail">
                                        <div className="team-img">
                                            <img src={person.img} alt="..." />
                                        </div>
                                        <div className="caption">
                                            <h4>{person.name}</h4>
                                            <p>{person.job}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                ))}
        </div>
    );
};
