import React, { FC } from 'react'
import { MsgProvider } from './message-ctx'

const AppProvider: FC = (props) => {
  return (
    <MsgProvider>
      {props.children}
    </MsgProvider>
  )
}

export default AppProvider