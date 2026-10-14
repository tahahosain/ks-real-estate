import React from 'react'
import styles from "./PropertyCard.module.css"
function PropertyAddress({children}) {
  return <address className={styles.address}>{children}</address>;
}

export default PropertyAddress
