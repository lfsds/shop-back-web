import { getAction,deleteAction,putAction,postAction} from '@/api/manage'

// 物料采购管理
  // 物料分类管理01
const queryOrgTreeList01 = (params)=>getAction("/base/mpmMaterialClassification/childList",params);//列表
const searchByKeywords01 = (params)=>getAction("/base/mpmMaterialClassification/rootList",params);//查询
const deleteByOrgtId01   = (params)=>deleteAction("/base/mpmMaterialClassification/deleteBatch",params);//删除
// 工装工具分类03
const queryOrgTreeList03 = (params)=>getAction("/base/mpmMaterialClassification/childList",params);//列表
const searchByKeywords03 = (params)=>getAction("/base/mpmMaterialClassification/rootList",params);//查询
const deleteByOrgtId03  = (params)=>deleteAction("/base/mpmMaterialClassification/deleteBatch",params);//删除
export {
  queryOrgTreeList01,
  searchByKeywords01,
  deleteByOrgtId01
}