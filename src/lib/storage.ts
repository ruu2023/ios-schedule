import * as ImagePicker from 'expo-image-picker'
import { File } from 'expo-file-system'

export type PickedFile = {
  uri: string
  mimeType: string
}

export async function pickImage(): Promise<PickedFile | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') return null

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  })

  if (result.canceled) return null

  const asset = result.assets[0]
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
  }
}

export async function uploadFile(signedUrl: string, file: PickedFile): Promise<void> {
  const f = new File(file.uri)
  const result = await f.upload(signedUrl, {
    httpMethod: 'PUT',
    headers: { 'Content-Type': file.mimeType },
  })
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Upload failed: ${result.status}`)
  }
}

export function makeR2Key(userId: string, mimeType: string): string {
  const ext = mimeType.split('/')[1] ?? 'bin'
  return `uploads/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}
