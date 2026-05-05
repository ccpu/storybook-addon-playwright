import { installMouseHelper as orgInstallMouseHelper } from '../../../../../src/api/server/utils/install-mouse-helper';

export const installMouseHelper = vi.fn<typeof orgInstallMouseHelper>();
