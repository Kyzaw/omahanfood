"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <Card className="mt-6 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <TableHead className="text-left w-[100px] font-semibold text-slate-700">Image</TableHead>
                <TableHead className="text-left w-[200px] font-semibold text-slate-700">Name</TableHead>
                <TableHead className="text-left font-semibold text-slate-700">Description</TableHead>
                <TableHead className="text-left w-[120px] font-semibold text-slate-700">Category</TableHead>
                <TableHead className="text-left w-[120px] font-semibold text-slate-700">Price</TableHead>
                <TableHead className="text-center w-[180px] font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.map((menu, index) => {
                const isEditing = editId === menu.id;
                const hasImageError = imageErrors.has(menu.id);
                
                return (
                  <TableRow 
                    key={menu.id} 
                    className={`
                      hover:bg-slate-50 transition-colors duration-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}
                      border-b border-slate-100
                    `}
                  >
                    <TableCell className="py-4">
                      <div className="relative w-15 h-15 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm">
                        {isEditing ? (
                          <div className="w-full h-full flex flex-col">
                            <Input
                              name="image"
                              value={editForm.image}
                              onChange={handleChange}
                              placeholder="Image URL"
                              className="text-xs h-4 mb-1"
                            />
                            <div className="flex-1 bg-slate-100 rounded flex items-center justify-center">
                              <span className="text-xs text-slate-500">Preview</span>
                            </div>
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
                    </TableCell>
                    
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input
                          name="name"
                          value={editForm.name}
                          onChange={handleChange}
                          placeholder="Menu name"
                          className="font-medium"
                        />
                      ) : (
                        <div className="font-semibold text-slate-800 text-lg">
                          {menu.name}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input
                          name="description"
                          value={editForm.description}
                          onChange={handleChange}
                          placeholder="Description"
                        />
                      ) : (
                        <div className="text-slate-600 whitespace-normal text-sm leading-relaxed max-w-xs">
                          {menu.description}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {menu.category.name}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input
                          name="price"
                          type="number"
                          value={editForm.price}
                          onChange={handleChange}
                          placeholder="Price"
                        />
                      ) : (
                        <div className="font-bold text-green-600 text-lg">
                          Rp {menu.price.toLocaleString('id-ID')}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-center py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleEdit(menu.id)}
                              disabled={isSaving}
                              className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                              {isSaving ? (
                                <div className="flex items-center space-x-1">
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Saving...</span>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditId(null)}
                              className="border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditId(menu.id);
                                setEditForm({
                                  name: menu.name,
                                  description: menu.description,
                                  categoryId: menu.categoryId,
                                  price: String(menu.price),
                                  image: menu.image || "",
                                });
                              }}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setDeleteId(menu.id);
                                setOpenDeleteDialog(true);
                              }}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {menus.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">No menus found</div>
            <div className="text-slate-500 text-sm">Add your first menu item to get started</div>
          </div>
        )}
      </CardContent>

      {/* Enhanced AlertDialog for delete confirmation */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-800">
              Delete Menu Item
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 text-base leading-relaxed">
              Are you sure you want to delete this menu item? This action cannot be undone and will permanently remove the item from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-3">
            <AlertDialogCancel 
              onClick={() => setOpenDeleteDialog(false)}
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={handleDelete}
            >
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}