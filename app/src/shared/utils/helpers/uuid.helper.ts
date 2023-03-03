/**
 * check uuid v4
 */
export function isUuid(value: string): boolean {
  return (
    typeof value === 'string' &&
    !!value.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  );
}
