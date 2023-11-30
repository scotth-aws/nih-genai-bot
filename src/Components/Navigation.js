import {
  SideNavigation,
  SpaceBetween,
  Badge,
  Container,
  ButtonDropdown,
  Box,
} from "@cloudscape-design/components";
import React, { useEffect, useState } from "react";




const Navigation = (current_user) => {
  const [NavigationItems, setNavigationItems] = useState([]);
  const setNavBar = (id) => {
    //console.log(' setNavBar event ' + id);

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
    setNavBar("Life Sciences Research");
  }, []);

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container></Container>

      <SideNavigation activeHref={0} items={NavigationItems} />
    </SpaceBetween>
  );
};

export default Navigation;
