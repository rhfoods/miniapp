import { useContext, useEffect } from "react"
import { FormCtx, ICRule } from "../form"

function useCInput(name: string, rule: ICRule) {

  const form = useContext(FormCtx)

  const onInput = (value: string | number) => {
    form.setData(data => ({
      ...data,
      [name]: value
    }))
  }

  useEffect(() => {
    if(!name) {
      console.error('formItem: 没有name')
      return
    }
    form.setRules(rules => ({
      ...rules,
      [name]: rule  
    }))
  }, [])

  return {
    value: form.data[name],
    onInput
  }
}

export default useCInput