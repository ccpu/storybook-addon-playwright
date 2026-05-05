import { releaseModifierKey as orgReleaseModifierKey } from '../src/api/services/utils/release-modifier-Key';

export const releaseModifierKey = vi.fn<typeof orgReleaseModifierKey>();
