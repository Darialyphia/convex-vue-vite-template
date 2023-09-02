import mitt from 'mitt';

export const focusEmitter = mitt<{ focus: string }>();

export const useFocus = () => {
  return (target: string) => focusEmitter.emit('focus', target);
};
