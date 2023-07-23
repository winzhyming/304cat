/**
 * @加工模块
 */
export namespace Machining {
  export interface Cate {
    id: string
    icon: string
    url: string
    name: string
    pid: string
    createTime: string
    updateTime: string
    children: Array<Cate>
  }
}