import { AppHeader } from "@/components/AppHeader";

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
