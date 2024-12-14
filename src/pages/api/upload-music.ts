import type { APIRoute } from 'astro'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'music')

export const POST: APIRoute = async ({ request }) => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const formData = await request.formData()
    const file = formData.get('music') as File

    if (!file) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No se proporcionó ningún archivo' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, buffer)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Archivo subido exitosamente',
        fileUrl: `/uploads/music/${fileName}`
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error al subir archivo:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar el archivo'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}