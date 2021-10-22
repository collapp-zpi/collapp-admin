import { useController } from 'react-hook-form'
import { ComponentProps } from 'react'
import { useApiRequest } from '../form/Form'
import styled from 'styled-components'
import { InputFrame, InputGeneric } from './InputFrame'
import { RequestState } from '../../hooks/useRequest'
import Select from 'react-select'
import classNames from 'classnames'

type InputSelectProps<T> = InputGeneric &
  ComponentProps<'input'> & {
    options: T[]
  }

const InputLabel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.2s ease;

  input:not(:placeholder-shown) + &,
  input:focus + & {
    transform: scale(0.75) translateY(-0.5em);
  }
`

export const InputSelect = <T extends { value: string; label: string }>({
  name,
  label,
  innerClassName,
  className,
  disabled,
  icon,
  options,
  ...props
}: InputSelectProps<T>) => {
  const {
    field: { ref, value, onChange, ...field },
    fieldState: { invalid },
  } = useController({ name })
  const { status } = useApiRequest()

  return (
    <InputFrame {...{ name, className, icon }} isError={invalid}>
      {/*<input*/}
      {/*  ref={ref}*/}
      {/*  {...field}*/}
      {/*  {...props}*/}
      {/*  value={field?.value ?? props?.value ?? ''}*/}
      {/*  className={classNames(*/}
      {/*    'w-full outline-none px-4 pb-1 pt-5 text-gray-500',*/}
      {/*    innerClassName,*/}
      {/*  )}*/}
      {/*  placeholder=" "*/}
      {/*  disabled={status === RequestState.Loading || disabled}*/}
      {/*/>*/}
      <Select
        ref={ref}
        {...field}
        value={
          value === null ? null : options.find((item) => item.value === value)
        }
        onChange={(data) => onChange(data?.value ?? null)}
        isDisabled={status === RequestState.Loading || disabled}
        isClearable
        placeholder=" "
        options={options}
        styles={{}}
        className={classNames(
          // 'w-full outline-none px-4 pb-1 pt-5 text-gray-500',
          'w-full outline-none text-gray-500',
          innerClassName,
        )}
      />
      <InputLabel className="ml-4 my-3 opacity-70">{label}</InputLabel>
    </InputFrame>
  )
}