"use client";

interface Avatar {
  name: string;
  url: string;
}

interface Props {
  avatars: Avatar[];
  selected: string;
  onSelect: (url: string) => void;
  label: string;
}

export default function AvatarPicker({
  avatars,
  selected,
  onSelect,
  label,
}: Props) {
  return (
    <div className="space-y-2 flex flex-col pt-1">
      <span className="text-xs text-stone-400 font-medium">{label}</span>
      <div className="flex space-x-3.5">
        {avatars.map((av) => (
          <button
            key={av.name}
            type="button"
            onClick={() => onSelect(av.url)}
            className={`cursor-pointer relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
              selected === av.url
                ? "border-amber-500 scale-110 shadow-lg"
                : "border-stone-800 opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={av.url}
              alt={av.name}
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
