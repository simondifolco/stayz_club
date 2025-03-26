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

const rentalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["sports", "electronics", "equipment", "vehicles", "other"], {
    required_error: "Category is required",
  }),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().min(1, "Currency is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  availableQuantity: z.number().min(0, "Available quantity must be 0 or greater"),
  images: z.array(z.string()),
  specifications: z.array(z.string()),
  requirements: z.array(z.string()),
  isAvailable: z.boolean(),
  maintenanceSchedule: z.object({
    lastMaintenance: z.string(),
    nextMaintenance: z.string(),
    maintenanceInterval: z.number(),
  }),
  insuranceRequired: z.boolean(),
  depositAmount: z.number().min(0, "Deposit amount must be 0 or greater"),
});

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  initialData?: RentalFormData;
  onSubmit: (data: RentalFormData) => Promise<void>;
  onCancel: () => void;
}

export function RentalForm({
  initialData,
  onSubmit,
  onCancel,
}: RentalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [specifications, setSpecifications] = useState<string[]>(
    initialData?.specifications || []
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || []
  );
  const [newSpecification, setNewSpecification] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const form = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "equipment",
      price: 0,
      currency: "EUR",
      quantity: 1,
      availableQuantity: 0,
      images: [],
      specifications: [],
      requirements: [],
      isAvailable: true,
      maintenanceSchedule: {
        lastMaintenance: new Date().toISOString().split("T")[0],
        nextMaintenance: new Date().toISOString().split("T")[0],
        maintenanceInterval: 30,
      },
      insuranceRequired: false,
      depositAmount: 0,
      ...initialData,
    },
  });

  const handleSubmit = async (data: RentalFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        specifications,
        requirements,
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

  const handleAddSpecification = () => {
    if (newSpecification.trim()) {
      setSpecifications([...specifications, newSpecification.trim()]);
      setNewSpecification("");
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
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
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Price (per day)</FormLabel>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
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
                name="availableQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance & Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maintenanceSchedule.lastMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Maintenance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maintenanceSchedule.nextMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Maintenance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maintenanceSchedule.maintenanceInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Interval (days)</FormLabel>
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
              name="insuranceRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Insurance Required</FormLabel>
                    <FormDescription>
                      Require insurance for this rental item
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
            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications & Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormLabel>Specifications</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newSpecification}
                  onChange={(e) => setNewSpecification(e.target.value)}
                  placeholder="Add a specification"
                />
                <Button type="button" onClick={handleAddSpecification}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {specifications.map((spec, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{spec}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecification(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <FormLabel>Requirements</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement"
                />
                <Button type="button" onClick={handleAddRequirement}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{req}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRequirement(index)}
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