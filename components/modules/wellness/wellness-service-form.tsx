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
import { toast } from "sonner";

const wellnessServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["massage", "spa", "beauty", "fitness", "meditation"], {
    required_error: "Category is required",
  }),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().min(1, "Currency is required"),
  images: z.array(z.string()),
  benefits: z.array(z.string()),
  contraindications: z.array(z.string()),
});

type WellnessServiceFormData = z.infer<typeof wellnessServiceSchema>;

interface WellnessServiceFormProps {
  initialData?: WellnessServiceFormData;
  onSubmit: (data: WellnessServiceFormData) => Promise<void>;
  onCancel: () => void;
}

export function WellnessServiceForm({
  initialData,
  onSubmit,
  onCancel,
}: WellnessServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || []
  );
  const [contraindications, setContraindications] = useState<string[]>(
    initialData?.contraindications || []
  );
  const [newBenefit, setNewBenefit] = useState("");
  const [newContraindication, setNewContraindication] = useState("");

  const form = useForm<WellnessServiceFormData>({
    resolver: zodResolver(wellnessServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "massage",
      duration: 60,
      price: 0,
      currency: "EUR",
      images: [],
      benefits: [],
      contraindications: [],
      ...initialData,
    },
  });

  const handleSubmit = async (data: WellnessServiceFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        benefits,
        contraindications,
      });
      toast.success(
        initialData ? "Service updated successfully" : "Service created successfully"
      );
    } catch (error) {
      toast.error(
        initialData
          ? "Failed to update service"
          : "Failed to create service"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleAddContraindication = () => {
    if (newContraindication.trim()) {
      setContraindications([...contraindications, newContraindication.trim()]);
      setNewContraindication("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleRemoveContraindication = (index: number) => {
    setContraindications(contraindications.filter((_, i) => i !== index));
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
                  <FormLabel>Service Name</FormLabel>
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
                      <SelectItem value="massage">Massage</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
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
            </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits & Contraindications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormLabel>Benefits</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit"
                />
                <Button type="button" onClick={handleAddBenefit}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{benefit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBenefit(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <FormLabel>Contraindications</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newContraindication}
                  onChange={(e) => setNewContraindication(e.target.value)}
                  placeholder="Add a contraindication"
                />
                <Button type="button" onClick={handleAddContraindication}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {contraindications.map((contraindication, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{contraindication}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContraindication(index)}
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
              ? "Update Service"
              : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 