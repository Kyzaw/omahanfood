"use client"

import { UploadImageMenu } from "@/lib/actions"
import { useActionState, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, DollarSign, FileText, Tag, Image as ImageIcon, Plus } from "lucide-react"

const MenuForm = ({ categories }: { categories: { id: string, name: string }[] }) => {
  const [state, formAction] = useActionState(UploadImageMenu, null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await formAction(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Add New Menu</h1>
                  <p className="text-blue-100 text-sm">Create a delicious menu item for your restaurant</p>
                </div>
              </div>
              <Link 
                href="/admin/menu" 
                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Menu</span>
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form action={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Menu Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Special Fried Rice"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                />
                {state?.error?.name && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{state.error.name}</span>
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your delicious menu item..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white resize-none"
                ></textarea>
                {state?.error?.description && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{state.error.description}</span>
                  </p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span>Price (IDR)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="25000"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                    />
                  </div>
                  {state?.error?.price && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{state.error.price}</span>
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <span>Category</span>
                  </label>
                  <select
                    name="categoryId"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {state?.error?.categoryId && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{state.error.categoryId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload Field */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>Menu Image</span>
                </label>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Upload Area */}
                  <div className="flex-1">
                    <label className="relative block">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 cursor-pointer">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-600 mb-1">Click to upload image</p>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="w-full md:w-48">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 md:h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Preview
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {state?.error?.image && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{state.error.image}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Menu...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Menu Item</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Success/Error Messages */}
        {state?.message && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 text-sm font-medium flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{state.message}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuForm