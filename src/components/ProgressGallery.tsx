'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Plus, Calendar, Scale, 
  ArrowLeftRight, Trash2, CheckCircle, Image as ImageIcon, Sparkles 
} from 'lucide-react';
import { ProgressPhoto } from '@/types';
import { uploadProgressPhoto, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BeforeAfterModal } from './BeforeAfterModal';
import { triggerHaptic } from '@/lib/audioHaptics';

export const ProgressGallery: React.FC = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pose, setPose] = useState<ProgressPhoto['pose']>('front');
  const [weightKg, setWeightKg] = useState<number>(66.0);
  const [notes, setNotes] = useState<string>('');

  // Comparison State
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from Supabase or localStorage
  useEffect(() => {
    async function loadPhotos() {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('progress_photos')
          .select('*')
          .order('taken_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setPhotos(data);
          return;
        }
      }

      // Check local storage
      const stored = localStorage.getItem('andriy_progress_photos');
      if (stored) {
        try {
          setPhotos(JSON.parse(stored));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // Default initial mock photos for Andriy demonstrating progression
      const initialSeed: ProgressPhoto[] = [
        {
          id: 'seed-1',
          athlete_name: 'Андрій',
          photo_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
          storage_path: 'seed/front-1.jpg',
          pose: 'front',
          weight_kg: 66.8,
          taken_at: '2026-09-01',
          notes: 'Початок мікроциклу. Фокус на Handstand та Planche Lean.',
          created_at: new Date('2026-09-01').toISOString(),
        },
        {
          id: 'seed-2',
          athlete_name: 'Андрій',
          photo_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
          storage_path: 'seed/side-2.jpg',
          pose: 'side',
          weight_kg: 66.0,
          taken_at: '2026-10-01',
          notes: 'Сухий рельєф, зменшився переліт у стійці, таз у Planche Lean стабільний.',
          created_at: new Date('2026-10-01').toISOString(),
        },
      ];
      setPhotos(initialSeed);
      localStorage.setItem('andriy_progress_photos', JSON.stringify(initialSeed));
    }

    loadPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      triggerHaptic('light');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    triggerHaptic('medium');
    setIsUploading(true);

    try {
      const result = await uploadProgressPhoto(selectedFile, pose, weightKg, notes);
      if (result) {
        setPhotos((prev) => [result as ProgressPhoto, ...prev]);
        setSelectedFile(null);
        setPreviewUrl(null);
        setNotes('');
        setShowUploadForm(false);
        triggerHaptic('success');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Помилка завантаження фото');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSelectForComparison = (id: string) => {
    triggerHaptic('light');
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const getComparedPhotos = () => {
    if (selectedForComparison.length < 2) return null;
    const p1 = photos.find((p) => p.id === selectedForComparison[0]);
    const p2 = photos.find((p) => p.id === selectedForComparison[1]);
    if (!p1 || !p2) return null;
    // ensure chronological order (earlier first)
    return new Date(p1.taken_at) <= new Date(p2.taken_at)
      ? { before: p1, after: p2 }
      : { before: p2, after: p1 };
  };

  const comparedPair = getComparedPhotos();

  return (
    <div className="flex flex-col pb-28 pt-safe px-4">
      {/* Header */}
      <div className="mt-2 mb-4 ios-glass rounded-3xl p-4 border border-zinc-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Форма та антропометрія
          </span>
          <h1 className="text-base font-bold text-zinc-100">
            Галерея прогресу Андрія
          </h1>
          <p className="text-[11px] text-zinc-400">
            Ціль: 66 кг, сухий рельєф, контроль положень
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setShowUploadForm(!showUploadForm);
          }}
          className="p-2.5 rounded-2xl bg-emerald-500 text-zinc-950 font-bold active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Floating Comparison CTA if 2 photos are selected */}
      {selectedForComparison.length === 2 && comparedPair && (
        <div className="mb-4 ios-glass rounded-2xl p-3 border border-emerald-500/50 bg-emerald-950/30 flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-200 font-medium">
              Обрано 2 фото для порівняння
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('heavy');
              setIsComparisonOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-md shadow-emerald-500/30"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Порівняти «До / Після»</span>
          </button>
        </div>
      )}

      {/* Upload Form Modal/Section */}
      {showUploadForm && (
        <form
          onSubmit={handleUploadSubmit}
          className="ios-glass-card rounded-3xl p-5 border border-zinc-800 mb-5 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Додати нове фото форми
            </h2>
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Скасувати
            </button>
          </div>

          {/* Image Picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-44 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 bg-zinc-950/60 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Попередній перегляд"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-zinc-500 mx-auto mb-2 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-zinc-300 font-medium block">
                  Зробити фото або вибрати з медіатеки
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  iPhone Camera / Supabase Storage
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form Fields: Pose & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Поза / Елемент
              </label>
              <select
                value={pose}
                onChange={(e) => setPose(e.target.value as ProgressPhoto['pose'])}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="front">Спереду (Front)</option>
                <option value="side">Збоку (Side)</option>
                <option value="back">Ззаду (Back)</option>
                <option value="handstand">Handstand (Стійка)</option>
                <option value="planche">Planche (Горизонт)</option>
                <option value="front_lever">Front Lever (Вис)</option>
                <option value="other">Інше</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Вага (кг)
              </label>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
                <Scale className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-transparent text-xs text-zinc-200 font-mono focus:outline-none"
                  placeholder="66.0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Коментар до форми
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Наприклад: Рівень рельєфу після тижня, прогрес у hollow body"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-500/20"
          >
            {isUploading ? (
              <span>Завантаження в Supabase...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Зберегти фото форми</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Photos Grid */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Збережені фото ({photos.length})
          </span>
          <span className="text-[11px] text-zinc-500">
            Натисни на картку, щоб вибрати для порівняння
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-zinc-900/40 border border-zinc-800">
            <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">
              Ще немає завантажених фотографій форми.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((item) => {
              const isSelected = selectedForComparison.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelectForComparison(item.id)}
                  className={`ios-glass-card rounded-2xl p-2 border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Photo container */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950">
                    <img
                      src={item.photo_url}
                      alt={item.pose}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selection Check Badge */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 border-zinc-950 text-zinc-950'
                          : 'bg-zinc-900/70 border-zinc-600 text-transparent'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 fill-current" />
                    </div>

                    {/* Pose Badge */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-zinc-950/80 backdrop-blur-md text-[10px] font-semibold text-zinc-300 uppercase tracking-wider border border-zinc-800">
                      {item.pose}
                    </span>
                  </div>

                  {/* Photo Info */}
                  <div className="pt-2 px-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-emerald-400">{item.weight_kg} кг</span>
                      <span className="text-zinc-500 text-[10px]">{item.taken_at}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {isComparisonOpen && comparedPair && (
        <BeforeAfterModal
          photoBefore={comparedPair.before}
          photoAfter={comparedPair.after}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}
    </div>
  );
};
