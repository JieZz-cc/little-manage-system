import service from './api'

export function invokeApi(
  method = 'post',
  url = '',
  params = {},
  type = 'applicatn/json',
) {
  let urlParams = null
  // 入参格式：x-www-form-urlencoded
  if (type === 'urlencoded') {
    urlParams = new URLSearchParams()
    for (let key in { ...params }) {
      urlParams.append(key, params[key])
    }
  } else {
    urlParams = { ...params }
  }

  return service({
    method: method,
    url: url,
    data: urlParams,
    params: type === 'queryString' ? urlParams : ''
  })
}
