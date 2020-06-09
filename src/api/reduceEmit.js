import { axios } from '@/utils/request'
// export function getInfo() {
//   return axios({
//     url: '/api/user/info',
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }

export function addPlan(data) {
  return axios({
    url: '/reduceEmissionScheme/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getPlanList(data) {
  return axios({
    url: '/reduceEmissionScheme/list',
    method: 'get',
    params: data
  })
}

export function getPlanListAll(data) {
  return axios({
    url: '/reduceEmissionScheme/all',
    method: 'get',
    params: data
  })
}