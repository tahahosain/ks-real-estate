import { redirect } from "next/navigation";
import { authAdmin } from "@/utiles/auth-server";
import PendingPropertyList from "@/components/p-admin/PendingPropertyList";
export default async function PendingPropertiesPage() {
  const admin = await authAdmin();

  if (!admin) {
    redirect("/login-register");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/estates?status=pending&page=1&limit=50`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت املاک در انتظار تأیید");
  }

  const result = await response.json();

  return (
    <section>
      <h1>املاک در انتظار تأیید</h1>

      <p>
        تعداد املاک در انتظار تأیید:{" "}
        {result.pagination.total.toLocaleString("fa-IR")}
      </p>

      {result.data.length === 0 ? (
        <p>در حال حاضر ملکی برای بررسی وجود ندارد.</p>
      ) : (
        <PendingPropertyList properties={result.data} />
      )}
    </section>
  );
}
