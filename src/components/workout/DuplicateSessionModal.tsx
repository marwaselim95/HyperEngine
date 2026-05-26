import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WorkoutSession } from '../../types';
import { ExerciseBlock } from './ExerciseBlock';
import { todayISO } from '../../utils/dateUtils';
import { generateId } from '../../utils/formatters';

interface DuplicateSessionModalProps {
  source: WorkoutSession | null;
  onConfirm: (session: WorkoutSession) => void;
  onClose: () => void;
  isImperial: boolean;
}

export function DuplicateSessionModal({
  source,
  onConfirm,
  onClose,
  isImperial,
}: DuplicateSessionModalProps) {
  const [draft, setDraft] = useState<WorkoutSession | null>(() =>
    source
      ? {
          ...source,
          id: generateId(),
          date: todayISO(),
          templateId: source.id,
          exercises: source.exercises.map((b) => ({
            ...b,
            id: generateId(),
            sets: b.sets.map((s) => ({
              ...s,
              id: generateId(),
              completedAt: new Date().toISOString(),
            })),
          })),
        }
      : null,
  );

  if (!draft) return null;

  return (
    <Modal
      isOpen={!!source}
      onClose={onClose}
      title={`Repeat: ${source?.name}`}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => { onConfirm(draft); onClose(); }}
            id="confirm-duplicate-session"
          >
            Save Session
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Session Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            id="duplicate-session-name"
          />
          <Input
            label="Date"
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            id="duplicate-session-date"
          />
        </div>

        <p className="text-xs text-muted">
          Adjust weights and reps below for progressive overload before saving.
        </p>

        <div className="flex flex-col gap-3">
          {draft.exercises.map((block, i) => (
            <ExerciseBlock
              key={block.id}
              block={block}
              onChange={(updated) => {
                const exercises = draft.exercises.map((b, idx) =>
                  idx === i ? updated : b,
                );
                setDraft({ ...draft, exercises });
              }}
              onDelete={() => {
                setDraft({
                  ...draft,
                  exercises: draft.exercises.filter((_, idx) => idx !== i),
                });
              }}
              isImperial={isImperial}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
