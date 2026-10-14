"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import styles from "@/styles/p-admin/users.module.css";
import Swal from "sweetalert2";
import useDeleteContact from "@/hooks/useDeleteContact";
import useReadContact from "@/hooks/useReadContact";
import useUpdateContact from "@/hooks/useUpdateContact";
import { useQueryClient } from "@tanstack/react-query";
const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};


function CommentTable({messages} ) {
const router = useRouter();
    const { mutate, isPending } = useDeleteContact();
    const { mutate: markAsRead } = useReadContact();
  const queryClient = useQueryClient();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();
//.....................functions.......................//
 const handleView = (message) => {
   markAsRead(message._id, {
     onSuccess: () => {
       Swal.fire({
         title: "جزئیات پیام",
         width: "52rem",
         padding: "2rem",
         background: "#ffffff",
         html: `
          <div style="text-align:right;direction:rtl" >
            <p>نام: ${escapeHtml(message.name || "—")}</p>

            <p>ایمیل: ${escapeHtml(message.email || "—")}</p>

            <p>شماره تماس: ${escapeHtml(message.phone || "—")}</p>

            <p>پیام:</p>

            <div>
              ${escapeHtml(message.message || "—")}
            </div>
          </div>
        `,

         confirmButtonText: "بستن",
       });

       queryClient.invalidateQueries({
         queryKey: ["contactMessagesCount"],
       });
     },
     
     onError: (error) => {
       Swal.fire({
         icon: "error",
         title: "خطا",
         text: error.message,
         confirmButtonText: "باشه",
       });
     },
   });
 };
    //..........................delete....................//
    const handleDelete = async (message) => {
      const result = await Swal.fire({
        title: "حذف پیام",
        text: "آیا از حذف این پیام مطمئن هستید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله، حذف شود",
        cancelButtonText: "انصراف",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      mutate(message._id, {
        onSuccess: (data) => {
          Swal.fire({
            icon: "success",
            title: "حذف شد",
            text: data.message,
            confirmButtonText: "باشه",
          });

          router.refresh();
        },

        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: error.message,
            confirmButtonText: "باشه",
          });
        },
      });
    };
  //..................................Update.............................//
  const handleEdit = async (message) => {
    const result = await Swal.fire({
      title: "ویرایش پیام",

      width: "52rem",
      padding: "2rem",
      background: "#ffffff",

      html: `
    <div class="contactEditForm">

      <div class="field">
        <label for="swal-name">نام</label>
        <input
          id="swal-name"
          type="text"
          value="${escapeHtml(message.name || "")}"
          placeholder="نام"
        />
      </div>

      <div class="field">
        <label for="swal-email">ایمیل</label>
        <input
          id="swal-email"
          type="email"
          value="${escapeHtml(message.email || "")}"
          placeholder="ایمیل"
        />
      </div>

      <div class="field">
        <label for="swal-phone">شماره تماس</label>
        <input
          id="swal-phone"
          type="tel"
          value="${escapeHtml(message.phone || "")}"
          placeholder="شماره تماس"
        />
      </div>

      <div class="field">
        <label for="swal-message">متن پیام</label>
        <textarea
          id="swal-message"
          placeholder="متن پیام"
        >${escapeHtml(message.message || "")}</textarea>
      </div>

    </div>
  `,

      showCancelButton: true,
      confirmButtonText: "ذخیره تغییرات",
      cancelButtonText: "انصراف",
      reverseButtons: true,
      focusConfirm: false,

      customClass: {
        popup: "contactEditPopup",
        confirmButton: "contactConfirmButton",
        cancelButton: "contactCancelButton",
      },

      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();

        const email = document.getElementById("swal-email").value.trim();

        const phone = document.getElementById("swal-phone").value.trim();

        const messageText = document
          .getElementById("swal-message")
          .value.trim();

        if (!phone || !messageText) {
          Swal.showValidationMessage("شماره تماس و متن پیام الزامی هستند");

          return false;
        }

        return {
          name,
          email,
          phone,
          message: messageText,
        };
      },
    });

    if (!result.isConfirmed) return;

    updateContact(
      {
        id: message._id,
        data: result.value,
      },
      {
        onSuccess: (data) => {
          Swal.fire({
            icon: "success",
            title: "ویرایش شد",
            text: data.message,
            confirmButtonText: "باشه",
          });

          router.refresh();
        },

        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: error.message,
            confirmButtonText: "باشه",
          });
        },
      },
    );
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>نام</th>
          <th>ایمیل</th>
          <th>شماره تماس</th>

          <th>تاریخ ارسال پیام</th>
          <th>عملیات</th>
        </tr>
      </thead>

      <tbody>
        {messages?.map((message) => (
          <tr key={message._id}>
            <td>{message.name || "—"}</td>

            <td>{message.email || "—"}</td>

            <td>{message.phone || "—"}</td>

            <td>{new Date(message.createdAt).toLocaleDateString("fa-IR")}</td>

            <td className={styles.edit}>
              <button
                type="button"
                onClick={() => handleDelete(message)}
                disabled={isPending}>
                {isPending ? "در حال حذف..." : "حذف"}
              </button>

              <button type="button" onClick={() => handleEdit(message)}>
                {isUpdating ? "در حال ویرایش..." : "ویرایش"}
              </button>
              <button type="button" onClick={() => handleView(message)}>
                مشاهده
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CommentTable
