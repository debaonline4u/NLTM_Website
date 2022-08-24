export const Features = (props) => {
    return (
        <div
            id="features"
            className="text-center"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11pt",
                maxWidth: "1200px",
            }}
        >
            <div className="container">
                <div
                    className="col-md-10 col-md-offset-1 section-title"
                    style={{ marginBottom: "0px" }}
                >
                    <h2>Features</h2>
                </div>
            </div>
            <div className="text text-left">
                {props.data && (
                    <>
                        <p>{props.data.para1}</p>
                        <br />
                        <p>{props.data.para2}</p>
                        <br />
                        <p>{props.data.para3.text}</p>
                        <ul className="list-group">
                            {props.data.para3.listitems.map((ele) => (
                                <li key={ele} className="list-group-item">
                                    <i className="fa-solid fa-circle"></i>
                                    &nbsp;&nbsp;&nbsp;
                                    {ele}
                                </li>
                            ))}
                        </ul>
                        {props.data.para4.map((ele) => (
                            <span key={ele.title}>
                                <h3>{ele.title}</h3>

                                <p>{ele.body}</p>
                            </span>
                        ))}
                        <div className="container">
                            <div
                                className="col-md-10 col-md-offset-1 section-title text-center"
                                style={{
                                    paddingTop: "40px",
                                    marginBottom: "0px",
                                }}
                            >
                                <h2>{props.data.para5.title}</h2>
                            </div>
                        </div>

                        <p>{props.data.para5.body}</p>
                    </>
                )}
            </div>
        </div>
    );
};
