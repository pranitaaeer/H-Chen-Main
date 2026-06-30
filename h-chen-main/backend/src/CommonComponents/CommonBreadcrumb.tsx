import { capitalizeHeader } from "@/lib/utils";
import { CommonBreadcrumbType } from "@/Types/Layout";
import Link from "next/link";
import { Home } from "react-feather";
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "reactstrap";

const CommonBreadcrumb = ({
  title,
  parent,
  element,
  loading,
  fetchCollectionsLength,
}: CommonBreadcrumbType) => {
  return (
    <Container fluid>
      <div className="page-header">
        <Row>
          <Col lg="12">
            <div className="d-flex justify-content-between align-items-center w-full" style={{width: "100%"}}>
              <div className="page-header-left d-flex flex-column gap-2 align-items-start">
                <h3>{capitalizeHeader(title)}</h3>
                <Breadcrumb className=" pull-right">
                  <BreadcrumbItem>
                    <Link href="/en/dashboard">
                      <Home />
                    </Link>
                  </BreadcrumbItem>
                  {parent && (
                    <BreadcrumbItem>
                      <Link
                        href={`/en/${parent}`}
                        style={{ textDecoration: "none" }}
                      >
                        {capitalizeHeader(parent)}
                      </Link>
                    </BreadcrumbItem>
                  )}
                  <BreadcrumbItem className="active">
                    {capitalizeHeader(title)}
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
              <div className="page-header-right">
                <button onClick={fetchCollectionsLength} style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                  transition: "background-color 0.3s ease",
                }}>{loading ? "Loading..." : "Refresh Dashboard"}</button>
              </div>
            </div>
          </Col>
          {/* <Col lg="6">{element}</Col> */}
        </Row>
      </div>
    </Container>
  );
};

export default CommonBreadcrumb;
