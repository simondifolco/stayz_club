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
import { Transfer } from "@/lib/modules/types";

const transferSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["airport", "station", "port", "custom"]),
  vehicle: z.object({
    type: z.string().min(1, "Vehicle type is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    features: z.array(z.string()),
    image: z.string().optional(),
  }),
  price: z.number().min(0, "Price must be non-negative"),
  currency: z.string().min(1, "Currency is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  distance: z.number().min(0, "Distance must be non-negative"),
  route: z.object({
    pickup: z.object({
      name: z.string().min(1, "Pickup name is required"),
      address: z.string().min(1, "Pickup address is required"),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    dropoff: z.object({
      name: z.string().min(1, "Dropoff name is required"),
      address: z.string().min(1, "Dropoff address is required"),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
  }),
  availableVehicles: z.number().min(0, "Available vehicles must be non-negative"),
  requirements: z.array(z.string()),
  cancellationPolicy: z.object({
    deadline: z.number().min(0, "Deadline must be non-negative"),
    refundPercentage: z.number().min(0).max(100, "Percentage must be 0-100"),
  }),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  initialData?: Transfer;
  onSubmit: (data: TransferFormData) => Promise<void>;
  onCancel: () => void;
}

export function TransferForm({
  initialData,
  onSubmit,
  onCancel,
}: TransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(
    initialData?.vehicle.features || []
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || []
  );
  const [newFeature, setNewFeature] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      type: "airport",
      vehicle: {
        type: "",
        capacity: 4,
        features: [],
        image: "",
      },
      price: 0,
      currency: "USD",
      duration: 30,
      distance: 0,
      route: {
        pickup: {
          name: "",
          address: "",
          coordinates: { lat: 0, lng: 0 },
        },
        dropoff: {
          name: "",
          address: "",
          coordinates: { lat: 0, lng: 0 },
        },
      },
      availableVehicles: 1,
      requirements: [],
      cancellationPolicy: {
        deadline: 24,
        refundPercentage: 80,
      },
    },
  });

  const handleSubmit = async (data: TransferFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        vehicle: {
          ...data.vehicle,
          features,
        },
        requirements,
      });
      toast.success(
        initialData ? "Transfer updated successfully" : "Transfer created successfully"
      );
    } catch (error) {
      toast.error(
        initialData
          ? "Failed to update transfer"
          : "Failed to create transfer"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureAdd = (feature: string) => {
    if (feature && !features.includes(feature)) {
      const updatedFeatures = [...features, feature];
      setFeatures(updatedFeatures);
      form.setValue("vehicle.features", updatedFeatures);
    }
  };

  const handleFeatureRemove = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    form.setValue("vehicle.features", updatedFeatures);
  };

  const handleRequirementAdd = (requirement: string) => {
    if (requirement && !requirements.includes(requirement)) {
      const updatedRequirements = [...requirements, requirement];
      setRequirements(updatedRequirements);
      form.setValue("requirements", updatedRequirements);
    }
  };

  const handleRequirementRemove = (index: number) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    form.setValue("requirements", updatedRequirements);
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
                  <FormLabel>Transfer Name</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="airport">Airport Transfer</SelectItem>
                      <SelectItem value="station">Station Transfer</SelectItem>
                      <SelectItem value="port">Port Transfer</SelectItem>
                      <SelectItem value="custom">Custom Transfer</SelectItem>
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
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle.capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passenger Capacity</FormLabel>
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
            <div className="space-y-4">
              <FormLabel>Vehicle Features</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                />
                <Button type="button" onClick={() => handleFeatureAdd(newFeature)}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeatureRemove(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <FormField
              control={form.control}
              name="availableVehicles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Vehicles</FormLabel>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
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
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pickup & Dropoff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormLabel>Pickup Location</FormLabel>
              <FormField
                control={form.control}
                name="route.pickup.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="route.pickup.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="route.pickup.coordinates.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
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
                  name="route.pickup.coordinates.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
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
            </div>

            <div className="space-y-4">
              <FormLabel>Dropoff Location</FormLabel>
              <FormField
                control={form.control}
                name="route.dropoff.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="route.dropoff.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="route.dropoff.coordinates.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
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
                  name="route.dropoff.coordinates.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements & Cancellation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <FormLabel>Requirements</FormLabel>
              <div className="flex space-x-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement"
                />
                <Button type="button" onClick={() => handleRequirementAdd(newRequirement)}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span>{requirement}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRequirementRemove(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cancellationPolicy.deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Deadline (hours)</FormLabel>
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
                name="cancellationPolicy.refundPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Percentage</FormLabel>
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
              ? "Update Transfer"
              : "Create Transfer"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 