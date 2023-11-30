import React, { useState, useEffect } from "react";
import "./index.css";
import { get } from "aws-amplify/api";
import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import {
  AppLayout,
  HelpPanel,
  Table,
  Box,
  SpaceBetween,
  Button,
  TextFilter,
  Header,
  Pagination,
  Link,
  Container,
  ExpandableSection,
  ContentLayout,
} from "@cloudscape-design/components";

import Navigation from "../Navigation";

const Content = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [grants, setGrants] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([{ Title: "" }]);
  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  const filteringTextChange = (detail) => {
    setFilteringText(detail);
  };
  const clearSearchText = (event) => {
    console.log("clearSearchText");
    setFilteringText("");
    setSelectedItems([]);
    setGrants([]);
  };
  const submitSearch = (params) => {
    console.log("submitSearch");
    setSelectedItems([]);
    if (filteringText.length <= 1) {
      return;
    }
    
  };

  

  return (
    <div class="main">
      <ContentLayout disableOverlap>
        <Container
          fitHeight
          header={
            <Header variant="h2" description="">
              NIH Reporter
            </Header>
          }
        >
          <div class="search">
            <Container variant="stacked">
              
              <Table
                onSelectionChange={({ detail }) =>
                  setSelectedItems(detail.selectedItems)
                }
                selectedItems={selectedItems}
                ariaLabels={{
                  selectionGroupLabel: "Items selection",
                  allItemsSelectionLabel: ({ selectedItems }) =>
                    `${selectedItems.length} ${
                      selectedItems.length === 1 ? "item" : "items"
                    } selected`,
                  itemSelectionLabel: ({ selectedItems }, item) => item.name,
                }}
                columnDefinitions={[
                  {
                    id: "Title",
                    header: "Title",
                    cell: (e) => e.Title,
                    sortingField: "Title",
                    isRowHeader: true,
                  },
                  {
                    id: "Release_Date",
                    header: "Release Date",
                    cell: (e) => e.Release_Date,
                    sortingField: "Release_Date",
                  },
                  {
                    id: "Organization",
                    header: "Organization",
                    cell: (e) => e.Organization,
                  },
                  {
                    id: "URL",
                    header: "URL",
                    cell: (e) => (
                      <Link external href={e.URL}>
                        Overview
                      </Link>
                    ),
                  },
                ]}
                items={grants}
                loadingText="Loading resources"
                resizableColumns
                wrapLines
                selectionType="single"
                empty={
                  <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                  >
                    <b>No matches for Search text</b>
                  </Box>
                }
                filter={
                  <TextFilter
                    filteringText={filteringText}
                    filteringPlaceholder="Search NIH grants"
                    filteringAriaLabel="Filter instances"
                    onChange={({ detail }) =>
                      filteringTextChange(detail.filteringText)
                    }
                  />
                }
                header={
                  <Header
                    actions={
                      <SpaceBetween
                        direction="horizontal"
                        textAlign="center"
                        size="m"
                      >
                        <Button
                          variant="primary"
                          disabled={submitDisabled}
                          onClick={(event) => submitSearch(event)}
                        >
                          Submit Search
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={(event) => clearSearchText(event)}
                        >
                          Clear search filter
                        </Button>
                      </SpaceBetween>
                    }
                  >
                    Search
                  </Header>
                }
                pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
              />
            </Container>
          </div>
        </Container>
      </ContentLayout>
    
    </div>
  );
};

const SideHelp = () => (
  <HelpPanel header={<h2>Side Help</h2>}>
    <SpaceBetween size="m"></SpaceBetween>
    <hr />
  </HelpPanel>
);

function NIHR({ signOut, user }: WithAuthenticatorProps) {
  useEffect(() => {}, []);

  const [lnavopen, setLnavopen] = useState(true);
  const [rnavopen, setRnavopen] = useState(false);

  const navChange = (detail) => {
    setLnavopen(detail.open);
  };
  const toolsChange = (detail) => {
    setRnavopen(detail.open);
  };

  return (
    <AppLayout
      disableContentPaddings={false}
      navigation={<Navigation user={user} />}
      content={<Content />}
      contentType="default"
      toolsOpen={rnavopen}
      toolsWidth={250}
      tools={<SideHelp />}
      navigationOpen={lnavopen}
      onNavigationChange={({ detail }) => navChange(detail)}
      onToolsChange={({ detail }) => toolsChange(detail)}
    />
  );
}

export default withAuthenticator(NIHR);
