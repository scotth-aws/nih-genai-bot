import {
  SideNavigation,
  SpaceBetween,
  TextContent,
  Link,
  Header,
  Box,
} from "@cloudscape-design/components";
import "./Navigation.css";
import React, { useEffect, useState } from "react";

const Navigation = (current_user) => {
  const [NavigationItems, setNavigationItems] = useState([]);
  const [grant, setGrant] = useState("");
  const [awardedAbstract, setAwardedAbstract] = useState("");
  const [customerLinks, setCustomerLinks] = useState([]);
  const setNavBar = (id) => {
    console.log(' setNavBar useEffect ' + id);

    let navigation_items = [];

    navigation_items.push({
      type: "section",
      text: "User logged in",
      expanded: true,
      items: [
        {
          type: "link",
          text: "username " + current_user.user.username,
          href: "#",
        },
      ],
    });
    navigation_items.push({
      type: "section",
      text: "NIH Grant Search",
      expanded: true,
      items: [{ type: "link", text: "Search", href: "/Home" }],
    });

    navigation_items.push({
      type: "section",
      text: "NIH Reporter API",
      expanded: true,
      items: [{ type: "link", text: "Add to Context", href: "/NIHR" }],
    });

    setNavigationItems(navigation_items);
  };

  useEffect(() => {
    setNavBar("");
    setGrant("NOT-AG-23-037");
    setAwardedAbstract("HSR-3 Healthcare Informatics[HSR3]");
  }, []);

  return (
    <div className="navigation">
      <SpaceBetween direction="vertical" size="s">
        <TextContent>
          
         <h2><center> NIH Grant Assistant</center></h2> 
        </TextContent>
        <SpaceBetween direction="vertical" size="s"></SpaceBetween>

        <SideNavigation activeHref={0} items={NavigationItems} />
        

        <TextContent><h3><center><font color="blue">Context Progess</font></center></h3></TextContent>
        <TextContent><h5><center><font color="black">Grant Opportunity: </font></center></h5></TextContent>
        <TextContent><h5><center><font color="green">{grant} </font></center></h5></TextContent>
        <TextContent><h5><center><font color="black">Awarded Grant Abstract: </font></center></h5></TextContent>
        <TextContent><h5><center><font color="green"> {awardedAbstract} </font></center></h5></TextContent>
        <TextContent><h5><center><font color="black">Customer Docs:  </font></center></h5></TextContent>
        <TextContent><h5><center><font color="green"> </font></center></h5></TextContent>
        <TextContent><h5><center><font color="black">NIH Application Best Practices:  </font></center></h5></TextContent>
        <center><Link external href="https://grants.nih.gov/grants/how-to-apply-application-guide/format-and-write/write-your-application.htm">NIH Link</Link></center>
      </SpaceBetween>
    </div>
  );
};

export default Navigation;
