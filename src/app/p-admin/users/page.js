
import styles from "./users.module.css";
import UserTable from "@/components/p-admin/UserTable";
import Pagination from "@/components/p-admin/Pagination";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";


export default async function Page({ searchParams }) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const limit = 10;

  await connectToDB();

  const totalUsers = await UserModel.countDocuments();

  const totalPages = Math.ceil(totalUsers / limit);

  const users = await UserModel.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const result = {
    data: JSON.parse(JSON.stringify(users)),
    pagination: {
      page,
      totalPages,
      total: totalUsers,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };



  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>مدیریت کاربران</span>

          <h1>لیست کاربران</h1>

          <p>
            در این بخش می‌توانید تمام کاربران ثبت‌ شده در سامانه را مشاهده و
            مدیریت کنید.
          </p>
        </div>
      </div>

      <div className={styles.summary}>
        <span>تعداد کل کاربران:</span>

        <strong>{result.pagination.total.toLocaleString("fa-IR")}</strong>
      </div>

      <UserTable users={result.data} />

      <Pagination
        currentPage={result.pagination.page}
        totalPages={result.pagination.totalPages}
        hasNextPage={result.pagination.hasNextPage}
        hasPreviousPage={result.pagination.hasPreviousPage}
      />
    </section>
  );
}
