import connectToDB from "@/configs/db";
import EstateModel from "@/models/Estate";

async function getEstateById(id) {
  await connectToDB();

  try {
    const estate = await EstateModel.findById(id).lean();

    if (!estate) {
      return null;
    }

    return {
      ...estate,
      _id: estate._id.toString(),

      images:
        estate.images?.map(({ url, alt, publicId }) => ({
          url,
          alt: alt || "",
          publicId: publicId || null,
        })) || [],

      owner: estate.owner?.toString() || null,
      agent: estate.agent?.toString() || null,
    };
  } catch (error) {
    console.error("GET ESTATE BY ID ERROR:", error);
    return null;
  }
}
export { getEstateById };