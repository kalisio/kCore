import _ from 'lodash'
import { createQuerablePromise } from '../utils'

export default function refsResolverMixin(refs) {
  return {
    methods: {
      setRefs (refs) {
        this._refs = refs
        // Create the mixin promise if required
        if (!this.refsPromise || this.refsPromise.isFulfilled()) {
          this.refsPromise = createQuerablePromise((resolve, reject) => {
            // Store the resolver to resolve it when required
            this.refsResolver = resolve
          })
        }
        this.resolveRefs()
      },
      resolveRefs () {
        // If already resolved stop
        if (this.refsPromise.isFulfilled()) return
        // While we don't have anything to resolve stop as well
        if (!this._refs || this._refs.length === 0) return

        let resolvedRefs = this._refs.filter(ref => this.$refs[ref])
        // If none are missing we can resolve the promise
        if (resolvedRefs.length === this._refs.length) {
          this.refsResolver(resolvedRefs)
        }
      },
      loadRefs () {
        return this.refsPromise
      }
    },
    created () {
      // If the ref list is known at startup this will setup it,
      // otherwise it will at least create the promise so that it is accessible to component's created()
      // and the list should be filled dynamically by the component using setRefs()
      this.setRefs(refs)
    },
    updated () {
      // Because refs are only availalbe once the underlying component has been updated
      // we need to seek for them at each update until we get them all
      this.resolveRefs()
    }
  }
}
