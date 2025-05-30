import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({ text, maxLength = 150, className = '' }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If text is shorter than maxLength, don't show the toggle
  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }
  
  const displayText = isExpanded ? text : `${text.substring(0, maxLength)}...`;
  
  return (
    <div className={`${className}`}>
      <p className="whitespace-pre-line">{displayText}</p>
      <Button
        variant="ghost"
        size="sm"
        className="mt-1 h-8 px-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show more <ChevronDown size={16} />
          </>
        )}
      </Button>
    </div>
  );
}