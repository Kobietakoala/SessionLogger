import { z } from 'zod';

//@todo - dodać tłumaczenia
export const createStudentSchema = z.object({
  name: z.string()
    .min(2, 'Imię musi mieć min. 2 znaki')
    .max(64, 'Imię max 64 znaki')
    .trim(),

  class: z.string()
    .min(1, 'Klasa wymagana')
    .max(50, 'Klasa max 50 znaków')
    .trim(),

  phone: z.string()
    .max(20, 'Telefon max 20 znaków')
    .optional()
    .or(z.literal('')),

  price: z.number()
    .int()
    .min(0, 'Cena min. 0 zł')
    .max(1000, 'Cena max. 1000 zł'),
});

export const updateStudentSchema = createStudentSchema.partial();

export const getStudentByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID musi być liczbą')
  })
});
