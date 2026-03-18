'use client'

import { ReactNode, useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageFadeWrapperProps {
  children: ReactNode
}

function PageFadeWrapper({ children }: PageFadeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0.98 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.98 }}
        transition={{ duration: 0.12 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default memo(PageFadeWrapper)
