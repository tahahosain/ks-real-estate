import { redirect } from "next/navigation";
import { authAdmin } from "@/utiles/auth-server";
import AddEstateForm from "@/components/p-admin/AddEstateForm";
import styles from "./AddNewEstate.module.css";

export default async function NewEstatePage() {
  const admin = await authAdmin();

  if (!admin) {
    redirect("/login-register");
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>مدیریت املاک</span>

          <h1>افزودن ملک جدید</h1>

          <p>اطلاعات ملک را وارد کنید تا در سامانه املاک ثبت شود.</p>
        </div>
      </div>

      <AddEstateForm />
    </section>
  );
}
