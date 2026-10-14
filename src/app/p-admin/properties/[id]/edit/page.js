import EstateModel from "@/models/Estate";
import EditEstateForm from "@/components/p-admin/EditEstateForm";
import connectToDB from "@/configs/db";

export default async function EditEstatePage({ params }) {
  const { id } = await params;

  await connectToDB();

  const estate = await EstateModel.findById(id).lean();

  if (!estate) {
    return <div>ملک مورد نظر پیدا نشد.</div>;
  }

  const serializedEstate = {
    ...estate,
    _id: estate._id.toString(),

    images:
      estate.images?.map((image) => ({
        _id: image._id?.toString(),
        url: image.url,
        publicId: image.publicId || "",
        alt: image.alt || "",
      })) || [],

    owner: estate.owner?.toString() || null,
    agent: estate.agent?.toString() || null,

    createdAt: estate.createdAt?.toISOString(),
    updatedAt: estate.updatedAt?.toISOString(),
  };

  return <EditEstateForm estate={serializedEstate} />;
}
