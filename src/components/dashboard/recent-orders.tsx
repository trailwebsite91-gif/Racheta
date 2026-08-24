"use client";

import { motion } from "framer-motion";
import { Package, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/styles/animations";

type OrderStatus = "delivered" | "processing" | "shipped" | "pending" | "cancelled";

interface Order {
  id: string;
  customer: string;
  product: string;
  supplier: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const mockOrders: Order[] = [
  {
    id: "SP-2401",
    customer: "Priya Sharma",
    product: "Abstract Wave Tee",
    supplier: "Printful",
    amount: "₹2,499",
    status: "delivered",
    date: "2 hours ago",
  },
  {
    id: "SP-2402",
    customer: "Rahul Patel",
    product: "Geo Pattern Hoodie",
    supplier: "Qikink",
    amount: "₹4,999",
    status: "processing",
    date: "4 hours ago",
  },
  {
    id: "SP-2403",
    customer: "Ananya Gupta",
    product: "Minimal Logo Mug",
    supplier: "Printrove",
    amount: "₹799",
    status: "shipped",
    date: "6 hours ago",
  },
  {
    id: "SP-2404",
    customer: "Vikram Singh",
    product: "Mountain Poster",
    supplier: "Gelato",
    amount: "₹1,299",
    status: "pending",
    date: "8 hours ago",
  },
  {
    id: "SP-2405",
    customer: "Neha Reddy",
    product: "Botanical Tote Bag",
    supplier: "Blinkstore",
    amount: "₹1,899",
    status: "delivered",
    date: "Yesterday",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  delivered:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  processing:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  shipped:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  pending:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  cancelled:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

interface RecentOrdersProps {
  orders?: Order[];
  isLoading?: boolean;
}

export function RecentOrders({ orders = mockOrders, isLoading = false }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <CardDescription>Loading orders...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Orders will appear here once customers start purchasing your products."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <CardDescription>
            You have {orders.length} recent order{orders.length !== 1 ? "s" : ""}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Product</TableHead>
              <TableHead className="hidden lg:table-cell">Supplier</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell pr-6">
                <Clock className="h-3.5 w-3.5" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, idx) => (
              <TableRow
                key={order.id}
                asChild
              >
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="cursor-pointer border-b transition-colors hover:bg-muted/40"
                >
                  <TableCell className="pl-6 font-mono text-xs font-medium text-primary">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {order.customer}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {order.product}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {order.supplier}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    {order.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] capitalize",
                        statusStyles[order.status]
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground pr-6">
                    {order.date}
                  </TableCell>
                </motion.tr>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
