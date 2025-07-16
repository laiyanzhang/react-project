import { getGenderOptions } from "@api/index"

interface genderParams {
  id?: number
}

export const loaderGenderOptions = async({params, request}: {params: genderParams, request: any}) => {
  const pathSegments = new URL(request.url).pathname.split('/')
  console.log(params, pathSegments)
  const res = await getGenderOptions()
  return res.data.data
}