export async function uploadImage(authToken: string, image: File) {
  let imageFormData = new FormData();
  imageFormData.append('image', image);

  const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/images/', {
    method: 'POST',
    headers: {
      'Authorization': authToken
    },
    body: imageFormData
  })

  if (!res.ok) {
    throw new Error('Error fetching post')
  }

  return res.json();
}