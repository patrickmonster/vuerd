import { Command, CommandTypeAll } from '@@types/engine/command';
import { State } from '@@types/engine/store';
import { Subject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Logger } from '@/core/logger';
import * as CanvasCommand from './canvas.command.helper';
import { executeCanvasCommandMap } from './canvas.command';

const executeCommandMap = {
  ...executeCanvasCommandMap,
};

export const createCommand = (): Command => ({
  canvas: CanvasCommand,
});

export function createStream() {
  const dispatch$ = new Subject<Array<CommandTypeAll>>();
  const undo$ = new Subject<Array<CommandTypeAll>>();
  const change$ = merge(undo$, dispatch$).pipe(debounceTime(200));

  return {
    dispatch$,
    undo$,
    change$,
  };
}

export const executeCommand = (state: State, commands: CommandTypeAll[]) => {
  commands.forEach(command => {
    Logger.log('executeCommand', command.name);
    const execute = executeCommandMap[command.name];
    execute && execute(state, command.data as any);
  });
};
