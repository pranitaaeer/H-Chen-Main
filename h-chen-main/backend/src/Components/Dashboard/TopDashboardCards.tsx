"use client";

import { capitalizeHeader, formatEarnings } from "@/lib/utils";
// import { TopDashboardCardsData } from "@/Data/Dashboard";
import Link from "next/link";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Box, MessageSquare, Navigation, Users } from "react-feather";
import { Card, CardBody, Col, Media } from "reactstrap";



const TopDashboardCards = ({ collectionsLength }: { collectionsLength: any }) => {
  

  const TopDashboardCardsData = [
    {
      id: 1,
      type: "earnings",
      bgColor: "bg-warning",
      count: collectionsLength?.totalSales || 0, //6659,
      label: "Total",
      icon: <Navigation className="font-warning" />,
      href: "/en/dashboard",
    },
    {
      id: 2,
      type: "products",
      bgColor: "bg-secondary",
      icon: <Box className="font-secondary" />,
      count: collectionsLength?.products || 0, //6659,
      label: "Total",
      href: "/en/products/digital/digital-product-list",
    },
    {
      id: 3,
      type: "orders",
      bgColor: "bg-primary",
      icon: <MessageSquare className="font-primary" />,
      count: collectionsLength?.orders || 0, //6659,
      label: "Total",
      href: "/en/sales/orders",
    },
    {
      id: 4,
      type: "users",
      bgColor: "bg-danger",
      icon: <Users className="font-danger" />,
      count: collectionsLength?.users || 0, //6659,
      label: "Total",
      href: "/en/users/list-user",
    },
  ];

  return (
    <>
      {TopDashboardCardsData.map((item, i) => (
        <Col key={i} xl="3 xl-50" md="6">
          <Link href={item.href} className="text-decoration-none">
            <Card className=" o-hidden widget-cards">
              <CardBody className={item.bgColor}>
                <Media className="static-top-widget row">
                  <div className="icons-widgets col-4">
                    <div className="align-self-center text-center">
                      {item.icon}
                    </div>
                  </div>
                  <Media body className="col-8">
                    <span className="m-0">{capitalizeHeader(item.type)}</span>
                    <h3 className="mb-0">
                      {item.type === "earnings" && "₹"}
                      <CountUp
                        className="counter"
                        end={
                          item.type === "earnings"
                            ? formatEarnings(item.count as number)
                            : (item.count as number)
                        }
                      />
                      {/* {item.type === "earnings" && "K"} */}
                      <small> {item.label}</small>
                    </h3>
                  </Media>
                </Media>
              </CardBody>
            </Card>
          </Link>
        </Col>
      ))}
    </>
  );
};

export default TopDashboardCards;
