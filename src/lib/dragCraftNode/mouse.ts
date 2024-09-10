export const mouseOnLeftHalf = (e: MouseEvent, el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect();
  return e.clientX - rect.left < rect.width / 2;
};

export const mouseOnTopHalf = (e: MouseEvent, el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect();
  return e.clientY - rect.top < rect.height / 2;
};

export const mouseOnEdge = (e: MouseEvent, el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect();
  return (
    e.clientX - rect.left < 15 ||
    e.clientY - rect.top < 15 ||
    rect.right - e.clientX < 15 ||
    rect.bottom - e.clientY < 15
  );
};
