import { IHomeParams } from "@/core/interface/nav"
import { useEffect, useState } from "react"

function useHomeState(self, map, params: IHomeParams) {
  const [state, setState] = useState<'loading'|'success'>('loading')

  useEffect(() => {
    if(self.state !== 'success') {
      return
    }
    map.init(params).then(() => {
      setState('success')
    })
  }, [self.state])

  return {
    state
  }
}

export default useHomeState