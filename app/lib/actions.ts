"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // nota dado que el valor de amut se extra por defecto como string, se convierte a number con coerece.number()
  // entonces se convierte y se valida a la vez, en lugar de solo validar ej: z.number()
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateInvoice = formSchema.omit({
  id: true,
  date: true,
});

const UpdateInvoice = formSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const ammountInCents = amount * 100; // result: 230 to 23000
  const date = new Date().toISOString().split("T")[0]; // nota: toISOString() retorna la fecha en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${ammountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/dashboard/invoices"); // limpia el cache de la pagina de facturas y desencadena una nueva solicitud de datos para la pagina (esto debido a que puede estar cacheada)
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
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
