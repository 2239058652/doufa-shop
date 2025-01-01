declare module 'address-parse' {
  export interface ParseResult {
    province: string
    city: string
    area: string
    details: string
    mobile: string
    name: string
  }

  export interface Utils {
    getAreaByAddress(address: {
      province: string
      city: string
      area: string
    }): { code: string }
    getTargetAreaListByCode(
      type: string,
      code: string,
      bool: boolean
    ): Array<{ code: string }>
  }

  export default class AddressParse {
    static parse(address: string, bool: boolean): ParseResult[]
  }

  export const Utils: Utils
}
