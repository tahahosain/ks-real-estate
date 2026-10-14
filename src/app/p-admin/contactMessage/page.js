import connectToDB from '@/configs/db'
import React from 'react'
import ContactMessageModel from '@/models/ContactMessage';
import CommentTable from '@/components/p-admin/CommentTable';
import styles from "@/styles/p-admin/users.module.css";

async function page() {
await connectToDB()
const messages = await ContactMessageModel.find({}).lean()

  if (!messages.length) {
    return <h3>هیچ پیامی موجود نیست</h3>
  }
  return (
    <div className={styles.wrapper}>
      <CommentTable messages={JSON.parse(JSON.stringify(messages))} />
    </div>
  );
}

export default page;
