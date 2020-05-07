/**
 * Generic DefaultSchema
 * @author Simpli CLI generator
 */
import {Schema} from '@simpli/meta-schema'
import {$} from '@/facade'

export abstract class DefaultSchema extends Schema {
  abstract readonly name: string

  translateFrom(fieldName: string): string {
    return $.t(`schema.${this.name}.${fieldName}`) as string
  }
}
