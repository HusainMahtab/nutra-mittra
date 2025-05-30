// Simplified toast implementation
import { useState, useEffect } from 'react';

type ToastProps = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

export function toast(props: ToastProps) {
  // In a real implementation, this would use a context provider
  // For now, we'll just use alert as a simple fallback
  const message = `${props.title}: ${props.description}`;
  alert(message);
}