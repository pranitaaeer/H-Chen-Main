import { Fragment, useEffect, useState } from "react";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
// import dynamic from "next/dynamic";
import { Container, Row } from "reactstrap";
import LatestOrders from "./LatestOrders";
import TopDashboardCards from "./TopDashboardCards";
// import BuySell from "./BuySell";
// import DailyDeposits from "./DailyDeposits";
// import EmployeeStatus from "./EmployeeStatus";
// import ProductCart from "./ProductCart";
// import SalesStatus from "./SalesStatus";
// import TotalCash from "./TotalCash";
// import TotalPurchase from "./TotalPurchase";
// import TotalSales from "./TotalSales";
// const MarketValue = dynamic(() => import("./MarketValue"), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  ArcElement,
  Filler,
  RadialLinearScale
);

interface CollectionsLengthValues {
  products: number;
  orders: number;
  users: number;
  totalSales: number;
}

const DashboardContainer = () => {
  const [collectionsLength, setCollectionsLength] =
      useState<CollectionsLengthValues | null>(null);
      const [loading, setLoading] = useState(false)
  
      const fetchCollectionsLength = async () => {
        setLoading(true)
        try {
          // setLoading(true);
          const res = await fetch(`/api/dashboard/collections`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
  
          if (!res.ok) {
            throw new Error("Failed to fetch collections");
          }
  
          const data = await res.json();
          // console.log("myDatares:", data);
          setCollectionsLength(data);
        } catch (error) {
          console.error("Error fetching collections:", error);
        } finally {
          setLoading(false);
        }

        // } finally {
        //   // setLoading(false);
        // }
      };

    useEffect(() => {
       fetchCollectionsLength();
    }, []);
  return (
    <Fragment>
      <CommonBreadcrumb loading={loading} fetchCollectionsLength={fetchCollectionsLength} title="dashboard" />
      <Container fluid>
        <Row>
          <TopDashboardCards collectionsLength={collectionsLength} />
          {/* <MarketValue /> */}
          <LatestOrders />
          {/* <TotalSales /> */}
          {/* <TotalPurchase /> */}
          {/* <TotalCash /> */}
          {/* <DailyDeposits /> */}
          {/* <BuySell /> */}
          {/* <ProductCart /> */}
          {/* <EmployeeStatus /> */}
          {/* <SalesStatus /> */}
        </Row>
      </Container>
    </Fragment>
  );
};

// javascript:void(0)

export default DashboardContainer;
