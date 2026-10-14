"use client"

import Button from "@/components/ui/button/Button";
import { FiSearch } from "react-icons/fi";
import Input from "@/components/ui/input/Input";
import styles from "./hero.module.css"
export default function HeroSearch() {

    const handleSubmit = (e) => {
      e.preventDefault();

      console.log("Search...");
    };
  return (
      <form className={styles.form}
          onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <Input
          name="city"
          label="شهر"
          placeholder="نام شهر"
          startIcon={<FiSearch />}
        />
      </div>

      <Button type="submit">جستجو</Button>
    </form>
  );
}
