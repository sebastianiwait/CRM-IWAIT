import { useCallback } from 'react';
import {
  Deal,
  DealActivity,
  DealContact,
  DealStage,
  ActivityKind,
  newId,
  todayISO
} from '../data/crmData';
import { usePersistedState } from './usePersistedState';

export type NewDealInput = Omit<Deal, 'id' | 'createdAt' | 'contacts' | 'activities'> &
  Partial<Pick<Deal, 'contacts' | 'activities'>>;

export function useDeals(initial: Deal[], triggerToast: (msg: string) => void) {
  const [deals, setDeals] = usePersistedState<Deal[]>('deals', initial);

  /** Actualiza un deal por id y refresca updatedAt */
  const patchDeal = useCallback((id: string, updater: (d: Deal) => Deal) => {
    setDeals((cur) => cur.map((d) => (d.id === id ? { ...updater(d), updatedAt: todayISO() } : d)));
  }, []);

  const addDeal = useCallback(
    (input: NewDealInput): string => {
      const id = newId('deal');
      const deal: Deal = {
        ...input,
        id,
        createdAt: todayISO(),
        contacts: input.contacts ?? [],
        activities: input.activities ?? []
      };
      setDeals((cur) => [deal, ...cur]);
      triggerToast(`Negocio "${deal.name}" creado`);
      return id;
    },
    [triggerToast]
  );

  const updateDeal = useCallback(
    (id: string, patch: Partial<Omit<Deal, 'id'>>) => {
      patchDeal(id, (d) => ({ ...d, ...patch }));
      triggerToast('Negocio actualizado');
    },
    [patchDeal, triggerToast]
  );

  /** Mueve de etapa y registra la actividad automática (comportamiento HubSpot) */
  const moveStage = useCallback(
    (id: string, stage: DealStage) => {
      patchDeal(id, (d) => {
        if (d.stage === stage) return d;
        const entry: DealActivity = {
          id: newId('ac'),
          kind: 'Nota',
          text: `Etapa movida de "${d.stage}" a "${stage}"`,
          date: todayISO(),
          author: 'Sistema',
          system: true
        };
        return { ...d, stage, activities: [entry, ...d.activities] };
      });
      triggerToast(`Negocio movido a ${stage}`);
    },
    [patchDeal, triggerToast]
  );

  const deleteDeal = useCallback(
    (id: string) => {
      setDeals((cur) => {
        const target = cur.find((d) => d.id === id);
        if (target) triggerToast(`Negocio "${target.name}" eliminado`);
        return cur.filter((d) => d.id !== id);
      });
    },
    [triggerToast]
  );

  const addActivity = useCallback(
    (dealId: string, input: { kind: ActivityKind; text: string; date?: string; author?: string }) => {
      const entry: DealActivity = {
        id: newId('ac'),
        kind: input.kind,
        text: input.text,
        date: input.date || todayISO(),
        author: input.author || 'Sebastian M.'
      };
      patchDeal(dealId, (d) => ({ ...d, activities: [entry, ...d.activities] }));
      triggerToast(`${input.kind} registrada`);
    },
    [patchDeal, triggerToast]
  );

  const upsertContact = useCallback(
    (dealId: string, contact: DealContact | Omit<DealContact, 'id'>) => {
      const withId: DealContact =
        'id' in contact && contact.id ? (contact as DealContact) : { ...contact, id: newId('ct') };

      patchDeal(dealId, (d) => {
        const exists = d.contacts.some((c) => c.id === withId.id);
        let contacts = exists
          ? d.contacts.map((c) => (c.id === withId.id ? withId : c))
          : [...d.contacts, withId];

        // Solo un contacto principal por negocio
        if (withId.isPrimary) {
          contacts = contacts.map((c) => (c.id === withId.id ? c : { ...c, isPrimary: false }));
        }
        return { ...d, contacts };
      });
      triggerToast(`Contacto ${'id' in contact && contact.id ? 'actualizado' : 'añadido'}`);
    },
    [patchDeal, triggerToast]
  );

  const deleteContact = useCallback(
    (dealId: string, contactId: string) => {
      patchDeal(dealId, (d) => ({ ...d, contacts: d.contacts.filter((c) => c.id !== contactId) }));
      triggerToast('Contacto eliminado');
    },
    [patchDeal, triggerToast]
  );

  return {
    deals,
    addDeal,
    updateDeal,
    moveStage,
    deleteDeal,
    addActivity,
    upsertContact,
    deleteContact
  };
}
