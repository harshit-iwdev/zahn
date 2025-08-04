import { Trash2, Edit3 } from "lucide-react";
import { Button } from "./ui/button";

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function TimeSlot({ startTime, endTime, onEdit, onDelete }: TimeSlotProps) {
  return (
    <div className="flex items-center justify-between bg-[#E5E3FB] rounded-lg px-3 py-2 border border-gray-200">
      <span className="text-sm text-gray-700">
        {startTime} – {endTime}
      </span>
      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="h-6 w-6 p-0 hover:bg-white/50"
        >
          <Edit3 className="h-3 w-3 text-gray-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3 w-3 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}