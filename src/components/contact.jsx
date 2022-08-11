import React from "react";

export const Contact = (props) => {
    return (
        <div>
            <div id="contact">
                <div className="container">
                    <div className="col-md-3 col-md-offset-1 contact-info">
                        <div className="contact-item">
                            <h3>Contact Info</h3>
                            <p>
                                <span>
                                    <i className="fa fa-map-marker"></i> Address
                                </span>
                                {props.data ? props.data.address : "loading"}
                            </p>
                        </div>
                        <div className="contact-item">
                            <p>
                                <span>
                                    <i className="fa fa-phone"></i> Phone
                                </span>{" "}
                                {props.data ? props.data.phone : "loading"}
                            </p>
                        </div>
                        <div className="contact-item">
                            <p>
                                <span>
                                    <i className="fa fa-envelope-o"></i> Email
                                </span>{" "}
                                {props.data ? props.data.email : "loading"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
