/** True while a value still holds a "[Placeholder]" from the template. */
export const isPlaceholder = (value: string) => /\[[^\]]*\]/.test(value);

/** First letter of a name, ignoring brackets: "[Partner Name]" → "P" */
export const initialOf = (name: string) => name.match(/\p{L}/u)?.[0]?.toUpperCase() ?? "";
