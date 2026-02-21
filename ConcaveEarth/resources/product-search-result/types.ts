import { z } from "zod";

export const propSchema = z.object({
  title: z.string().describe("Viewer title"),
  focus: z.string().describe("Optional requested focus keyword"),
  camera: z.object({
    lat: z.number(),
    lng: z.number(),
    fov: z.number(),
  }),
  markers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      country: z.string(),
      type: z.string(),
      lat: z.number(),
      lng: z.number(),
    })
  ),
});

export type ProductSearchResultProps = z.infer<typeof propSchema>;

export type AccordionItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};
