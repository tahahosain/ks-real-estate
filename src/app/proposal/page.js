import { redirect } from "next/navigation";
import { authUser } from "@/utiles/auth-server";
import AddEstateForm from "@/components/p-admin/AddEstateForm";
import styles from '@/styles/proposal.module.css'
export default async function ProposalPage() {
  const user = await authUser();

  if (!user) {
    redirect("/login-register");
  }

  return (
    <main className={styles.proposal}>
      <section>
        <h1>ثبت ملک</h1>
        <p>
          مشخصات ملک خود را وارد کنید تا پس از بررسی و تأیید، در سایت نمایش داده
          شود.
        </p>

        <AddEstateForm mode="user" />
      </section>
    </main>
  );
}
