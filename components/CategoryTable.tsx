"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Check, X, Plus, Image as ImageIcon } from "lucide-react";

export default function CategoryTable({
  categories = [
    { id: "1", name: "Technology", image: "https://via.placeholder.com/60x60?text=Tech" },
    { id: "2", name: "Design", image: "https://via.placeholder.com/60x60?text=Design" },
    { id: "3", name: "Marketing", image: "https://via.placeholder.com/60x60?text=Marketing" },
    { id: "4", name: "Business", image: "https://via.placeholder.com/60x60?text=Business" },
    { id: "5", name: "Development", image: "https://via.placeholder.com/60x60?text=Dev" }
  ],
}: {
  categories: { id: string; name: string; image: string }[];
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await fetch(`/api/admin/category/${deleteId}`, { method: "DELETE" });
      setOpenDeleteDialog(false);
      setDeleteId(null);
      location.reload();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setIsLoading(true);
    try {
      await fetch(`/api/admin/category/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: editName.trim(),
          image: editImage.trim() || undefined
        }),
      });
      setEditId(null);
      location.reload();
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditImage("");
  };

  const startEdit = (cat: { id: string; name: string; image: string }) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditImage(cat.image || "");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your categories ({categories.length} total)
          </p>
        </div>
        <Link href="/admin/category/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-200">
              <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">
                Category Name
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 py-4 px-6 w-20">
                Image
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-900 py-4 px-6 w-48">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-medium">No categories yet</p>
                    <p className="text-sm">Add your first category to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat, index) => (
                <TableRow 
                  key={cat.id} 
                  className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-4 px-6">
                    {editId === cat.id ? (
                      <div className="flex flex-col space-y-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter category name"
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEdit(cat.id);
                            }
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{cat.name}</span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {editId === cat.id ? (
                      <div className="flex flex-col space-y-2">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {editImage ? (
                            <img
                              src={editImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <ImageIcon className={`w-6 h-6 text-gray-400 ${editImage ? 'hidden' : ''}`} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <ImageIcon className={`w-6 h-6 text-gray-400 ${cat.image ? 'hidden' : ''}`} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      {editId === cat.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cat.id)}
                            disabled={isLoading || !editName.trim()}
                            className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(cat)}
                            disabled={isLoading}
                            className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeleteId(cat.id);
                              setOpenDeleteDialog(true);
                            }}
                            disabled={isLoading}
                            className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                  Delete Category
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              Are you sure you want to delete this category? This action cannot be undone and may affect related content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2 pt-4">
            <AlertDialogCancel 
              onClick={() => setOpenDeleteDialog(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}