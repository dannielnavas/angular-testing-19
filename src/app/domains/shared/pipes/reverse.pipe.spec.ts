import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';

import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should create an instance', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });
});
