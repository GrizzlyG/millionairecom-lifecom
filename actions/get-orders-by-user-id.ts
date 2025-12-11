import { MongoClient, ObjectId } from "mongodb";

export default async function getOrdersByUserId(userId: string) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL!);
  
  try {
    await mongoClient.connect();
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    // Get orders for this user - userId is stored as ObjectId string
    const orders = await db
      .collection("Order")
      .find({ userId: userId })
      .sort({ createDate: -1 })
      .toArray();

    // Get user data for each order
    const ordersWithUser = await Promise.all(
      orders.map(async (order) => {
        const user = await db
          .collection("User")
          .findOne({ _id: new ObjectId(order.userId) });
        
        return {
          ...order,
          id: order._id.toString(),
          user: {
            ...user,
            id: user?._id.toString(),
          },
        };
      })
    );

    return ordersWithUser;
  } catch (error: any) {
    console.error("Error fetching orders by user ID:", error);
    throw new Error(error);
  } finally {
    await mongoClient.close();
  }
}
