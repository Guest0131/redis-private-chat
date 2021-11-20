import React from "react";

export const Message = (props) => {
    var offset = "col s8";
    if (props.me) {
        offset = "col s8 offset-s4";
    }
    return (
        <div className="row">
            <div className={offset}>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">
                            {props.author}
                        </span>
                        <p>{props.text}</p>
                    </div>
                    <div className="card-action">
                        <span className="orange-text">TTL : {props.time - Math.round(new Date().getTime() / 1000)} </span>
                    </div>
                </div>
            </div>
        </div>
    );
}