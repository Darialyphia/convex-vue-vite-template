import mitt from 'mitt';

export const focusEmitter = mitt<{ focus: string }>();

export const useFocusOn = () => {
  return (target: string) => focusEmitter.emit('focus', target);
};
