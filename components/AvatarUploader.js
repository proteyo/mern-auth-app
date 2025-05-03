'use client'

import { UploadButton } from '@uploadthing/react'
import '@uploadthing/react/styles.css'

export const AvatarUploader = ({ onUploadComplete }) => {
  return (
    <div>
      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={(res) => {
          console.log('Файл загружен:', res)
          if (onUploadComplete && res?.[0]?.url) {
            onUploadComplete(res[0].url)
          }
        }}
        onUploadError={(error) => {
          alert(`Ошибка загрузки: ${error.message}`)
        }}
      />
    </div>
  )
}
