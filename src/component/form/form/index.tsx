import Tool from "@/utils/tools"
import { BaseEventOrig, Form, View } from "@tarojs/components"
import React, { createContext, FC, useMemo } from "react"
import "./index.scss"

interface IForm {
  className?: string
  form: any
  onSub: (params: any) => void
}

interface IFormCxt {
  form: any
}

export const FormCxt = createContext<IFormCxt>({
  form: {},
})

const XForm: FC<IForm> = (props) => {
  const { children, className, form, onSub } = props

  async function sub(e: BaseEventOrig<any>) {
    const formData = e.detail.value
    const err = await form.deepCheck(formData)
    if(err) {
      Tool.load.hide(err)
      return
    }
    if(form.isAdd()) {
      const params = form.client2server(formData)
      onSub(params)
      return
    }
    let params: any = form.findDif(formData)
    if(!params) {
      onSub(null)
      return
    }
    params = form.client2server(params)
    onSub(params)
  }

  const value = useMemo(() => ({ form }), [form] )

  return (
    <View className={className}>
      <Form onSubmit={sub}>
        <FormCxt.Provider value={value}>{children}</FormCxt.Provider>
      </Form>
    </View>
  )
}

export default XForm
