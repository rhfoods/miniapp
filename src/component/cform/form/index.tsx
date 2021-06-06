import React, { createContext, FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import CFormModel from './model';

export interface ICRule {
  required: boolean;
  message?: string;
  fn?: (name: string, formData: any) => string
}

interface ICForm {
  form: IuseCForm;
  initialValues?: any;
  onFinish: (value: any) => void;
  onError: (err: string) => void;
}

interface IuseCForm {
  setData: any;
  submit: any
}

interface ICFormCxt {
  data?: any;
  rules?: any;
  setRules?: React.Dispatch<React.SetStateAction<any>>;
  setData?: React.Dispatch<React.SetStateAction<any>>;
}

export const FormCtx = createContext<ICFormCxt>({})

const CForm: FC<ICForm> = (props) => {

  const { children, initialValues, form, onFinish, onError } = props
  const [data, setData] = useState(initialValues || {})
  const [rules, setRules] = useState({})
  const value = { data, rules, setRules, setData }
  form.setData = setData

  form.submit = () => {
    const err = check()
    err ? onError(err) : onFinish(data)
  }

  function check() {
    const keys = Object.keys(rules)
    for(let i=0; i<keys.length; i++) {
      const key = keys[i]
      const rule = rules[key]
      const err = CFormModel.checkIitem(key, rule, data)
      if(err) return err
    }
  }

  return (
    <View>
      <FormCtx.Provider value={value} >{children}</FormCtx.Provider>
    </View>
  )
}

export const useCForm = (): IuseCForm => {
  return {
    setData: null,
    submit: null
  }
}

export default CForm
