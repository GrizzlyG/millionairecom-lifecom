export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Container from "@/app/components/container";
import ManageUsersClient from "./manage-users-client";
import getUsers from "@/actions/get-users";
import getOrders from "@/actions/get-orders";
import NullData from "@/app/components/null-data";
import getCurrentUser from "@/actions/get-current-user";

const ManageUsers = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  const users = await getUsers();
  const orders = await getOrders();

  return (
    <div className="pt-8">
      <Container>
        <ManageUsersClient users={users} orders={orders} />
      </Container>
    </div>
  );
};

export default ManageUsers;
