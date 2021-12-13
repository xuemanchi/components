/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { DropdownProps } from './types'
import type { DropdownConfig } from '@idux/components/config'
import type { ComputedRef } from 'vue'

import { computed, defineComponent, provide } from 'vue'

import { useControlledProp } from '@idux/cdk/utils'
import { ɵOverlay } from '@idux/components/_private/overlay'
import { useGlobalConfig } from '@idux/components/config'

import { dropdownToken } from './token'
import { dropdownProps } from './types'

const defaultDelay: [number, number] = [0, 100]

export default defineComponent({
  name: 'IxDropdown',
  props: dropdownProps,
  setup(props, { slots }) {
    const common = useGlobalConfig('common')
    const mergedPrefixCls = computed(() => `${common.prefixCls}-dropdown`)
    const config = useGlobalConfig('dropdown')
    const [visibility, setVisibility] = useControlledProp(props, 'visible', false)
    const configProps = useConfigProps(props, config, mergedPrefixCls, setVisibility)
    provide(dropdownToken, { setVisibility })

    return () => {
      return (
        <ɵOverlay
          visible={visibility.value}
          v-slots={{ default: slots.default, content: slots.overlay }}
          class={mergedPrefixCls.value}
          delay={defaultDelay}
          disabled={props.disabled}
          transitionName={`${common.prefixCls}-fade`}
          {...configProps.value}
        />
      )
    }
  },
})

function useConfigProps(
  props: DropdownProps,
  config: DropdownConfig,
  mergedPrefixCls: ComputedRef<string>,
  setVisibility: (value: boolean) => void,
) {
  return computed(() => {
    const trigger = props.trigger ?? config.trigger
    return {
      autoAdjust: props.autoAdjust ?? config.autoAdjust,
      clickOutside: trigger === 'click' || trigger === 'contextmenu',
      destroyOnHide: props.destroyOnHide ?? config.destroyOnHide,
      offset: props.offset ?? config.offset,
      placement: props.placement ?? config.placement,
      showArrow: props.showArrow ?? config.showArrow,
      target: props.target ?? config.target ?? `${mergedPrefixCls.value}-container`,
      trigger: trigger,
      ['onUpdate:visible']: setVisibility,
    }
  })
}
