import { redirect } from "next/navigation";

// ponytail: the template ships docs only; replace with your product home
export default function Home() {
  redirect("/docs");
}
