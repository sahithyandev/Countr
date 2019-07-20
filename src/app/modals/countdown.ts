export interface CountDown {
  id?
  title: string
  description: string
  datetime
  isFinished: boolean
  owner
  category: String
  isStarred: boolean // starred or not
  isRepeat: boolean // repeat or not
  sharedWith?: Array<String>
}