import { Plus, Trash2, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import Link from "next/link";
import { getGallery, uploadGalleryPhoto, deleteImage } from "./actions";

type SearchParams = {
  filter?: string;
  success?: string;
};

const categories = [
  { label: "All", value: "All" },
  { label: "Hackathon", value: "tech" },
  { label: "Cultural", value: "cultural" },
  { label: "Performances", value: "performances" },
  { label: "Crowd", value: "bts" },
];

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const gallery = await getGallery();
  const currentFilter = params.filter || "All";

  const filteredGallery = currentFilter === "All"
    ? gallery
    : gallery.filter((img) => img.category === currentFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-2xl font-display font-bold">Gallery</h2>
              <p className="text-ink-400 text-sm mt-1">Upload and manage images displayed in the public gallery.</p>
            </div>
          </div>
        </div>

        {params.success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Image uploaded successfully.</p>
            </div>
            <Link href={`/admin/gallery${currentFilter !== "All" ? `?filter=${encodeURIComponent(currentFilter)}` : ""}`} className="text-green-400 hover:text-green-300 px-2 py-1">
              Dismiss
            </Link>
          </div>
        )}

        <form action={uploadGalleryPhoto} className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-vibeesta-400" />
            <h3 className="font-semibold">Upload Photo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="file" className="text-sm font-medium text-ink-300">Photo</label>
              <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-vibeesta-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-vibeesta-400" />
              <p className="text-xs text-ink-500">JPEG, PNG, WebP or GIF. Maximum 10 MB.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-ink-300">Category</label>
              <select id="category" name="category" defaultValue={currentFilter === "All" ? "tech" : currentFilter} required className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100">
                <option value="tech">Hackathon</option>
                <option value="cultural">Cultural</option>
                <option value="performances">Performances</option>
                <option value="bts">Crowd / BTS</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="aspectRatio" className="text-sm font-medium text-ink-300">Aspect Ratio</label>
              <select id="aspectRatio" name="aspectRatio" defaultValue="square" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100">
                <option value="square">Square</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="wide">Wide</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="alt" className="text-sm font-medium text-ink-300">Alt Text</label>
              <input id="alt" name="alt" required maxLength={300} placeholder="Describe the photo for accessibility" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="caption" className="text-sm font-medium text-ink-300">Caption <span className="text-ink-600">(optional)</span></label>
              <textarea id="caption" name="caption" maxLength={1000} rows={2} placeholder="Optional gallery caption" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 resize-y" />
            </div>

            <div className="space-y-2">
              <label htmlFor="sortOrder" className="text-sm font-medium text-ink-300">Display Order</label>
              <input id="sortOrder" name="sortOrder" type="number" min="0" max="100000" defaultValue="0" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100" />
            </div>

            <label className="flex items-center gap-3 pt-7 text-sm text-ink-300">
              <input name="published" type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink-700 bg-ink-900" />
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-ink-800">
            <button type="submit" className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-4 justify-between bg-ink-900/20">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => {
              const isActive = currentFilter === cat.value;
              return (
                <Link key={cat.value} href={`/admin/gallery${cat.value === "All" ? "" : `?filter=${encodeURIComponent(cat.value)}`}`} className={`px-4 py-1.5 rounded-full text-xs font-medium border ${isActive ? "bg-vibeesta-500/10 text-vibeesta-400 border-vibeesta-500/20" : "bg-ink-900 text-ink-300 border-ink-800 hover:bg-ink-800"}`}>
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGallery.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden bg-ink-900 border border-ink-800">
                <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <form action={deleteImage.bind(null, img.id)}>
                    <button type="submit" className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors" aria-label={`Delete ${img.alt}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {filteredGallery.length === 0 && (
              <div className="col-span-full py-12 text-center text-ink-500">
                No images found for this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
