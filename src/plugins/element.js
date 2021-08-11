import { 
  ElButton, 
  ElForm, 
  ElFormItem, 
  ElInput,
  ElIcon 
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElIcon)
}
