import React from 'react'
import styles from './PropertyCard.module.css'
function PropertyTitle({ children }) {
 
  
  return (
    <h3 className={styles.title}>
      {children}
    </h3>
  )
}

export default PropertyTitle

