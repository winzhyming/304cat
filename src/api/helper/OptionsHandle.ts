interface Target {
  id: string
  name: string
  children?: Array<Target>
}
export interface Option {
  id: string
  label: string
  value: string
  children?: Array<Option>
}

type TranformOptions = (source: Array<Target>) => Array<Option>
export const tranformOptions: TranformOptions = (source) => {
  return source.map(item => {
    let children = item.children
    let theaf: Option = {
      label: item.name,
      id: item.id,
      value: item.id
    }
    if (children && children.length) theaf.children = tranformOptions(children)
    return theaf
  })
}