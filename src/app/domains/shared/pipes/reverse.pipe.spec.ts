import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should create an instance', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });

  it('debería invertir una cadena de texto simple', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });

  it('debería invertir una cadena con espacios', () => {
    spectator = createPipe(`{{ 'angular testing' | reverse }}`);
    expect(spectator.element).toHaveText('gnitset ralugna');
  });

  it('debería invertir una cadena con caracteres especiales', () => {
    spectator = createPipe(`{{ 'a-b@c#123' | reverse }}`);
    expect(spectator.element).toHaveText('321#c@b-a');
  });

  it('debería devolver una cadena vacía si se proporciona una cadena vacía', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toHaveText('');
  });
});
