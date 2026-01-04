import type React from 'react';

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T, U extends Primitive = string> = T | (U & Record<never, never>);

export type AnyObject = Record<PropertyKey, any>;

export type CustomComponent<P = AnyObject> = React.ComponentType<P> | string;

/**
 * Get component props
 * @example
 * ```ts
 * import { Checkbox } from '@dtjoy/dt-design'
 * import type { GetProps } from '@dtjoy/dt-design';
 *
 * type CheckboxGroupProps = GetProps<typeof Checkbox.Group>
 * ```
 */
export type GetProps<T extends React.ComponentType<any> | object> =
  T extends React.ComponentType<infer P> ? P : T extends object ? T : never;

/**
 * Get component props by component name
 * @example
 * ```ts
 * import { Select } from '@dtjoy/dt-design';
 * import type { GetProp, SelectProps } from '@dtjoy/dt-design';
 *
 * type SelectOption1 = GetProp<SelectProps, 'options'>[number];
 * // or
 * type SelectOption2 = GetProp<typeof Select, 'options'>[number];
 *
 * const onChange: GetProp<typeof Select, 'onChange'> = (value, option) => {
 *  // Do something
 * };
 * ```
 */
export type GetProp<
  T extends React.ComponentType<any> | object,
  PropName extends keyof GetProps<T>,
> = NonNullable<GetProps<T>[PropName]>;

type ReactRefComponent<Props extends { ref?: React.Ref<any> | string }> = (
  props: Props,
) => React.ReactNode;

type ExtractRefAttributesRef<T> = T extends React.RefAttributes<infer P> ? P : never;

/**
 * Get component ref
 * @example
 * ```ts
 * import { Input } from '@dtjoy/dt-design';
 * import type { GetRef } from '@dtjoy/dt-design';
 *
 * type InputRef = GetRef<typeof Input>;
 * ```
 */
export type GetRef<T extends ReactRefComponent<any> | React.Component<any>> =
  T extends React.Component<any>
    ? T
    : T extends React.ComponentType<infer P>
      ? ExtractRefAttributesRef<P>
      : never;

export type GetContextProps<T> = T extends React.Context<infer P> ? P : never;

export type GetContextProp<
  T extends React.Context<any>,
  PropName extends keyof GetContextProps<T>,
> = NonNullable<GetContextProps<T>[PropName]>;
