import { useState } from 'react';
import { Plus, ChevronLeft } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ExerciseBlock } from '../components/workout/ExerciseBlock';
import { WorkoutSessionCard } from '../components/workout/WorkoutSessionCard';
import { DuplicateSessionModal } from '../components/workout/DuplicateSessionModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useWorkout } from '../hooks/useWorkout';
import { useUser } from '../hooks/useUser';
import type { WorkoutSession, ExerciseBlock as ExerciseBlockType, ExerciseDefinition } from '../types';
import { generateId } from '../utils/formatters';
import { todayISO } from '../utils/dateUtils';

type View = 'list' | 'active';

function newBlock(def: ExerciseDefinition): ExerciseBlockType {
  return {
    id: generateId(),
    exerciseName: def.name,
    muscleGroup: def.muscleGroup,
    equipment: def.equipment,
    sets: [],
  };
}

export function WorkoutLogger() {
  const { sessions, personalRecords, exerciseDefinitions, addSession, deleteSession } = useWorkout();
  const { isImperial } = useUser();

  const [view, setView] = useState<View>('list');
  const [sessionName, setSessionName] = useState('');
  const [exercises, setExercises] = useState<ExerciseBlockType[]>([]);
  const [duplicateSource, setDuplicateSource] = useState<WorkoutSession | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');

  const filteredDefs = exerciseDefinitions.filter((d) =>
    d.name.toLowerCase().includes(exerciseSearch.toLowerCase()),
  );

  function startNewSession() {
    setSessionName(`Workout — ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`);
    setExercises([]);
    setView('active');
  }

  function saveSession() {
    if (exercises.length === 0) return;
    addSession({
      name: sessionName || 'Unnamed Workout',
      date: todayISO(),
      exercises,
    });
    setView('list');
    setExercises([]);
    setSessionName('');
  }

  function addExercise(def: ExerciseDefinition) {
    setExercises((prev) => [...prev, newBlock(def)]);
    setShowExercisePicker(false);
    setExerciseSearch('');
  }

  if (view === 'active') {
    return (
      <PageWrapper>
        {/* Active session toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="sm" onClick={() => setView('list')} leftIcon={<ChevronLeft size={14} />}>
            Back
          </Button>
          <Input
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Session name..."
            className="flex-1"
            id="session-name-input"
          />
          <Button
            variant="primary"
            onClick={saveSession}
            disabled={exercises.length === 0}
            id="save-workout-session"
          >
            Save Session
          </Button>
        </div>

        {/* Exercise blocks */}
        <div className="flex flex-col gap-3 mb-4">
          {exercises.map((block, i) => (
            <ExerciseBlock
              key={block.id}
              block={block}
              personalRecord={personalRecords[block.exerciseName]?.e1RM}
              onChange={(updated) =>
                setExercises((prev) => prev.map((b, idx) => (idx === i ? updated : b)))
              }
              onDelete={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}
              isImperial={isImperial}
            />
          ))}
        </div>

        {/* Add Exercise */}
        <Button
          variant="secondary"
          leftIcon={<Plus size={15} />}
          onClick={() => setShowExercisePicker(true)}
          className="w-full"
          id="add-exercise-button"
        >
          Add Exercise
        </Button>

        {/* Exercise picker modal */}
        <Modal
          isOpen={showExercisePicker}
          onClose={() => setShowExercisePicker(false)}
          title="Add Exercise"
          size="md"
        >
          <div className="flex flex-col gap-3">
            <Input
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              placeholder="Search exercises..."
              id="exercise-search-input"
              autoFocus
            />
            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {filteredDefs.map((def) => (
                <button
                  key={def.name}
                  onClick={() => addExercise(def)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all text-left"
                  id={`pick-exercise-${def.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div>
                    <p className="text-sm font-medium text-primary">{def.name}</p>
                    <p className="text-xs text-muted capitalize">
                      {def.muscleGroup.replace('_', ' ')} · {def.equipment.replace('_', ' ')}
                    </p>
                  </div>
                </button>
              ))}
              {filteredDefs.length === 0 && (
                <p className="text-xs text-muted text-center py-4">No exercises found.</p>
              )}
            </div>
          </div>
        </Modal>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-primary">{sessions.length} Sessions Logged</h2>
          <p className="text-xs text-muted">Your workout history</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={15} />} onClick={startNewSession} id="new-workout-button">
          New Session
        </Button>
      </div>

      {/* Session list */}
      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center">
            <Plus size={28} className="text-muted" />
          </div>
          <p className="text-sm text-muted text-center">
            No sessions yet. Hit <strong className="text-primary">New Session</strong> to start logging.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <WorkoutSessionCard
              key={session.id}
              session={session}
              onDuplicate={() => setDuplicateSource(session)}
              onDelete={() => deleteSession(session.id)}
              onClick={() => {/* session detail view */}}
              isImperial={isImperial}
            />
          ))}
        </div>
      )}

      {/* Duplicate modal */}
      <DuplicateSessionModal
        source={duplicateSource}
        onConfirm={(session) => addSession(session)}
        onClose={() => setDuplicateSource(null)}
        isImperial={isImperial}
      />
    </PageWrapper>
  );
}
