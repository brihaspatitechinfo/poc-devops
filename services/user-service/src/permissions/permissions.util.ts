export function flattenPermissions(
  permissions: Record<string, string[]>,
): string[] {
  const flat: string[] = [];
  for (const module in permissions) {
    for (const action of permissions[module]) {
      flat.push(`${module}:${action}`);
    }
  }
  return flat;
}
