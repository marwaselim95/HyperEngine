import { useAppContext } from '../store/AppContext';
import type { UserProfile, MacroProfile } from '../types';
import { calculateTDEE, deriveMacroProfile } from '../utils/macroCalculators';
import { todayISO } from '../utils/dateUtils';
import { generateId } from '../utils/formatters';
import { DEFAULT_PROFILE } from '../store/userReducer';

export function useUser() {
  const { user, dispatchUser } = useAppContext();

  const profile = user.profile ?? DEFAULT_PROFILE;
  const isImperial = profile.unitSystem === 'imperial';
  const tdee = calculateTDEE(profile);

  function updateProfile(partial: Partial<UserProfile>): void {
    if (user.profile) {
      dispatchUser({ type: 'UPDATE_PROFILE', partial });
    } else {
      dispatchUser({
        type: 'SET_PROFILE',
        profile: { ...DEFAULT_PROFILE, ...partial, updatedAt: todayISO() },
      });
    }
  }

  function updateMacroProfile(macroProfile: MacroProfile): void {
    updateProfile({ macroProfile });
  }

  function recalculateMacros(): void {
    const recommended = deriveMacroProfile(tdee, profile.bodyweightKg, profile.goal);
    updateProfile({ macroProfile: recommended });
  }

  function initDefaultProfile(): void {
    dispatchUser({ type: 'SET_PROFILE', profile: { ...DEFAULT_PROFILE, id: generateId() } });
  }

  return {
    profile,
    isOnboarded: user.isOnboarded,
    isImperial,
    tdee,
    updateProfile,
    updateMacroProfile,
    recalculateMacros,
    initDefaultProfile,
  };
}
