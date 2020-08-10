let id = 0;

export function nanoid() {
  id++;
  return 'id-' + id;
}
