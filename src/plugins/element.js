import { 
  ElButton, 
  ElForm, 
  ElFormItem, 
  ElInput,
  ElIcon,
  ElMessage 
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElIcon)
  app.provide("message", ElMessage)
}
