"use client";

import { Module } from "@/lib/modules/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useModuleStore } from "@/lib/modules/store";

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const toggleModule = useModuleStore((state) => state.toggleModule);

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
          {module.isActive && (
            <Badge variant="secondary" className="text-xs">
              active
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {module.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id={`module-${module.id}`}
            checked={module.enabled}
            onCheckedChange={() => toggleModule(module.id)}
          />
          <label
            htmlFor={`module-${module.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enabled
          </label>
        </div>
      </CardContent>
    </Card>
  );
} 