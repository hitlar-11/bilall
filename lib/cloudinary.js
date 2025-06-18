import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const search = async (params) => {
  try {
    const result = await cloudinary.search
      .expression(params.expression)
      .sort_by(params.sort_by || 'created_at', params.direction || 'desc')
      .max_results(params.max_results || 30)
      .execute();
    return result;
  } catch (error) {
    console.error('Error searching Cloudinary:', error);
    throw error;
  }
};

export default cloudinary; 