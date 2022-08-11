export const Navigation = (props) => {
    return (
        <nav id="menu" className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1"
                    >
                        {" "}
                        <span className="sr-only">Toggle navigation</span>{" "}
                        <span className="icon-bar"></span>{" "}
                        <span className="icon-bar"></span>{" "}
                        <span className="icon-bar"></span>{" "}
                    </button>
                    <a className="navbar-brand page-scroll" href="#page-top">
                        NLTM
                    </a>{" "}
                </div>

                <div
                    className="collapse navbar-collapse"
                    id="bs-example-navbar-collapse-1"
                >
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="#features" className="page-scroll">
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="#about" className="page-scroll">
                                Team
                            </a>
                        </li>
                        <li>
                            <a
                                style={{
                                    color: "white",
                                    background: "#5ca9fb",
                                    borderRadius: "5px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                                className="btn page-scroll"
                            >
                                Demo&nbsp;&nbsp;&nbsp;{" "}
                                <i className="fa-solid fa-play"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
