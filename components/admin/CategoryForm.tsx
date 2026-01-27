"use client"

import { UploadImageCategory } from "@/lib/actions"
import { useFormState } from "react-dom"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Upload, Image as ImageIcon, Plus, X } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminNavbar"

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
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main content with responsive spacing */}
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link 
                href="/admin/category" 
                className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-3 group text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Categories
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Add New Category
              </h1>
              <p className="text-sm text-slate-600 mt-1 md:mt-2">
                Create a new category with an attractive image
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  Category Form
                </p>
                <p className="text-xs text-slate-500">
                  Fill required information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Form Header */}
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-4 md:w-5 h-4 md:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      Category Information
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600">
                      Complete the category details below
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form action={formAction} className="p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Left Column - Category Name */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
                        Category Name *
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Enter category name..."
                          className="w-full px-4 py-3 md:py-4 border-2 border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-50"></div>
                        </div>
                      </div>
                      {state?.error?.name && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 font-medium">{state.error.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Image Guidelines</h3>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use high-quality images (minimum 400x400px)</li>
                            <li>• Supported formats: PNG, JPG, GIF</li>
                            <li>• Maximum file size: 5MB</li>
                            <li>• Images should be relevant to the category</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-3">
                      Category Image
                    </label>
                    
                    {/* Upload Area */}
                    <div
                      className={`relative border-2 border-dashed rounded-xl transition-all min-h-[300px] md:min-h-[400px] ${
                        isDragOver 
                          ? 'border-indigo-400 bg-indigo-50' 
                          : imagePreview 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50'
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
                        <div className="relative p-4 md:p-6 h-full flex flex-col">
                          <div className="flex-1 flex items-center justify-center mb-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full max-h-64 object-contain rounded-xl shadow-lg border-2 border-white"
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-slate-800 mb-2">Image Selected Successfully</h3>
                            <p className="text-sm text-slate-600 mb-4">Your image is ready to upload</p>
                            <button
                              type="button"
                              onClick={removeImage}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Upload Placeholder */
                        <div className="p-6 md:p-8 text-center h-full flex flex-col justify-center">
                          <div className="mx-auto w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-slate-500" />
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-2 text-lg">
                            {isDragOver ? 'Drop your image here' : 'Upload Category Image'}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                            Drag & drop your image or click to browse files
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            PNG, JPG, GIF (Max 5MB)
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
                </div>

                {/* Submit Button */}
                <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <Link href="/admin/category">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Category</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Success/Error Messages */}
            {state?.message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 font-medium">{state.message}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CategoryForm