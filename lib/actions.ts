"use server"
import { RegisterSchema, SigninSchema, CategorySchema, MenuSchema  } from "@/lib/zod"
import { hashSync } from "bcrypt-ts"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import {put} from "@vercel/blob"
import { revalidatePath } from "next/cache"

export const getUserRole = async (email: string): Promise<"ADMIN" | "USER" | "KURIR" | "DAPUR" | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    return user?.role ?? null;
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
};

export const signUpCredentials = async(prevState: unknown, formData: FormData) => {

    const validateFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

    if(!validateFields.success) {
        return {
            error: validateFields.error.flatten().fieldErrors
        }
    }

    const {name, email, password} = validateFields.data
    const hashedPassword = hashSync(password, 10)

    try {
        await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })
    } catch (error: any) {
        if (error.code === "P2002") {
            return { error: { email: "Email is already registered" } }
         }
        return { message: "Failed to register user" }
    }
    redirect("/login")
}

export const SignInCredentials = async(prevstate: unknown, formData:FormData) => {
    const validateFields = SigninSchema.safeParse(Object.fromEntries(formData.entries()))

    if(!validateFields.success) {
        return {
            error: validateFields.error.flatten().fieldErrors
        }
    }

    const {email, password} = validateFields.data

    try {
        await signIn("credentials", {email, password, redirect: true, callbackUrl: "/redirect"})
    } catch (error) {
        if (error instanceof AuthError) {
      if (error.message?.toLowerCase().includes("credentials")) {
        return { message: "Invalid email or password." };
      }
      return { message: "Authentication failed." };
    }
    throw error
  }
}

export const UploadImageCategory = async (prevState: unknown, formData: FormData) => {
    const validateFields = CategorySchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validateFields.success) {
        return {
            error: validateFields.error.flatten().fieldErrors,
        };
    }

    const { name, image } = validateFields.data;

        const existingCategoryWithSameImage = await prisma.category.findFirst({
            where: {
                image: {
                    contains: image.name,
                },
            },
        });

        let imageUrl: string;

        if (existingCategoryWithSameImage) {
            imageUrl = existingCategoryWithSameImage.image;
        } else {
            const { url } = await put(image.name, image, {
                access: "public",
                multipart: true,
                addRandomSuffix: true,
            });
            imageUrl = url;
        }

       try {
    await prisma.category.create({
      data: {
        name,
        image: imageUrl,
      }
    })
  } catch (error) {
    return { message: "Failed to add menu" }
  }
    revalidatePath("/admin/category");
    redirect("/admin/category");
}


export const UploadImageMenu = async (prevState: unknown, formData: FormData) => {
  const validateFields = MenuSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, price, categoryId, image } = validateFields.data

  const existingMenuWithImage = await prisma.menu.findFirst({
    where: {
      image: {
        contains: image.name,
      }
    }
  })

  let imageUrl: string

  if (existingMenuWithImage) {
    imageUrl = existingMenuWithImage.image
  } else {
    const { url } = await put(image.name, image, {
      access: "public",
      multipart: true,
      addRandomSuffix: true,
    })
    imageUrl = url
  }

  try {
    await prisma.menu.create({
      data: {
        name,
        description,
        price,
        categoryId,
        image: imageUrl,
      }
    })
  } catch (error) {
    return { message: "Failed to add menu" }
  }

  revalidatePath("/admin/menu")
  redirect("/admin/menu")
}

