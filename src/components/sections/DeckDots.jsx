import React from "react";

export default function DeckDots({ total, activeIndex, onSelect }) {
  return (
    <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-4">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Перейти к карточке ${i + 1}`}
            aria-current={active}
            className={`rounded-full border transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA] ${
              active
                ? "bg-[#D7E2EA] border-[#D7E2EA] w-8 h-2.5 md:w-2.5 md:h-8"
                : "bg-transparent border-[#D7E2EA]/40 hover:border-[#D7E2EA] w-2.5 h-2.5"
            }`}
          />
        );
      })}
    </div>
  );
}