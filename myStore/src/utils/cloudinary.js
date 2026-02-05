export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'myStore'); // ✅ Replace this
  formData.append('cloud_name', 'dwl1zfipf');       // ✅ Replace this

  const response = await fetch('https://api.cloudinary.com/v1_1/dwl1zfipf/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');

  return data.secure_url;
};
