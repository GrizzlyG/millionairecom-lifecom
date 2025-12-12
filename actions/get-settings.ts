import prisma from "@/libs/prismadb";

export default async function getSettings() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      return {
        id: "settings",
        bankName: "",
        bankAccountNumber: "",
        accountHolderName: "",
        hostels: [],
        spf: 100,
        nextDeliveryTime: null,
        whatsappNumber: null,
        updatedAt: new Date(),
      };
    }

    return {
      id: settings.id,
      bankName: settings.bankName || "",
      bankAccountNumber: settings.bankAccountNumber || "",
      accountHolderName: settings.accountHolderName || "",
      hostels: settings.hostels || [],
      spf: settings.spf || 100,
      nextDeliveryTime: settings.nextDeliveryTime || null,
      whatsappNumber: settings.whatsappNumber || null,
      updatedAt: settings.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      id: "settings",
      bankName: "",
      bankAccountNumber: "",
      accountHolderName: "",
      hostels: [],
      spf: 100,
      nextDeliveryTime: null,
      whatsappNumber: null,
      updatedAt: new Date(),
    };
  }
}
