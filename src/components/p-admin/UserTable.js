"use client"
import styles from "@/styles/p-admin/users.module.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUpdateUser from "@/hooks/useUpdateUser";
export default function UserTable({ users }) {
  const router = useRouter();
   const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
 const handleDelete = async (user) => {
   const result = await Swal.fire({
     title: "حذف کاربر",
     text: `آیا از حذف ${user.name || "این کاربر"} مطمئن هستید؟`,
     icon: "warning",
     showCancelButton: true,
     confirmButtonText: "بله، حذف شود",
     cancelButtonText: "انصراف",
     reverseButtons: true,
     customClass: {
       popup: "adminSwalPopup",
       title: "adminSwalTitle",
       htmlContainer: "adminSwalText",
       confirmButton: "adminSwalConfirm",
       cancelButton: "adminSwalCancel",
     },
   });

   if (!result.isConfirmed) {
     return;
   }

   try {
     const response = await fetch("/api/user", {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         id: user._id,
       }),
     });

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.message || "حذف کاربر انجام نشد");
     }

     await Swal.fire({
       title: "حذف شد",
       text: data.message,
       icon: "success",
       confirmButtonText: "باشه",
     });

     router.refresh();
   } catch (error) {
     console.error("DELETE USER ERROR:", error);

     Swal.fire({
       title: "خطا",
       text: error.message || "خطایی در حذف کاربر رخ داد",
       icon: "error",
       confirmButtonText: "باشه",
     });
   }
  };
  //...............Edit Function.............//
    const handleEdit = async (user) => {
      const result = await Swal.fire({
        title: "ویرایش کاربر",
        customClass: {
          popup: "userEditAlert",
        },
        html: `
        <div class="userEditForm">

          <input
            id="userName"
            class="swal2-input"
            placeholder="نام"
            value="${user.name || ""}"
          />

          <input
            id="userEmail"
            class="swal2-input"
            placeholder="ایمیل"
            type="email"
            value="${user.email || ""}"
          />

          <input
            id="userPhone"
            class="swal2-input"
            placeholder="شماره تلفن"
            value="${user.phone || ""}"
          />

          <select id="userRole" class="swal2-select">
            <option
              value="USER"
              ${user.role === "USER" ? "selected" : ""}
            >
              کاربر
            </option>

            <option
              value="ADMIN"
              ${user.role === "ADMIN" ? "selected" : ""}
            >
              مدیر
            </option>
          </select>

        </div>
      `,

        showCancelButton: true,

        confirmButtonText: "ذخیره تغییرات",
        cancelButtonText: "انصراف",

        reverseButtons: true,

        focusConfirm: false,

        preConfirm: () => {
          const name = document.getElementById("userName").value.trim();

          const email = document.getElementById("userEmail").value.trim();

          const phone = document.getElementById("userPhone").value.trim();

          const role = document.getElementById("userRole").value;

          if (!name) {
            Swal.showValidationMessage("نام کاربر را وارد کنید");

            return false;
          }

          if (!phone) {
            Swal.showValidationMessage("شماره تلفن را وارد کنید");

            return false;
          }

          return {
            id: user._id,
            name,
            email,
            phone,
            role,
          };
        },

        didOpen: () => {
          const input = document.getElementById("userName");

          input?.focus();
        },
      });

      if (!result.isConfirmed) return;
try {
  Swal.showLoading();

  Swal.getConfirmButton().disabled = true;
  Swal.getCancelButton().disabled = true;

  await updateUser(result.value);

  Swal.hideLoading();

  await Swal.fire({
    title: "با موفقیت ذخیره شد",
    text: "اطلاعات کاربر به‌روزرسانی شد",
    icon: "success",
    confirmButtonText: "باشه",
    customClass: {
      popup: "userEditAlert",
    },
  });

  router.refresh();
} catch (error) {
  Swal.hideLoading();

  console.error("UPDATE USER ERROR:", error);

  Swal.fire({
    title: "خطا",
    text: error.message || "ویرایش اطلاعات کاربر انجام نشد",
    icon: "error",
    confirmButtonText: "باشه",
    customClass: {
      popup: "userEditAlert",
    },
  });
}
    };

    // =========================
    // Empty state
    // =========================

    if (!users?.length) {
      return <div className={styles.empty}>کاربری پیدا نشد.</div>;
    }



  if (!users?.length) {
    return <div className={styles.empty}>کاربری پیدا نشد.</div>;
  }


  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>نام</th>
            <th>ایمیل</th>
            <th>شماره تماس</th>
            <th>نقش</th>
            <th>تاریخ ثبت‌نام</th>
            <th>عملیات</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name || "—"}</td>

              <td>{user.email || "—"}</td>

              <td>{user.phone || "—"}</td>

              <td>{user.role === "ADMIN" ? "مدیر" : "کاربر"}</td>

              <td>{new Date(user.createdAt).toLocaleDateString("fa-IR")}</td>

              <td className={styles.edit}>
                <button type="button" onClick={() => handleDelete(user)}>
                  حذف
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                  disabled={isUpdating}>
                  ویرایش
                </button>
                <button type="button">بن</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
