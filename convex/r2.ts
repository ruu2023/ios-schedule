"use node"

import { v } from 'convex/values'
import { action } from './_generated/server'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export const generateUploadUrl = action({
  args: {
    key: v.string(),
    contentType: v.string(),
  },
  handler: async (_ctx, { key, contentType }) => {
    return getSignedUrl(
      r2Client(),
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 3600 }
    )
  },
})

export const generateDownloadUrl = action({
  args: { key: v.string() },
  handler: async (_ctx, { key }) => {
    return getSignedUrl(
      r2Client(),
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
      { expiresIn: 3600 }
    )
  },
})
