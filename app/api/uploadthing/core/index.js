import { createUploadthing } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '4MB' } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata?.userId)
      console.log('File URL:', file.url)
    }),
}
