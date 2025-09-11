import type React from 'react';

/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {});

export type AnyObject = Record<string, any>;

export type CustomComponent<P = AnyObject> = React.ComponentType<P> | string;

/**
 * Get component props
 * @example
 * ```ts
 * import { Checkbox } from 'dt-design'
 * import type { GetProps } from 'dt-design';
 *
 * type CheckboxGroupProps = GetProps<typeof Checkbox.Group>
 * ```
 */
export type GetProps<T extends React.ComponentType<any> | object> = T extends React.ComponentType<
    infer P
>
    ? P
    : T extends object
    ? T
    : never;

/**
 * Get component props by component name
 * @example
 * ```ts
 * import { Select } from 'dt-design';
 * import type { GetProp, SelectProps } from 'dt-design';
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
    PropName extends keyof GetProps<T>
> = NonNullable<GetProps<T>[PropName]>;

type ReactRefComponent<Props extends { ref?: React.Ref<any> | string }> = (
    props: Props
) => React.ReactNode;

type ExtractRefAttributesRef<T> = T extends React.RefAttributes<infer P> ? P : never;

/**
 * Get component ref
 * @example
 * ```ts
 * import { Input } from 'dt-design';
 * import type { GetRef } from 'dt-design';
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
    PropName extends keyof GetContextProps<T>
> = NonNullable<GetContextProps<T>[PropName]>;
