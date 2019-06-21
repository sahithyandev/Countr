export interface CountDown {
  id
  title: string
  description: string
  datetime
  isFinished: boolean
  owner
  category
  isStarred: boolean // starred or not
  isRepeat: boolean // repeat or not
}