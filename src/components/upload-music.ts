import type { APIRoute } from 'astro'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(__dirname, '../../../../public/uploads/music')

export const POST: APIRoute = async ({ request }) => {
  try {
    // Asegurarse de que el directorio existe
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const formData = await request.formData()
    const file = formData.get('music') as File
    
    if (!file) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No se proporcionó ningún archivo' 
      }), { status: 400 })
    }

    // Generar nombre único para el archivo
    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Convertir el archivo a Buffer y guardarlo
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, buffer)

    // Generar URL pública
    const publicUrl = `/uploads/music/${fileName}`

    return new Response(JSON.stringify({
      success: true,
      message: 'Archivo subido exitosamente',
      fileUrl: publicUrl,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ""),
        format: file.type,
        size: file.size
      }
    }), { status: 200 })

  } catch (error) {
    console.error('Error al subir archivo:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al procesar el archivo'
    }), { status: 500 })
  }
}