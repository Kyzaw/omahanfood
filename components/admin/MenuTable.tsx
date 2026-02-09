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
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Check, X, Plus, Image as ImageIcon, UtensilsCrossed } from "lucide-react";

interface Menu {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image: string;
  createdAt: Date;
  category: {
    id: string;
    name: string;
  };
}

export default function MenuTable({ menus }: { menus: Menu[] }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    image: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/menu/${deleteId}`, { method: "DELETE" });
      setOpenDeleteDialog(false);
      setDeleteId(null);
      location.reload();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const handleEdit = async (id: string) => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...editForm, 
          price: parseInt(editForm.price) 
        }),
      });
      setEditId(null);
      setIsSaving(false);
      location.reload();
    } catch (error) {
      console.error("Error updating menu:", error);
      setIsSaving(false);
    }
  };

  const handleImageError = (menuId: string) => {
    setImageErrors(prev => new Set(prev).add(menuId));
  };

  const handleImageLoad = (menuId: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(menuId);
      return newSet;
    });
  };

  const getPlaceholderImage = () => "https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image";

  const startEdit = (menu: Menu) => {
    setEditId(menu.id);
    setEditForm({
      name: menu.name,
      description: menu.description,
      categoryId: menu.categoryId,
      price: String(menu.price),
      image: menu.image || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      image: "",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden">
        <div className="bg-white rounded-none shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-slate-200 hover:bg-transparent">
                <TableHead className="text-center font-bold text-slate-600 py-5 px-6 w-32 text-xs tracking-wider uppercase">
                  IMAGE
                </TableHead>
                <TableHead className="text-left font-bold text-slate-600 py-5 px-0 text-xs tracking-wider uppercase">
                  MENU DETAILS
                </TableHead>
                <TableHead className="text-center font-bold text-slate-600 py-5 px-6 w-40 text-xs tracking-wider uppercase">
                  CATEGORY
                </TableHead>
                <TableHead className="text-center font-bold text-slate-600 py-5 px-6 w-40 text-xs tracking-wider uppercase">
                  PRICE
                </TableHead>
                <TableHead className="text-center font-bold text-slate-600 py-5 px-6 w-56 text-xs tracking-wider uppercase">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {menus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-500 border-0">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                        <UtensilsCrossed className="w-12 h-12 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-2xl mb-3">No menu items found</p>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                          Get started by adding your first menu item to showcase your delicious offerings.
                        </p>
                        <Link href="/admin/menu/add">
                          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-3 text-lg">
                            <Plus className="w-5 h-5 mr-3" />
                            Add Your First Menu
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                menus.map((menu) => {
                  const isEditing = editId === menu.id;
                  const hasImageError = imageErrors.has(menu.id);
                  
                  return (
                    <TableRow 
                      key={menu.id} 
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/30 transition-all duration-200 group"
                    >
                      <TableCell className="py-8 px-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md group-hover:shadow-lg transition-all duration-200">
                            {isEditing ? (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                              </div>
                            ) : (
                              <img
                                src={hasImageError || !menu.image ? getPlaceholderImage() : menu.image}
                                alt={menu.name}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(menu.id)}
                                onLoad={() => handleImageLoad(menu.id)}
                              />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-8 px-0">
                        {isEditing ? (
                          <div className="flex flex-col space-y-4 pr-6">
                            <Input
                              name="name"
                              value={editForm.name}
                              onChange={handleChange}
                              placeholder="Menu name"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-lg py-3 font-medium"
                            />
                            <Input
                              name="description"
                              value={editForm.description}
                              onChange={handleChange}
                              placeholder="Description"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                            />
                            <Input
                              name="image"
                              value={editForm.image}
                              onChange={handleChange}
                              placeholder="Image URL"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-4">
                              <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0"></div>
                              <span className="font-bold text-slate-900 text-xl leading-tight">{menu.name}</span>
                            </div>
                            <div className="ml-8">
                              <p className="text-slate-600 text-base leading-relaxed max-w-md">
                                {menu.description}
                              </p>
                              <p className="text-sm text-slate-500 mt-2">
                                Menu ID: <span className="font-mono text-xs bg-slate-100 px-3 py-1 rounded-md border">{menu.id}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-8 px-6 text-center">
                        <div className="inline-flex items-center justify-center">
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 transition-all px-4 py-2 text-sm font-semibold border border-blue-300"
                          >
                            {menu.category.name}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-8 px-6 text-center">
                        {isEditing ? (
                          <Input
                            name="price"
                            type="number"
                            value={editForm.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white w-32 mx-auto"
                          />
                        ) : (
                          <div className="inline-flex flex-col items-center space-y-1">
                            <div className="text-2xl font-bold text-green-600">
                              Rp {menu.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-8 px-6">
                        <div className="flex items-center justify-center space-x-3">
                          {isEditing ? (
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => handleEdit(menu.id)}
                                disabled={isSaving}
                                className="text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 disabled:opacity-50 bg-white shadow-md px-6 py-2"
                              >
                                {isSaving ? (
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Saving...
                                  </div>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="default"
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="text-slate-600 border-slate-300 hover:bg-slate-50 bg-white shadow-md px-6 py-2"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => startEdit(menu)}
                                className="text-indigo-700 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 bg-white shadow-md hover:shadow-lg transition-all px-6 py-2"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => {
                                  setDeleteId(menu.id);
                                  setOpenDeleteDialog(true);
                                }}
                                className="text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 bg-white shadow-md hover:shadow-lg transition-all px-6 py-2"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {menus.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No menu items yet
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Add your first menu item to get started
            </p>
            <Link href="/admin/menu/add">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu
              </Button>
            </Link>
          </div>
        ) : (
          menus.map((menu) => {
            const isEditing = editId === menu.id;
            const hasImageError = imageErrors.has(menu.id);
            
            return (
              <div
                key={menu.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {isEditing ? (
                  // Mobile Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Editing Menu</p>
                        <p className="text-xs text-slate-500">ID: {menu.id}</p>
                      </div>
                    </div>
                    
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      placeholder="Menu name"
                      className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    
                    <Input
                      name="description"
                      value={editForm.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <Input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleChange}
                      placeholder="Price"
                      className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <Input
                      name="image"
                      value={editForm.image}
                      onChange={handleChange}
                      placeholder="Image URL"
                      className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(menu.id)}
                        disabled={isSaving}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={isSaving}
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
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 flex-shrink-0">
                        <img
                          src={hasImageError || !menu.image ? getPlaceholderImage() : menu.image}
                          alt={menu.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(menu.id)}
                          onLoad={() => handleImageLoad(menu.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg mb-2 truncate">
                          {menu.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {menu.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-100 text-blue-800 text-xs"
                          >
                            {menu.category.name}
                          </Badge>
                          <div className="text-lg font-bold text-green-600">
                            Rp {menu.price.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-3 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(menu)}
                        className="flex-1 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteId(menu.id);
                          setOpenDeleteDialog(true);
                        }}
                        className="flex-1 text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
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
                  Delete Menu Item
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-600 leading-relaxed">
              Are you sure you want to delete this menu item? This action cannot be undone and will permanently remove the item from your menu.
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
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}