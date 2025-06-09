"use client"

import { UploadImageCategory } from "@/lib/actions"
import { useFormState } from "react-dom"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Upload, Image as ImageIcon, Plus, X } from "lucide-react"

const CategoryForm = () => {
  const [state, formAction] = useFormState(UploadImageCategory, null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        // Set the file to the input
        const input = document.getElementById('image') as HTMLInputElement
        const dt = new DataTransfer()
        dt.items.add(file)
        input.files = dt.files

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    const input = document.getElementById('image') as HTMLInputElement
    input.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/category" 
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Kategori
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Tambah Kategori Baru</h1>
            <p className="text-slate-600">Buat kategori baru dengan gambar yang menarik</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Form Kategori</h2>
                <p className="text-blue-100 text-sm">Lengkapi informasi kategori</p>
              </div>
            </div>
          </div>

          <form action={formAction} className="p-8">
            {/* Category Name Field */}
            <div className="mb-8">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
                Nama Kategori
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                </div>
              </div>
              {state?.error?.name && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{state.error.name}</p>
                </div>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="mb-8">
              <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-3">
                Gambar Kategori
              </label>
              
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : imagePreview 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {imagePreview ? (
                  /* Image Preview */
                  <div className="relative p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-slate-800 mb-1">Gambar berhasil dipilih</h3>
                        <p className="text-sm text-slate-600 mb-3">Gambar siap untuk di-upload</p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Upload Placeholder */
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {isDragOver ? 'Lepaskan file di sini' : 'Upload gambar kategori'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Drag & drop gambar atau klik untuk memilih file
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      PNG, JPG, atau GIF (Max 5MB)
                    </div>
                  </div>
                )}
              </div>

              {state?.error?.image && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{state.error.image}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Buat Kategori</span>
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Pastikan gambar yang di-upload memiliki kualitas yang baik dan relevan dengan kategori
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoryForm