export function formatWeight(kg: number, isImperial: boolean): string {
  if (isImperial) {
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  }
  return `${kg} kg`;
}

export function formatMacro(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function formatCalories(kcal: number): string {
  return `${Math.round(kcal)} kcal`;
}

export function formatVolume(kg: number, isImperial: boolean): string {
  if (isImperial) {
    return `${Math.round(kg * 2.20462).toLocaleString()} lbs`;
  }
  return `${Math.round(kg).toLocaleString()} kg`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
