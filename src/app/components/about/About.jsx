"use client"

import React, { Component } from "react";
//import Avatar from "../assets/avatar-image.png";
import AboutMenu from "./AboutMenu";

export default class About extends Component {
    
    render() {

        return (
            <>
                <div className="about-content">
                    <AboutMenu />
                </div>
            </>
        );
        
    }
}