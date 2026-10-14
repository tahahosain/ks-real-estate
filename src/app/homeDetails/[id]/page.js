import Gallery from "@/components/templates/homeDetails/Gallery";
import HomeSingle from "@/components/templates/homeDetails/homeSingleProperty/HomeSingle";
import {getEstateById} from '@/utiles/estateServerService'
import styles from "@/styles/homeDetails.module.css";
import SimilarProperties from "@/components/features/SimilarProperties/SimilarProperties";


export default async function HomeDetails({ params }) {
  const { id } = await params;

  
  

  if (!id) {
    return (
      <main className={styles.mainDetails}>
        <h1>شناسه ملک نامعتبر است.</h1>
      </main>
    );
  }

  const home = await getEstateById(id);


  if (!home) {
    return (
      <main className={styles.mainDetails}>
        <h1>ملک مورد نظر پیدا نشد.</h1>
      </main>
    );
  }

  return (
    <main className={styles.mainDetails}>
      <Gallery images={home.images} />

      <HomeSingle home={home} />
      <SimilarProperties estateId={home._id} />
    </main>
  );
}
