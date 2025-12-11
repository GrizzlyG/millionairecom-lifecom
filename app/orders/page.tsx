import Container from "@/app/components/container";
import OrdersClient from "./orders-client";
import getCurrentUser from "@/actions/get-current-user";
import NullData from "@/app/components/null-data";
import getOrdersByUserId from "@/actions/get-orders-by-user-id";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access denied" />;
  }

  const orders = await getOrdersByUserId(currentUser.id);

  if (!orders) {
    return <NullData title="No orders yet..." />;
  }

  // Serialize orders to plain objects
  const serializedOrders = orders.map(order => ({
    ...order,
    id: order.id.toString(),
    createDate: (order as any).createDate?.toISOString() || new Date().toISOString(),
    createdAt: (order as any).createdAt?.toISOString(),
    updatedAt: (order as any).updatedAt?.toISOString(),
    cancelledAt: (order as any).cancelledAt?.toISOString() || null,
    reimbursedAt: (order as any).reimbursedAt?.toISOString() || null,
    user: order.user ? {
      ...order.user,
      id: order.user.id?.toString(),
      createdAt: (order.user as any).createdAt?.toISOString(),
      updatedAt: (order.user as any).updatedAt?.toISOString(),
      emailVerified: (order.user as any).emailVerified?.toISOString() || null,
    } : undefined,
  }));

  return (
    <div className="pt-8 pb-8">
      <Container>
        <OrdersClient orders={serializedOrders} />
      </Container>
    </div>
  );
};

export default Orders;
