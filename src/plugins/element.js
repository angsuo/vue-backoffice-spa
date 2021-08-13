import { 
  ElButton, 
  ElForm, 
  ElFormItem, 
  ElInput,
  ElIcon,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain 
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElIcon)
  app.provide("message", ElMessage)
  app.use(ElContainer)
  app.use(ElAside)
  app.use(ElHeader)
  app.use(ElMain)
}
