'use client'

import { useState } from 'react'
import styles from './CategoryFilter.module.css'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  const allCategories = ['All', ...categories]

  return (
    <div className={styles.container}>
      {allCategories.map((category) => (
        <button
          key={category}
          className={`${styles.button} ${
            selectedCategory === category
              ? styles.buttonActive
              : styles.buttonInactive
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
