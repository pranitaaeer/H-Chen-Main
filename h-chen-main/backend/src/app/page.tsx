import { redirect } from "next/navigation";
export default function Home() {
  redirect("/en/dashboard");
  return <h1>CHLOE'S VENTURE</h1>;
}
