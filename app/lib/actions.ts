"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { AuthError } from "next-auth";
import { signIn } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password'
        default: 
          return 'Something went wrong. Please try again.'
      }
    }
    throw error
  }
}

const formSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer",
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }), // nota dado que el valor de amut se extra por defecto como string, se convierte a number con coerece.number()
  // entonces se convierte y se valida a la vez, en lugar de solo validar ej: z.number, gt asegura que el valor sea un numero y que sea mayor a 0
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a invoice status",
  }),
  date: z.string(),
});
const CreateInvoice = formSchema.omit({
  id: true,
  date: true,
});

const UpdateInvoice = formSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  // Nota: safeParse() retorna un objeto con un atributo success que indica si la validación fue exitosa o no
  const validatedFields = CreateInvoice.safeParse({ 
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  console.log({ validatedFields })
  // If form validation fails, return errors, earl8y, Otherwise, continue with the form submission
  if (!validatedFields.success) {
  
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Missing Fields. Failed to Create Invoice.' };
  }
  // Prepare data for insertion into the database, parse the form data, and convert the amount to cents
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const ammountInCents = amount * 100; // result: 230 to 23000
  const date = new Date().toISOString().split("T")[0]; // nota: toISOString() retorna la fecha en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

  // Insert the new invoice into the database using postgres SQL
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${ammountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/dashboard/invoices"); // limpia el cache de la página de facturas y desencadena una nueva solicitud de datos para la pagina (esto debido a que puede estar cacheada)
  redirect("/dashboard/invoices"); // hecho lo anterior al redirigir a la pagina de facturas se obtienen los datos actualizados
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  })
  console.log({ validatedFields })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    }
  }

  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
