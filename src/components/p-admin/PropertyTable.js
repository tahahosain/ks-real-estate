import Link from "next/link";

import styles from "@/styles/p-admin/PropertyTable.module.css";
import DeletePropertyButton from "@/components/p-admin/DeletePropertyButton";
const typeLabels = {
  apartment: "آپارتمان",
  villa: "ویلا",
  house: "خانه",
  land: "زمین",
  commercial: "تجاری",
};

const transactionLabels = {
  sale: "فروش",
  rent: "اجاره",
};

const statusLabels = {
  available: "موجود",
  reserved: "رزرو شده",
  sold: "فروخته شده",
  rented: "اجاره داده شده",
};

export default function PropertyTable({ properties }) {


  
  if (!properties || properties.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>ملکی ثبت نشده است</h3>

        <p>هنوز هیچ ملکی در سامانه ثبت نشده است.</p>

        <Link href="/admin/properties/new">افزودن اولین ملک</Link>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ملک</th>
            <th>شهر</th>
            <th>نوع</th>
            <th>معامله</th>
            <th>متراژ</th>
            <th>قیمت</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>

        <tbody>
          {properties.map((property) => (
            <tr key={property._id}>
              <td>
                <div className={styles.propertyInfo}>
                  {property.images[0]?.url ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.noImage}>بدون تصویر</div>
                  )}

                  <div>
                    <strong>{property.title}</strong>

                    {property.location?.neighborhood && (
                      <span>{property.location.neighborhood}</span>
                    )}
                  </div>
                </div>
              </td>

              <td>{property.location?.city || "—"}</td>

              <td>{typeLabels[property.type] || property.type}</td>

              <td>
                {transactionLabels[property.transactionType] ||
                  property.transactionType}
              </td>

              <td>
                {property.area
                  ? `${property.area.toLocaleString("fa-IR")} متر`
                  : "—"}
              </td>

              <td>
                {property.transactionType === "rent"
                  ? property.rent
                    ? `${property.rent.toLocaleString("fa-IR")} تومان`
                  : "—"
                  : property.price
                    ? `${property.price.toLocaleString("fa-IR")} تومان`
                    : "—"}
              </td>

              <td>
                <span className={`${styles.status} ${styles[property.status]}`}>
                  {statusLabels[property.status] || property.status}
                </span>
              </td>

              <td>
                <div className={styles.actions}>
                  <DeletePropertyButton propertyId={property._id}  />

                  <Link href={`/p-admin/properties/${property._id}/edit`}>
                    ویرایش
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
