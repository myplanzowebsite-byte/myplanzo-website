import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Sign up for MyPlanzo to book verified event vendors in Mumbai, or list your services as a vendor.",
  openGraph: {
    title: "Create your account · MyPlanzo",
    description:
      "Sign up for MyPlanzo to book verified event vendors in Mumbai, or list your services as a vendor.",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "MyPlanzo" }],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
