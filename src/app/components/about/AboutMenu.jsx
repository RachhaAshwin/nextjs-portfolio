import React, { Component } from "react";
import AboutMenuItem from "./AboutMenuItem";
import AboutSubheading from "./AboutSubheading";
import Popup from "./Popup"; // Import the Popup component
import subheadingsData from "./subheadingsData";
const personalIcon = "/images/moebius-triangle.png";
const educationIcon = "/images/upgrade.png";
const careerIcon = "/images/triple-corn.png";
const chatIcon = "/images/chat-icon.png"; // Import your chat icon or use an appropriate path
import Image from "next/image"; // Import the Image component from Next.js

export default class AboutMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 1,
      activeSubheading: 1,
    };
  }

  handleMenuItemClick = (menuItem) => {
    this.setState({
      activeMenuItem: menuItem,
      activeSubheading: menuItem === 4 ? this.state.activeSubheading : 1
    });
  };

  handleSubheadingClick = (subheading) => {
    this.setState({
      activeSubheading: subheading,
    });
  };

  render() {
    const { activeMenuItem, activeSubheading } = this.state;
    const menuItems = ["PERSONAL", "CAREER", "EDUCATION"];
    const activeMenuTitle = menuItems[activeMenuItem - 1];

    const activeMenuIcon =
      activeMenuTitle === "PERSONAL"
        ? personalIcon
        : activeMenuTitle === "EDUCATION"
        ? educationIcon
        : activeMenuTitle === "CAREER"
        ? careerIcon
        : chatIcon;

    const isChatActive = activeMenuItem === 4;
    const subheadings = subheadingsData[activeMenuItem];

    return (
      <section className="text-white bg-[#121212] h-1000 p-4 rounded-md overflow-y-auto" id="about">
        <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
          <div className="menu space-y-4">
            {menuItems.map((item, index) => (
              <AboutMenuItem
                key={index}
                title={item}
                active={activeMenuItem === index + 1}
                onClick={() => this.handleMenuItemClick(index + 1)}
                className="bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 px-4 py-2 rounded-md transition duration-300"
              />
            ))}
          </div>
          <div className="mt-4 md:mt-0 text-left flex flex-col h-full overflow-y-auto max-h-96">
            <div className="icon-title-container mb-4">
              <Image src={activeMenuIcon} alt={activeMenuTitle} width={50} height={50} className="icon" />
              <h2 className="text-4xl font-bold text-white mt-2">{activeMenuTitle}</h2>
            </div>
            {subheadings.map((subheading, index) => (
              <AboutSubheading
                key={index}
                title={subheading.title}
                content={subheading.content}
                active={activeSubheading === index + 1}
                onClick={() => this.handleSubheadingClick(index + 1)}
                menuItem={activeMenuItem}
              />
            ))}
          </div>
        </div>
      </section>
    );


  }
}