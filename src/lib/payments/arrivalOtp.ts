import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { isMockSms, sendMsg91Flow } from "@/lib/sms/send";
import { sendEmail } from "@/lib/email/send";
import { otpEmail } from "@/lib/email/templates/otp";
import { createNotification } from "@/lib/notifications/notify";

function randomDigits(len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += randomInt(0, 10).toString();
  return s;
}

/**
 * Generate the booking's arrival OTP and deliver it to the customer. Unlike the
 * short-lived auth OtpCode rows, this code is stored on the booking and has no
 * TTL — the vendor may arrive hours after the balance is paid, and the customer
 * reads it out on arrival. Idempotent at the call site: capturePayment only
 * calls this once (guards on `!booking.arrivalOtp`).
 *
 * Delivery reuses the existing senders and is best-effort: the code is already
 * persisted (and visible on the customer's booking page) before we attempt SMS/
 * email, so a delivery hiccup never blocks the flow.
 */
export async function issueArrivalOtp(bookingId: string): Promise<string | null> {
  const code = randomDigits(6);

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { arrivalOtp: code, arrivalOtpSentAt: new Date() },
    include: { customer: { select: { id: true, email: true, phone: true } } },
  });

  const { customer } = booking;

  if (customer.phone) {
    if (isMockSms()) {
      console.info(`[SMS mock] arrival OTP for ${customer.phone} (booking ${bookingId}): ${code}`);
    } else {
      await sendMsg91Flow(customer.phone, process.env.MSG91_OTP_FLOW_ID, { OTP: code }).catch(
        (e) => console.error("[arrivalOtp] sms send failed:", e),
      );
    }
  }

  if (customer.email) {
    await sendEmail({ to: customer.email, ...otpEmail("arrival", code) }).catch((e) =>
      console.error("[arrivalOtp] email send failed:", e),
    );
  }

  void createNotification({
    userId: customer.id,
    type: "booking",
    title: "Your event code is ready",
    body: `Payment complete. Share code ${code} with your vendor when they arrive to start your event.`,
    link: `/customer/bookings/${bookingId}`,
  }).catch((e) => console.error("[arrivalOtp] notify failed:", e));

  return code;
}
