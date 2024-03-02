import { z } from "zod";
import { ELookingFor, ESearchGender } from "@/app/shared/enums/form";

export const filterSchema = z.object({
  id: z.number(),
  searchGender: z.enum([
    ESearchGender.Man,
    ESearchGender.Woman,
    ESearchGender.All,
  ]),
  lookingFor: z.enum([
    ELookingFor.Relationship,
    ELookingFor.Sex,
    ELookingFor.Chat,
    ELookingFor.Friendship,
    ELookingFor.Dates,
    ELookingFor.Business,
  ]),
  ageFrom: z.number(),
  ageTo: z.number(),
  distance: z.number(),
  page: z.number(),
  size: z.number(),
});
