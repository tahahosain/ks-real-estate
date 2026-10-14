"use client"

import PropertyCard from "@/components/features/PropertyCard/PropertyCard";

import { useState } from 'react';
import styles  from  "./PropertyList.module.css"
import Button from "@/components/ui/button/Button";
import Link from "next/link";
 import useEstates from "@/hooks/useEstates";
export default function PropertyList() {
   const [filters, setFilters] = useState([]);
  
    const [page, setPage] = useState(1);
   const { data, isLoading, isError, error } = useEstates({
     filters,
     page
    
    });
  
    const properties = data?.data ?? [];
  
    const pagination = data?.pagination ?? null;  
   
    
  return (
    <div className={styles.wrapperPropertyList}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionSubtitle}>املاک K&S</span>
          <h2>جدیدترین املاک</h2>
          <p>مجموعه‌ای از بهترین خانه‌ها، ویلاها و آپارتمان‌های موجود</p>
        </div>

        <Button className={styles.btn}>
          <Link href="/homeDetails">مشاهده همه املاک</Link>
        </Button>
      </div>

      <section className={styles.list}>
        {!isLoading
          ? properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          : "درحال دریافت املاک..."}
      </section>
    </div>
  );
}
