import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Music, Heart, Clock } from "lucide-react";

export default function LiveRadioNotice() {
  return (
    <Card className="bg-white border-gray-200 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-[var(--editorial)]/10 p-3 rounded-full">
            <Radio className="w-6 h-6 text-[var(--editorial)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[var(--charcoal)] font-semibold text-lg mb-2">
              Community Radio
            </h3>
            <p className="text-[var(--charcoal)]/70 text-sm mb-4 leading-relaxed">
              Playlists under 1 hour might get featured in our community radio sessions.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 text-[var(--editorial)]">
                <Clock className="w-4 h-4" />
                <span>Keep it under 1 hour</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--editorial)]">
                <Music className="w-4 h-4" />
                <span>Good for community listening</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}