import { redirect } from "next/navigation";

// Browse is now at /browse (public, no auth required)
export default function CustomerBrowseRedirect(props: {
  searchParams?: Promise<{ event?: string }>;
}) {
  void props.searchParams;
  redirect("/browse");
}
