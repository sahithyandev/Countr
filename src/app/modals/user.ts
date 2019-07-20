export interface User {
  id?,
  name: string
  email: string
  categories?: Array<String>
  photoURL?: String
  accept_sharing: Boolean
}
