import { useState } from 'react';
import type { Report, ReportCategory } from '@/types';
import { useToast } from './Toast';
import { X, ImagePlus, Send, Loader2 } from 'lucide-react';

const CATEGORIES: ReportCategory[] = [
  'Illegal Dumping',
  'Road Damage',
  'Water Leakage',
  'Streetlight Issue',
  'Waste Management',
  'Sewage Issue',
  'Encroachment',
  'Other',
];

export function ReportForm({
  open,
  onClose,
  onSubmit,
  citizenName,
  citizenContact,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Report, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  citizenName: string;
  citizenContact: string;
}) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Road Damage');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800_000) {
      toast('Image too large. Please use an image under 800KB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setTitle('');
    setCategory('Road Damage');
    setDescription('');
    setLocation('');
    setImage(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        image,
        citizenName,
        citizenContact,
      });
      setSubmitting(false);
      reset();
      toast('Report submitted successfully!', 'success');
      onClose();
    }, 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-900">Report a New Issue</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title describing the issue"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street, area, city"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo Evidence (optional)</label>
            {image ? (
              <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200">
                <img src={image} alt="Evidence" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-lg p-1.5 hover:bg-slate-900"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition">
                <ImagePlus size={24} className="text-slate-400" />
                <span className="text-sm text-slate-500">Click to upload (max 800KB)</span>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition shadow-sm disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
