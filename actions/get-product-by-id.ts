import prisma from "@/libs/prismadb";

interface ItemsParams {
  productId?: string;
}

export default async function getProductById(params: ItemsParams) {
  try {
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    console.log("Product fetched from DB:", { id: product.id, name: product.name, price: product.price, dmc: product.dmc });

    return product;
  } catch (error: any) {
    throw new Error(error);
  }
}
