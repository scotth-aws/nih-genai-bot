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
  Cards,
  Grid,
} from "@cloudscape-design/components";

import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";

var selected = {};

const Content = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [grants, setGrants] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([{ Title: "" }]);
  const [submitDisabled, setSubmitDisabled] = React.useState(true);
  const [contextButtonDisabled, setContextButtonDisabled] =
    React.useState(true);
  const [sortDescending, setSortDescending] = React.useState(false);
  const navigate = useNavigate();
  const filteringTextChange = (detail) => {
    setFilteringText(detail);
    setSubmitDisabled(false);
  };
  const clearSearchText = (event) => {
    console.log("clearSearchText");
    setSubmitDisabled(true);
    setContextButtonDisabled(true);
    setFilteringText("");
    setGrants([]);
  };
  const submitSearch = (params) => {
    console.log("submitSearch");
    if (filteringText.length <= 1) {
      return;
    }
    searchNIHGrants();
  };
  function sortReleaseDate(detail) {
  

    if (!sortDescending) {
  
      setGrants(grants.sort((a, b) => {
        return new Date(b.Release_Date) - new Date(a.Release_Date); // ascending
      }));
      setSortDescending(true);
    } else {

      setGrants(grants.sort((a, b) => {
        return new Date(a.Release_Date) - new Date(b.Release_Date); // descending
      }));
      setSortDescending(false);
    }
  
  }

  async function searchNIHGrants() {
    try {
      const restOperation = get({
        apiName: "nihapi",

        path: "/search",

        options: {
          queryParams: {
            searchtext: filteringText,
          },
        },
      });

      const { body } = await restOperation.response;
      console.log("GET call succeeded");
      // consume as a string:
      //const str = await body.text();
      // OR consume as a blob:
      //const blob = await body.blob();
      // OR consume as a JSON:

      const json = await body.json();
      //console.log("GET Response " + JSON.stringify(json.hits.hits));
      let grantsArr = [];
      for (let i = 0; i < json.hits.hits.length; i++) {
        // TODO: hack to remove the special characters in Title
        //grantsArr[i] = json.hits.hits[i]._source;

        grantsArr[i] = {
          Title:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[0]
            ],
          Release_Date:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[1]
            ],
          Expired_Date:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[2]
            ],
          Activity_Code:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[3]
            ],

          Organization:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[4]
            ],
          Parent_Organization:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[5]
            ],
          Participating_Orgs:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[6]
            ],
          Document_Number:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[7]
            ],
          Document_Type:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[8]
            ],
          Clinical_Trials:
            json.hits.hits[i]._source[
              Object.keys(json.hits.hits[i]._source)[9]
            ],
          URL: json.hits.hits[i]._source[
            Object.keys(json.hits.hits[i]._source)[10]
          ],
        };

        //console.log(grantsArr[i]);
      }

      setGrants(grantsArr);
    } catch (e) {
      console.log("GET call failed: ", e);
    }
  }

  return (
    <div className="main">
      <Container
        fitHeight
        header={
          <Header
            actions={
              <SpaceBetween direction="horizontal" textAlign="center" size="m">
                <TextFilter
                  filteringText={filteringText}
                  filteringPlaceholder="Search NIH grants"
                  filteringAriaLabel="Filter instances"
                  onChange={({ detail }) =>
                    filteringTextChange(detail.filteringText)
                  }
                />
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
            Search Funding Opportunity Announcements
          </Header>
        }
      >
        <div className="search">
          <SpaceBetween direction="horizontal" textAlign="center" size="l">
            <Container fitHeight>
              <Table
                variant="borderless"
                onSelectionChange={({ detail }) => {
                  console.log(detail.selectedItems);
                  setSelectedItems(detail.selectedItems);
                  setContextButtonDisabled(false);
                }}
                selectedItems={selectedItems}
                ariaLabels={{
                  selectionGroupLabel: "Items selection",
                  allItemsSelectionLabel: ({ selectedItems }) =>
                    `${selectedItems.length} ${
                      selectedItems.length === 1 ? "item" : "items"
                    } selected`,
                  itemSelectionLabel: ({ selectedItems }, item) => item.Title,
                }}
                columnDefinitions={[
                  {
                    id: "Title",
                    header: "Title",
                    cell: (e) => e.Title,
                    //sortingField: "Title",
                    width: "350",
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
                  {
                    id: "Expired_Date",
                    header: "Expired Date",
                    cell: (e) => e.Expired_Date,
                  },
                  {
                    id: "Activity_Code",
                    header: "Activity Code",
                    cell: (e) => e.Activity_Code,
                  },
                  {
                    id: "Parent_Organization",
                    header: "Parent_Organization",
                    cell: (e) => e.Parent_Organization,
                  },
                  {
                    id: "Document_Number",
                    header: "Document Number",
                    cell: (e) => e.Document_Number,
                  },
                  {
                    id: "Clinical_Trials",
                    header: "Clinical Trials",
                    cell: (e) => e.Clinical_Trials,
                  },
                ]}
                items={grants}
                loadingText="Loading resources"
                resizableColumns
                wrapLines
                selectionType="single"
                sortingColumn="Release_Date"
                onSortingChange={({ detail }) => {
                  sortReleaseDate(detail);
                  //console.log(detail);
                }}
                empty={
                  <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                  >
                    <b>No matches for Search text</b>
                  </Box>
                }
                pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
              />
            </Container>
          </SpaceBetween>
        </div>
      </Container>
      <div className="cart">
        <Container fitHeight>
          <SpaceBetween size="l"></SpaceBetween>
          <Button onClick={event => navigate("/NIHR")}  disabled={contextButtonDisabled} variant="primary">
            Use this Grant Opportunity to gather more context{" "}
          </Button>
        </Container>
      </div>
    </div>
  );
};

const SideHelp = () => (
  <HelpPanel header={<h2>Side Help</h2>}>
    <SpaceBetween size="m"></SpaceBetween>
    <hr />
  </HelpPanel>
);

function Home({ signOut, user }: WithAuthenticatorProps) {
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

export default withAuthenticator(Home);
