import { prisma } from "@/lib/prisma";
import { sendMsg91Flow } from "@/lib/sms/send";

// Sends the "Welcome_user" SMS exactly once, when a user's phone is first
// marked verified. Pulls the best display name (customer or vendor profile,
// falling back to the email local-part) and fires the MSG91 welcome flow.
export async function sendWelcomeSms(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      phone: true,
      email: true,
      customerProfile: { select: { displayName: true } },
      vendorProfile: { select: { businessName: true } },
    },
  });
  if (!user?.phone) return;
  const name =
    user.customerProfile?.displayName ||
    user.vendorProfile?.businessName ||
    user.email.split("@")[0];
  await sendMsg91Flow(user.phone, process.env.MSG91_WELCOME_FLOW_ID, { name });
}
