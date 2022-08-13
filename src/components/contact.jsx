import React from "react";

export const Contact = (props) => {
    return (
        <div style={{ width: "100%" }}>
            <div id="contact">
                <div className="container">
                    <div className="contact-info">
                        <div className="contact-item">
                            <h3>Contact Info</h3>
                            <p>
                                <span>
                                    <i className="fa fa-map-marker"></i> Address
                                </span>
                                {props.data ? (
                                    <span>
                                        {props.data.address[0]}
                                        &nbsp;&nbsp;&nbsp;(or)&nbsp;&nbsp;&nbsp;
                                        {props.data.address[1]}
                                    </span>
                                ) : (
                                    "loading"
                                )}
                            </p>
                        </div>
                        <div className="contact-item">
                            <p>
                                <span>
                                    <i className="fa fa-phone"></i> Phone
                                </span>{" "}
                                {props.data ? (
                                    <>
                                        <a href={"tel:" + props.data.phone[0]}>
                                            {props.data.phone[0]}
                                        </a>
                                        &nbsp;&nbsp;&nbsp;(or)&nbsp;&nbsp;&nbsp;
                                        <a href={"tel:" + props.data.phone[1]}>
                                            {props.data.phone[1]}
                                        </a>
                                    </>
                                ) : (
                                    "loading"
                                )}
                            </p>
                        </div>
                        <div className="contact-item">
                            <p>
                                <span>
                                    <i className="fa fa-solid fa-paper-plane"></i>{" "}
                                    Email
                                </span>{" "}
                                {props.data ? (
                                    <>
                                        <a
                                            href={
                                                "mailto:" + props.data.email[0]
                                            }
                                        >
                                            {props.data.email[0]}
                                        </a>
                                        &nbsp;&nbsp;&nbsp;(or)&nbsp;&nbsp;&nbsp;
                                        <a
                                            href={
                                                "mailto:" + props.data.email[1]
                                            }
                                        >
                                            {props.data.email[1]}
                                        </a>
                                    </>
                                ) : (
                                    "loading"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
