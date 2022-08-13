import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = (props) => {
    let [isvisible, setisvisible] = useState(false);
    let [sitename, set_sitename] = useState("");
    function change_site_title_wrt_responsive() {
        var newWidth = window.innerWidth;
        if (newWidth > 530) set_sitename("NLTM-LID - IIT Mandi and NIT Goa");
        else set_sitename("NLTM-LID");
    }
    window.addEventListener("resize", (event) => {
        change_site_title_wrt_responsive();
    });
    useEffect(() => {
        change_site_title_wrt_responsive();
    }, []);
    return (
        <nav id="menu" className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1"
                        onClick={() => setisvisible(!isvisible)}
                    >
                        {" "}
                        <span className="sr-only">Toggle navigation</span>{" "}
                        <span className="icon-bar"></span>{" "}
                        <span className="icon-bar"></span>{" "}
                        <span className="icon-bar"></span>{" "}
                    </button>
                    <a className="navbar-brand page-scroll" href="#page-top">
                        {sitename}
                    </a>{" "}
                </div>

                <div
                    className={
                        (isvisible ? "" : "collapse") + " navbar-collapse"
                    }
                    id="bs-example-navbar-collapse-1"
                >
                    <ul className="nav navbar-nav navbar-right">
                        <li onClick={auto_closenavbar_on_mobile}>
                            <Link className="page-scroll" to="/home">
                                Home
                            </Link>
                        </li>
                        <li onClick={auto_closenavbar_on_mobile}>
                            <Link to="/about">Team</Link>
                        </li>

                        <li onClick={auto_closenavbar_on_mobile}>
                            <Link
                                to="/demo"
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
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
    function auto_closenavbar_on_mobile() {
        setisvisible(false);
    }
};
