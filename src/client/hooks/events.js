import { Events } from 'quasar'

export function emit (hook) {
  Events.$emit(hook.type + '-hook', hook)
}
