"use client";

import { Calendar, Globe, MoreVertical } from "lucide-react";
import { Block } from "./types";

interface PhonePreviewProps {
  blocks: Block[];
}

export function PhonePreview({ blocks }: PhonePreviewProps) {
  return (
    <div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] shadow-xl border border-white/10 sticky top-6 overflow-hidden">
      <div className="absolute inset-[2px] rounded-[2.4rem] overflow-hidden bg-background">
        {/* Status Bar */}
        <div className="relative w-full h-7 bg-background px-4 flex items-center justify-between z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-muted rounded-b-[1rem] flex items-center justify-center">
            <div className="w-[8px] h-[8px] bg-foreground/80 rounded-full absolute right-4" />
          </div>
        </div>

        {/* App Content */}
        <div className="relative h-[calc(100%-27px)] w-full overflow-y-auto">
          {/* Profile Content */}
          <div className="flex flex-col items-center pt-8 px-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden">
              <div className="w-full h-full bg-muted-foreground/5" />
            </div>
            
            {/* Profile Name */}
            <h3 className="mt-4 text-xl font-semibold text-foreground">@hoteldesdunes</h3>
            <p className="text-sm text-muted-foreground mt-1">Hotel des Dunes</p>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-5 h-5 text-foreground/80" />
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Globe className="w-5 h-5 text-foreground/80" />
              </div>
            </div>

            {/* Blocks */}
            {blocks.map((block) => (
              <div key={block.id} className="w-full mt-8">
                <h4 className="text-sm font-medium mb-3 px-2 text-muted-foreground">{block.name}</h4>
                <div className="space-y-3">
                  {block.links.filter(link => link.status === "active").map((link) => (
                    <div
                      key={link.id}
                      className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors cursor-pointer"
                    >
                      <span className="text-foreground">{link.name}</span>
                      <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[5px] flex items-center justify-center pb-1">
          <div className="w-[134px] h-1 bg-muted-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
} 