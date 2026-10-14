"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useDeleteEstate from "@/hooks/useDeleteEstate";
import styles from '@/styles/p-admin/PropertyTable.module.css'
export default function DeletePropertyButton({ propertyId }) {
  const router = useRouter();

  const { mutateAsync: deleteEstate, isPending } = useDeleteEstate();

  async function handleDelete() {
    const result = await Swal.fire({
      title: "حذف ملک",
      text: "آیا از حذف این ملک مطمئن هستید؟",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",

      reverseButtons: true,
      focusCancel: true,

      customClass: {
        popup: "adminSwalPopup",
        title: "adminSwalTitle",
        htmlContainer: "adminSwalText",
        confirmButton: "adminSwalConfirm",
        cancelButton: "adminSwalCancel",
      },
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "در حال حذف...",
        text: "لطفاً تا پایان عملیات صبر کنید.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,

        customClass: {
          popup: "adminSwalPopup",
          title: "adminSwalTitle",
          htmlContainer: "adminSwalText",
          loader: "adminSwalLoader",
        },

        didOpen: () => {
          Swal.showLoading();
        },
      });

      await deleteEstate(propertyId);

      router.refresh();

      await Swal.fire({
        title: "حذف شد",
        text: "ملک با موفقیت حذف شد.",
        icon: "success",
        confirmButtonText: "باشه",

        customClass: {
          popup: "adminSwalPopup",
          title: "adminSwalTitle",
          htmlContainer: "adminSwalText",
          confirmButton: "adminSwalConfirm",
        },
      });
    } catch (error) {
      await Swal.fire({
        title: "خطا در حذف",
        text: error.message || "حذف ملک انجام نشد.",
        icon: "error",
        confirmButtonText: "باشه",

        customClass: {
          popup: "adminSwalPopup",
          title: "adminSwalTitle",
          htmlContainer: "adminSwalText",
          confirmButton: "adminSwalConfirm",
        },
      });
    }
  }

  return (
    <button type="button" className={styles.actionsButton} onClick={handleDelete} disabled={isPending}>
      {isPending ? "در حال حذف..." : "حذف"}
    </button>
  );
}
