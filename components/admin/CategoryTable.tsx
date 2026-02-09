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
import { Edit2, Trash2, Check, X, Plus, Image as ImageIcon, MoreVertical, FolderOpen } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
}

export default function CategoryTable({
  categories = [],
}: {
  categories: { id: string; name: string; image?: string; menus?: MenuItem[] }[];
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

  const startEdit = (cat: { id: string; name: string; image?: string }) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditImage(cat.image || "");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="text-left font-semibold text-slate-700 py-4 px-0 text-sm">
                CATEGORY
              </TableHead>
              <TableHead className="text-left font-semibold text-slate-700 py-4 px-6 w-24 text-sm">
                IMAGE
              </TableHead>
              <TableHead className="text-center font-semibold text-slate-700 py-4 px-6 w-32 text-sm">
                MENU ITEMS
              </TableHead>
              <TableHead className="text-center font-semibold text-slate-700 py-4 px-6 w-48 text-sm">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16 text-slate-500 border-0">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <FolderOpen className="w-10 h-10 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-xl mb-2">No categories found</p>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Create your first category to start organizing your menu items and make them easier to browse.
                      </p>
                      <Link href="/admin/category/add">
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Category
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="py-6 px-0">
                    {editId === cat.id ? (
                      <div className="flex flex-col space-y-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter category name"
                          className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEdit(cat.id);
                            }
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                        />
                        <Input
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          placeholder="Image URL (optional)"
                          className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
                          <span className="font-semibold text-slate-900 text-lg">{cat.name}</span>
                        </div>
                        <p className="text-sm text-slate-500 ml-6">
                          Category ID: <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{cat.id}</span>
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
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
                      <ImageIcon className={`w-6 h-6 text-slate-400 ${cat.image ? 'hidden' : ''}`} />
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6 text-center">
                    <div className="inline-flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-200">
                        <span className="text-xl font-bold text-blue-700">
                          {cat.menus?.length || 0}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {(cat.menus?.length || 0) === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      {editId === cat.id ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cat.id)}
                            disabled={isLoading || !editName.trim()}
                            className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 disabled:opacity-50 bg-white shadow-sm"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="text-slate-600 border-slate-200 hover:bg-slate-50 bg-white shadow-sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(cat)}
                            disabled={isLoading}
                            className="text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 bg-white shadow-sm hover:shadow-md transition-all"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
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
                            className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 bg-white shadow-sm hover:shadow-md transition-all"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No categories yet
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Add your first category to get started
            </p>
            <Link href="/admin/category/add">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </Link>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {editId === cat.id ? (
                // Mobile Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
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
                      <ImageIcon className={`w-5 h-5 text-slate-400 ${editImage ? 'hidden' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Editing Category</p>
                      <p className="text-xs text-slate-500">ID: {cat.id}</p>
                    </div>
                  </div>

                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Category name"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    autoFocus
                  />

                  <Input
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(cat.id)}
                      disabled={isLoading || !editName.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Mobile View Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
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
                        <ImageIcon className={`w-5 h-5 text-slate-400 ${cat.image ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-base truncate">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-slate-500">ID: {cat.id}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cat.menus?.length || 0} items
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(cat)}
                      disabled={isLoading}
                      className="flex-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
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
                      className="flex-1 text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md mx-4">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                  Delete Category
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-600 leading-relaxed">
              Are you sure you want to delete this category? This action cannot be undone and may affect related menu items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:space-x-2 pt-4">
            <AlertDialogCancel
              onClick={() => setOpenDeleteDialog(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
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