import React from "react";
import { Label } from "@/components/ui/label";

interface Station {
  id: string;
  name: string;
}

interface StationSelectionProps {
  stations: Station[];
  originStation: string;
  destinationStation: string;
  onSelect: (type: "origin" | "destination", stationId: string) => void;
}

const StationSelection: React.FC<StationSelectionProps> = ({
  stations,
  originStation,
  destinationStation,
  onSelect,
}) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div>
        <Label htmlFor="origin">Ga Xuất Phát</Label>
        <select
          id="origin"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={originStation}
          onChange={(e) => onSelect("origin", e.target.value)}
        >
          <option value="">Chọn ga xuất phát</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="destination">Ga Đích</Label>
        <select
          id="destination"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={destinationStation}
          onChange={(e) => onSelect("destination", e.target.value)}
          disabled={originStation === ""}
        >
          <option value="">Chọn ga đích</option>
          {stations
            .filter((station) => station.id !== originStation)
            .map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
        </select>
      </div>
    </div>
    {originStation && destinationStation && (
      <div className="rounded-lg bg-muted p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              {stations.find((s) => s.id === originStation)?.name}
            </p>
          </div>
          <span className="mx-2">→</span>
          <div>
            <p className="font-medium">
              {stations.find((s) => s.id === destinationStation)?.name}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default StationSelection; 