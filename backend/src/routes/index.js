import { postsRouter } from './posts/posts.js'
import { authRouter } from './auth/auth.js'
import { usersRouter } from './users/users.js'

export default {
  posts: postsRouter,
  auth: authRouter,
  users: usersRouter
}