
import React from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isSelected, onSelect, disabled }) => {
  const baseClasses = "relative rounded-lg overflow-hidden group transform transition-all duration-300 ease-in-out cursor-pointer shadow-lg";
  const stateClasses = isSelected
    ? 'ring-4 ring-red-500 scale-105'
    : `ring-2 ring-transparent ${!disabled ? 'hover:scale-105 hover:shadow-2xl hover:ring-red-400' : 'opacity-60'}`;
  
  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={() => !disabled && onSelect(candidate.id)}
    >
      <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-auto aspect-square object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white text-xl font-bold">{candidate.name}</h3>
      </div>
    </div>
  );
};

export default CandidateCard;