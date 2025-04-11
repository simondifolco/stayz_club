"use client";

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Block } from '@/components/dashboard/links/types';
import { Button } from "@/components/ui/button";
import { Palette, Plus } from "lucide-react";
import { useHotelItems } from '@/hooks/use-hotel-items';
import { AddBlockDialog } from '@/components/dashboard/links/add-block-dialog';

const LinksPageContent = dynamic(
  () => import('@/components/dashboard/links/links-page-content').then(mod => mod.LinksPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
) as typeof import('@/components/dashboard/links/links-page-content')['LinksPageContent'];

const MobilePreview = dynamic(
  () => import('@/components/dashboard/links/mobile-preview').then(mod => mod.MobilePreview),
  {
    ssr: false,
    loading: () => (
      <div className="w-[375px] h-[667px] bg-muted rounded-[3rem] border-8 border-background animate-pulse" />
    )
  }
) as typeof import('@/components/dashboard/links/mobile-preview')['MobilePreview'];

export default function LinksPage() {
  const { blocks, loading, addBlock } = useHotelItems();
  const [isAddBlockDialogOpen, setIsAddBlockDialogOpen] = useState(false);

  const handleAddBlock = async (name: string) => {
    await addBlock(name);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6">
        {/* Links Editor */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Links</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsAddBlockDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
              <Link href="/dashboard/theme">
                <Button variant="outline">
                  <Palette className="mr-2 h-4 w-4" />
                  Theme Settings
                </Button>
              </Link>
            </div>
          </div>
          <LinksPageContent />
        </div>

        {/* Mobile Preview */}
        <div className="hidden lg:block">
          <MobilePreview blocks={blocks} />
        </div>
      </div>
      <AddBlockDialog 
        open={isAddBlockDialogOpen} 
        onOpenChange={setIsAddBlockDialogOpen}
        onAdd={handleAddBlock}
      />
    </>
  );
} 