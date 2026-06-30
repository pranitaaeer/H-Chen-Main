"use client";

import Link from "next/link";
import { Badge, Button, Card, CardBody, Table, Input } from "reactstrap";
import { useEffect, useState } from "react";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import { formatTimestamp, capitalizeHeader } from "@/lib/utils";

interface Order {
  _id: string;
  billingMethod: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: "warning",
    processing: "secondary",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  return colorMap[status] || "dark";
};

const LatestOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/order/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, updatedStatus:newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Optimistically update UI
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  const allOrders = orders
    .map((order) => ({
      order_id: order._id,
      total_price: "₹" + order.totalPrice,
      payment_method: capitalizeHeader(order.billingMethod),
      order_date: formatTimestamp(order.createdAt),
      status: order.status,
    }))
    .sort(
      (a, b) =>
        new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
    );

  return (
    <Card>
      <CommonCardHeader title="Latest Orders" />
      <CardBody>
        <div className="user-status table-responsive latest-order-table">
          <Table borderless>
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Order Total</th>
                <th scope="col">Payment Method</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (!allOrders || allOrders.length === 0) ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    <h5>No orders made yet</h5>
                  </td>
                </tr>
              ) : (
                allOrders.slice(0, 5).map((order, index) => (
                  <tr key={index}>
                    <td>{order.order_id}</td>
                    <td className="digits">{order.total_price}</td>
                    <td className="font-danger">{order.payment_method}</td>
                    <td className="digits">{order.order_date}</td>
                    <td className="digits">
                      <Input
                        type="select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.order_id, e.target.value)
                        }
                        style={{
                          padding: "2px 6px",
                          borderColor: getStatusColor(order.status),
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {capitalizeHeader(status)}
                          </option>
                        ))}
                      </Input>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Link href="/en/sales/orders">
            <Button color="primary">View All Orders</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default LatestOrders;
