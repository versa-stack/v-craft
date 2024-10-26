// setValueByPath.ts

export function setValueByPath(obj: any, path: string, value: any): void {
  const parts = path.replace(/^\$\.?/, '').split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextPartArrayIndex = /^\d+$/.test(nextPart);

    if (!(part in current)) {
      current[part] = isNextPartArrayIndex ? [] : {};
    }

    if (isNextPartArrayIndex) {
      const index = parseInt(nextPart, 10);
      if (!Array.isArray(current[part])) {
        current[part] = [];
      }
      if (current[part].length <= index) {
        current[part][index] = i === parts.length - 2 ? value : {};
      }
      current = current[part][index];
      i++; // Skip the next part as we've already handled it
    } else {
      current = current[part];
    }
  }

  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    const index = parseInt(lastPart, 10);
    if (!Array.isArray(current)) {
      current = [];
    }
    current[index] = value;
  } else {
    current[lastPart] = value;
  }
}
