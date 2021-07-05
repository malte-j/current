interface PostPreview {
  _id: string,
  title: string,
  createdAt: string,
  _user: {
    _id: string,
    username: string
  },
  "_thumbnail"?: Image
}