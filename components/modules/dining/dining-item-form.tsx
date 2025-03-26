"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const diningItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["breakfast", "lunch", "dinner", "drinks", "dessert"], {
    required_error: "Category is required",
  }),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().min(1, "Currency is required"),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  isAvailable: z.boolean(),
  images: z.array(z.string()),
  allergens: z.array(z.string()),
  dietaryInfo: z.array(z.string()),
});

type DiningItemFormData = z.infer<typeof diningItemSchema>;

interface DiningItemFormProps {
  initialData?: DiningItemFormData;
  onSubmit: (data: DiningItemFormData) => Promise<void>;
  onCancel: () => void;
}

export function DiningItemForm({
  initialData,
  onSubmit,
  onCancel,
}: DiningItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allergens, setAllergens] = useState<string[]>(
    initialData?.allergens || []
  );
  const [dietaryInfo, setDietaryInfo] = useState<string[]>(
    initialData?.dietaryInfo || []
  );
  const [newAllergen, setNewAllergen] = useState("");
  const [newDietaryInfo, setNewDietaryInfo] = useState("");

  const form = useForm<DiningItemFormData>({
    resolver: zodResolver(diningItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "breakfast",
      price: 0,
      currency: "EUR",
      preparationTime: 15,
      isAvailable: true,
      images: [],
      allergens: [],
      dietaryInfo: [],
      ...initialData,
    },
  });

  const handleSubmit = async (data: DiningItemFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        allergens,
        dietaryInfo,
      });
      toast.success(
        initialData ? "Item updated successfully" : "Item created successfully"
      );
    } catch (error) {
      toast.error(
        initialData
          ? "Failed to update item"
          : "Failed to create item"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllergen = () => {
    if (newAllergen.trim()) {
      setAllergens([...allergens, newAllergen.trim()]);
      setNewAllergen("");
    }
  };

  const handleAddDietaryInfo = () => {
    if (newDietaryInfo.trim()) {
      setDietaryInfo([...dietaryInfo, newDietaryInfo.trim()]);
      setNewDietaryInfo("");
    }
  };

  const handleRemoveAllergen = (index: number) => {
    setAllergens(allergens.filter((_, i) => i !== index));
  };

  const handleRemoveDietaryInfo = (index: number) => {
    setDietaryInfo(dietaryInfo.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <FormDescription>
                      Make this item available for ordering
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dietary Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormLabel>Allergens</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  placeholder="Add an allergen"
                />
                <Button type="button" onClick={handleAddAllergen}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {allergens.map((allergen, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{allergen}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAllergen(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <FormLabel>Dietary Information</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newDietaryInfo}
                  onChange={(e) => setNewDietaryInfo(e.target.value)}
                  placeholder="Add dietary information"
                />
                <Button type="button" onClick={handleAddDietaryInfo}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {dietaryInfo.map((info, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{info}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDietaryInfo(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update Item"
              : "Create Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 