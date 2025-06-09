import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RedirectPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role === "ADMIN") {
    redirect("/admin");
  } else if (role === "KURIR") {
    redirect("/kurir");
  } else {
    redirect("/");
  }

}
