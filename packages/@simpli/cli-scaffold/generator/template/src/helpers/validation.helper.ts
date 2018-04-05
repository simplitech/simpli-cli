import {
  IsAlpha, IsAlphanumeric, IsCreditCard,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  Length, Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import {t} from '@/helpers/prototypes.helper'

export function ValidationResource() {
  return ValidateNested()
}

export function ValidationRequired() {
  return IsNotEmpty({
    message: (args: ValidationArguments) =>
      t('system.error.required', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
      ]) as string,
  })
}

export function ValidationEmail() {
  return IsEmail({}, {
    message: (args: ValidationArguments) =>
      t('system.error.invalidEmail', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
      ]) as string,
  })
}

export function ValidationStringDate() {
  return IsDateString({
    message: (args: ValidationArguments) =>
      t('system.error.invalidDate', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
      ]) as string,
  })
}

export function ValidationPasswordLength(min: number, max?: number) {
  return Length(min, max, {
    message: () => t('system.error.passwordLength', ['$constraint1', '$constraint2']) as string,
  })
}

export function ValidationLength(min: number, max?: number) {
  return Length(min, max, {
    message: (args: ValidationArguments) =>
      t('system.error.length', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
        '$constraint1',
        '$constraint2',
      ]) as string,
  })
}

export function ValidationMinLength(min: number) {
  return MinLength(min, {
    message: (args: ValidationArguments) =>
      t('system.error.minLength', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
        '$constraint1',
      ]) as string,
  })
}

export function ValidationMaxLength(max: number) {
  return MaxLength(max, {
    message: (args: ValidationArguments) =>
      t('system.error.maxLength', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
        '$constraint1',
      ]) as string,
  })
}

export function ValidationMin(min: number) {
  return Min(min, {
    message: (args: ValidationArguments) =>
      t('system.error.min', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
        '$constraint1',
      ]) as string,
  })
}

export function ValidationMax(max: number) {
  return Max(max, {
    message: (args: ValidationArguments) =>
      t('system.error.max', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
        '$constraint1',
      ]) as string,
  })
}

export function ValidationAlpha() {
  return IsAlpha({
    message: (args: ValidationArguments) =>
      t('system.error.invalidAlpha', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
      ]) as string,
  })
}

export function ValidationAlphanumeric() {
  return IsAlphanumeric({
    message: (args: ValidationArguments) =>
      t('system.error.invalidAlphanumeric', [
        t(`classes.${(args.object).constructor.name}.columns.${args.property}`),
      ]) as string,
  })
}

export function ValidationCreditCard() {
  return IsCreditCard({
    message: () => t('system.error.invalidCreditCard') as string,
  })
}
