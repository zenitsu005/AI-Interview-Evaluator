import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'card' | 'avatar' | 'button'
  className = '',
}) {
  const variantStyles = {
    text: 'h-4 w-full rounded-md bg-zinc-800/60 animate-pulse',
    card: 'h-40 w-full rounded-2xl bg-zinc-800/50 animate-pulse border border-zinc-800/40',
    avatar: 'h-10 w-10 rounded-full bg-zinc-800/60 animate-pulse',
    button: 'h-10 w-28 rounded-xl bg-zinc-800/60 animate-pulse',
  };

  return <div className={`${variantStyles[variant]} ${className}`} />;
}
