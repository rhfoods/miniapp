import { EPointType } from "@/hooks/use-map"
import { ICanGetPoints } from "@/pages/home/use-points"

/**
 * @param dividing : 分界线
 */
export async function shouldUpdateMap(newInfo: ICanGetPoints, oldInfo: ICanGetPoints, dividing: number, type: EPointType) {
  let can = false
  let code = oldInfo.code
  let city = oldInfo.city
  const scale = newInfo.scale
  const center = newInfo.center
  code = newInfo.code
  city = newInfo.city
  if(type === EPointType.PO && scale < 5) {
    can = true
  }
  if(oldInfo.city === '') {
    can = true
  }
  if(city !== oldInfo.city && scale > dividing) {
    can = true
  }
  if(scaleChange(newInfo.scale, oldInfo.scale, dividing)) {
    can = true
  }
  return {
    can,
    info: { scale, center, code, city }
  }
}

function scaleChange(newInfo: number, oldInfo: number, dividing: number) {
  if(oldInfo >= dividing && newInfo < dividing) {
    // console.log(oldInfo, '---', dividing, '---', newInfo)
    return true
  }
  if(oldInfo <= dividing && newInfo > dividing) {
    // console.log(oldInfo, '---', dividing, '---', newInfo)
    return true
  }
  return false
}