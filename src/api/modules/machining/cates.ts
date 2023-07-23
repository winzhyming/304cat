import http from "@/api"
import { PORT1 } from "@/api/config/servicePort";
import { Result, ResPage, Machining } from '@/api/interface'

/**
 * @name 加工分类模块
 */
/**
 * 获取 加工分类树
 */
export const getCatesTree = () => {
  return http.get<ResPage<Machining.Cate>>(`${PORT1}/machining/cates/tree`)
}

/**
 * 创建 加工分类
 * @param name
 * @param pid
 * @param url
 */
export const saveCate = (cate: Partial<Machining.Cate>) => {
  return http.post<Result>(`${PORT1}/machining/cates`, cate)
}

/**
 * 修改 加工分类
 * @param id 
 * @returns 
 */
export const editCate = (id: string, cate: Partial<Machining.Cate>) => {
  return http.put<Result>(`${PORT1}/machining/cates/${id}`, cate)
}

/**
 * 删除加工分类
 * @param id 
 */
export const delCate = ({ id }: { id: string }) => {
  return http.delete<Result>(`${PORT1}/machining/cates/${id}`)
}