import { Spin } from 'antd'
import React from 'react'
import { createGlobalStyle } from 'styled-components'

const Style = createGlobalStyle`
body {
	display: flex;
	justify-content: center;
	align-items: center;
}
`

const Loading = (): JSX.Element => (
  <>
    <Style />
    <Spin size="large" />
  </>
)

export default Loading
