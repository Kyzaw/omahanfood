import { object, string, z } from "zod";

export const RegisterSchema = object ({
    name: string().min(1, "Name must be more than 1 Character"),
    email: string().email("Invalid Email"),
    password: string().min(8, "Password must be more than 8 Character").max(32, "Password must be less than 32 Character")
})

export const SigninSchema = object ({
    email: string().email("Invalid Email"),
    password: string().min(8, "Password must be more than 8 Character").max(32, "Password must be less than 32 Character")
})

export const CategorySchema = z.object({
    name: z.string().min(1),
    image: z.instanceof(File).refine((file) => file.size > 0, {message: "Image is required"})
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), {message: "Only images are allowed"})
    .refine((file) => file.size < 4000000, {message: "Image must less than 4MB"}),
})

export const MenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1000, "Price must be than 1000"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.instanceof(File, { message: "Image is required" }).refine((file) => file.size > 0, "Only images are allowed"),
})
