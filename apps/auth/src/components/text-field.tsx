"use client";

import type { ComponentProps } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";

type TextFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Input>,
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref"
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...inputProps}
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
