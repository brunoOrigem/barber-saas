import { Service } from '../data/mock';

export type SelectionResult = {
  serviceIds: string[];
  /** Pacote escolhido automaticamente no lugar dos serviços avulsos que ele inclui. */
  mergedInto?: Service;
};

/** Serviços travados por já estarem incluídos em um pacote selecionado (ex: corte com o combo). */
export function getLockedServiceIds(selectedIds: string[], services: Service[]) {
  return new Set(
    services
      .filter((s) => selectedIds.includes(s.id))
      .flatMap((s) => s.includes ?? []),
  );
}

/**
 * Alterna um serviço respeitando as regras de exclusividade:
 * - escolher um pacote remove os serviços que ele já inclui;
 * - escolher todos os itens de um pacote ativo troca os avulsos pelo pacote.
 */
export function toggleServiceSelection(
  selectedIds: string[],
  id: string,
  services: Service[],
): SelectionResult {
  if (selectedIds.includes(id)) {
    return { serviceIds: selectedIds.filter((sid) => sid !== id) };
  }
  if (getLockedServiceIds(selectedIds, services).has(id)) {
    return { serviceIds: selectedIds };
  }

  const includes = services.find((s) => s.id === id)?.includes ?? [];
  const next = [...selectedIds.filter((sid) => !includes.includes(sid)), id];

  const bundle = services.find(
    (s) =>
      s.active &&
      !!s.includes?.length &&
      !next.includes(s.id) &&
      s.includes.every((included) => next.includes(included)),
  );
  if (!bundle) return { serviceIds: next };

  return {
    serviceIds: [...next.filter((sid) => !bundle.includes?.includes(sid)), bundle.id],
    mergedInto: bundle,
  };
}

/** Aplica as regras a uma seleção vinda de fora (ex: "Agendar novamente"), ignorando inativos. */
export function normalizeSelection(ids: string[], services: Service[]) {
  const available = ids.filter((id) => services.some((s) => s.id === id && s.active));
  return available.reduce<string[]>(
    (selected, id) => toggleServiceSelection(selected, id, services).serviceIds,
    [],
  );
}
