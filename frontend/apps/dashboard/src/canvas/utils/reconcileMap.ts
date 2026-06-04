type Identifiable = { id: string };
type Syncable<T> = { applyDto: (dto: T) => void };

export const reconcileMap = <
  TDto extends Identifiable,
  TEntity extends Syncable<TDto>,
>(
  map: Map<string, TEntity>,
  dtos: TDto[],
  create: (dto: TDto) => TEntity,
) => {
  const seen = new Set<string>();
  for (const dto of dtos) {
    seen.add(dto.id);
    const existing = map.get(dto.id);
    if (existing) existing.applyDto(dto);
    else map.set(dto.id, create(dto));
  }
  for (const id of map.keys()) if (!seen.has(id)) map.delete(id);
};
