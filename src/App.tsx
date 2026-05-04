/// <reference types="vite/client" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Wand2, X, SlidersHorizontal, RefreshCw, Share2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TEMPLATES = [
  // People & Portraits
  { id: 't1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', label: 'Face' },
  { id: 't6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', label: 'Portrait' },
  { id: 't13', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', label: 'Fashion' },
  { id: 't14', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', label: 'Male Portrait' },
  { id: 't15', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', label: 'Model' },
  
  // Animals & Wildlife
  { id: 't2', url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/African_Bush_Elephant.jpg', label: 'Elephant' },
  { id: 't16', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', label: 'Dog' },
  { id: 't17', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80', label: 'Fox' },
  { id: 't18', url: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=800&q=80', label: 'Bird' },
  { id: 't19', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80', label: 'Panda' },

  // Architecture & Urban
  { id: 't3', url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80', label: 'Architecture' },
  { id: 't11', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80', label: 'Tiger' },
  { id: 't20', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', label: 'Skyscraper' },
  { id: 't21', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', label: 'Interior' },
  { id: 't22', url: 'https://upload.wikimedia.org/wikipedia/en/e/ea/Zootopia.jpg', label: 'Zootopia' },

  // Nature & Landscapes
  { id: 't4', url: 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&q=80', label: 'Landscape' },
  { id: 't9', url: 'https://images.unsplash.com/photo-1470071131384-001b85755536?w=800&q=80', label: 'Nature' },
  { id: 't23', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', label: 'Mountains' },
  { id: 't24', url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80', label: 'Forest' },
  { id: 't25', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', label: 'Beach' },

  // Still Life & Objects
  { id: 't5', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80', label: 'Still Life' },
  { id: 't12', url: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?w=800&q=80', label: 'Vintage' },
  { id: 't26', url: 'https://images.unsplash.com/photo-1505934333218-8fe21ff8826d?w=800&q=80', label: 'Camera' },
  { id: 't27', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80', label: 'Bicycle' },
  { id: 't28', url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80', label: 'Finance' },

  // Vehicles
  { id: 't7', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', label: 'Car' },
  { id: 't29', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80', label: 'Motorcycle' },
  { id: 't30', url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80', label: 'Airplane' },
  { id: 't31', url: 'https://images.unsplash.com/photo-1534685148086-13cb009403ec?w=800&q=80', label: 'Boat' },
  { id: 't32', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', label: 'Classic Car' },

  // Food & Drink
  { id: 't8', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', label: 'Food' },
  { id: 't33', url: 'https://images.unsplash.com/photo-1495474472204-51e44f514781?w=800&q=80', label: 'Coffee' },
  { id: 't34', url: 'https://images.unsplash.com/photo-1563805042-7684c8e9e1cb?w=800&q=80', label: 'Dessert' },
  { id: 't35', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', label: 'Pizza' },
  { id: 't36', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80', label: 'Pasta' },

  // Abstract & Texture
  { id: 't10', url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80', label: 'Abstract' },
  { id: 't37', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', label: 'Geometric' },
  { id: 't38', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80', label: 'Colors' },
  { id: 't39', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', label: 'Texture' },
  { id: 't40', url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80', label: 'Paint' },

  // Additional variety
  { id: 't41', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', label: 'Plants' },
  { id: 't42', url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&q=80', label: 'Lens' },
  { id: 't43', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', label: 'Workspace' },
  { id: 't44', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', label: 'Gaming' },
  { id: 't45', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', label: 'Tech' },
  { id: 't46', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', label: 'Store' },
  { id: 't47', url: 'https://images.unsplash.com/photo-1533227260828-53e36e2003c2?w=800&q=80', label: 'Neon' },
  { id: 't48', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80', label: 'Vibrant' },
  { id: 't49', url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80', label: 'Blockchain' },
  { id: 't50', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', label: 'Library' }
];

const SKETCH_STYLES = [
  { id: 'graphite', label: 'Graphite', iconColor: 'bg-slate-200 border border-slate-400' },
  { id: 'ink', label: 'Ink Pen', iconColor: 'bg-slate-800' },
  { id: 'charcoal', label: 'Charcoal', iconColor: 'bg-slate-400 border-dashed border-slate-600' },
  { id: 'watercolor', label: 'Watercolor', iconColor: 'bg-blue-100' },
] as const;

type SketchStyleType = typeof SKETCH_STYLES[number]['id'];

const FRAME_STYLES = [
  { id: 'none', label: 'No Frame' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'minimal-black', label: 'Minimal Black' },
  { id: 'minimal-white', label: 'Minimal White' },
  { id: 'museum', label: 'Classic Museum' }
] as const;

type FrameStyleType = typeof FRAME_STYLES[number]['id'];

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(100);
  const [style, setStyle] = useState<SketchStyleType>('graphite');
  const [lineThickness, setLineThickness] = useState<number>(8);
  const [edgeSensitivity, setEdgeSensitivity] = useState<number>(100);
  const [colorTone, setColorTone] = useState<'monochrome' | 'warm' | 'cool' | 'original'>('monochrome');
  const [frameStyle, setFrameStyle] = useState<FrameStyleType>('none');
  const [activeTab, setActiveTab] = useState<'editor' | 'gallery' | 'templates'>('editor');
  const [galleryItems, setGalleryItems] = useState<{ id: string, dataUrl: string, style: string, date: number }[]>([]);
  const [dynamicTemplates, setDynamicTemplates] = useState(TEMPLATES);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  const suggestStyleWithAI = async () => {
    if (!imageSrc) return;
    setIsAiSuggesting(true);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      await new Promise(res => { img.onload = res; });
      
      const MAX_DIM = 512;
      let w = img.width;
      let h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.floor(w * ratio);
        h = Math.floor(h * ratio);
      }
      
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            },
            {
              text: "Analyze this image and suggest the most appropriate sketch style from this list: ['graphite', 'ink', 'charcoal', 'watercolor']. Just reply with the style name and nothing else. Graphite is good for detailed faces/objects. Ink is good for architecture/street scenes. Charcoal is good for high contrast/moody. Watercolor is good for nature/landscapes."
            }
          ]
        }
      });
      
      const suggestedStyle = response.text?.trim().toLowerCase();
      
      if (suggestedStyle && ['graphite', 'ink', 'charcoal', 'watercolor'].includes(suggestedStyle)) {
          setStyle(suggestedStyle as SketchStyleType);
      } else {
          console.warn("AI didn't return a valid style. Returned: ", suggestedStyle);
      }
    } catch (error) {
      console.error("AI suggestion failed", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAiSuggesting(false);
    }
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsProcessing(true);

    const loadImage = (src: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    loadImage(imageSrc).then((img) => {
      if (!img) return;
      // Bound the size to prevent massive performance spikes while keeping crispness
      const MAX_DIM = 2000;
      let sketchW = img.width;
      let sketchH = img.height;
      if (sketchW > MAX_DIM || sketchH > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / sketchW, MAX_DIM / sketchH);
        sketchW = Math.floor(sketchW * ratio);
        sketchH = Math.floor(sketchH * ratio);
      }

      let finalW = sketchW;
      let finalH = sketchH;
      let offsetX = 0;
      let offsetY = 0;

      if (frameStyle === 'polaroid') {
         const border = Math.floor(Math.max(20, sketchW * 0.05));
         const bottom = Math.floor(border * 4);
         finalW = sketchW + border * 2;
         finalH = sketchH + border + bottom;
         offsetX = border;
         offsetY = border;
      } else if (frameStyle === 'minimal-black' || frameStyle === 'minimal-white') {
         const border = Math.floor(Math.max(16, sketchW * 0.03));
         finalW = sketchW + border * 2;
         finalH = sketchH + border * 2;
         offsetX = border;
         offsetY = border;
      } else if (frameStyle === 'museum') {
         const outerBorder = Math.floor(Math.max(30, sketchW * 0.08));
         const innerBorder = Math.floor(Math.max(10, sketchW * 0.02));
         const totalBorder = outerBorder + innerBorder;
         finalW = sketchW + totalBorder * 2;
         finalH = sketchH + totalBorder * 2;
         offsetX = totalBorder;
         offsetY = totalBorder;
      }

      canvas.width = finalW;
      canvas.height = finalH;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = sketchW;
      offCanvas.height = sketchH;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      const baseBlur = Math.max(0.5, lineThickness);

      if (style === 'graphite') {
        offCtx.filter = `grayscale(100%) contrast(${edgeSensitivity}%)`;
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.filter = `grayscale(100%) invert(100%) blur(${baseBlur}px)`;
        offCtx.globalCompositeOperation = 'color-dodge';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
      } else if (style === 'ink') {
        offCtx.filter = `grayscale(100%) contrast(${Math.max(100, edgeSensitivity * 1.5)}%)`;
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.filter = `grayscale(100%) invert(100%) blur(${Math.max(0.2, baseBlur * 0.25)}px)`;
        offCtx.globalCompositeOperation = 'color-dodge';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
      } else if (style === 'charcoal') {
        offCtx.filter = `grayscale(100%) contrast(${edgeSensitivity}%) brightness(80%)`;
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.filter = `grayscale(100%) invert(100%) blur(${baseBlur * 1.5}px)`;
        offCtx.globalCompositeOperation = 'color-dodge';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.globalCompositeOperation = 'multiply';
        offCtx.filter = 'none';
        offCtx.fillStyle = 'rgba(0,0,0,0.1)';
        offCtx.fillRect(0, 0, sketchW, sketchH);
      } else if (style === 'watercolor') {
        offCtx.filter = `saturate(200%) contrast(${edgeSensitivity}%)`;
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.filter = `invert(100%) blur(${baseBlur}px)`;
        offCtx.globalCompositeOperation = 'color-dodge';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
        offCtx.globalCompositeOperation = 'multiply';
        offCtx.filter = 'saturate(150%)';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
      }

      // Apply Color Tone
      if (colorTone === 'warm') {
        offCtx.globalCompositeOperation = 'color';
        offCtx.fillStyle = 'rgb(215, 175, 130)';
        offCtx.fillRect(0, 0, sketchW, sketchH);
      } else if (colorTone === 'cool') {
        offCtx.globalCompositeOperation = 'color';
        offCtx.fillStyle = 'rgb(130, 165, 215)';
        offCtx.fillRect(0, 0, sketchW, sketchH);
      } else if (colorTone === 'original') {
        offCtx.globalCompositeOperation = 'color';
        offCtx.drawImage(img, 0, 0, sketchW, sketchH);
      }

      // Draw original on main canvas
      ctx.clearRect(0, 0, finalW, finalH);

      // Draw background/frame
      if (frameStyle === 'polaroid') {
         ctx.fillStyle = '#ffffff';
         ctx.fillRect(0, 0, finalW, finalH);
         ctx.strokeStyle = 'rgba(0,0,0,0.1)';
         ctx.lineWidth = 1;
         ctx.strokeRect(0, 0, finalW, finalH);
      } else if (frameStyle === 'minimal-black') {
         ctx.fillStyle = '#111111';
         ctx.fillRect(0, 0, finalW, finalH);
      } else if (frameStyle === 'minimal-white') {
         ctx.fillStyle = '#ffffff';
         ctx.fillRect(0, 0, finalW, finalH);
      } else if (frameStyle === 'museum') {
         const outerBorder = Math.floor(Math.max(30, sketchW * 0.08));
         const innerBorder = Math.floor(Math.max(10, sketchW * 0.02));
         ctx.fillStyle = '#1c1917'; // dark wood/black frame
         ctx.fillRect(0, 0, finalW, finalH);
         
         ctx.fillStyle = '#fafaf9'; // off-white matte
         ctx.fillRect(outerBorder, outerBorder, finalW - outerBorder * 2, finalH - outerBorder * 2);
         
         // Inner inset line
         ctx.strokeStyle = 'rgba(0,0,0,0.5)';
         ctx.lineWidth = 1;
         ctx.strokeRect(outerBorder + innerBorder - 1, outerBorder + innerBorder - 1, sketchW + 2, sketchH + 2);
      }

      ctx.globalAlpha = 1;
      ctx.drawImage(img, offsetX, offsetY, sketchW, sketchH);

      // Draw effect on top with opacity = intensity / 100
      ctx.globalAlpha = intensity / 100;
      ctx.drawImage(offCanvas, offsetX, offsetY, sketchW, sketchH);

      // Clean up state
      ctx.globalAlpha = 1;
      setIsProcessing(false);
    }).catch((err) => {
      console.error(err);
      setIsProcessing(false);
      alert('Failed to load image. Please try another one.');
      setImageSrc(null);
    });
  }, [imageSrc, intensity, style, lineThickness, edgeSensitivity, colorTone, frameStyle]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  const loadTemplate = (url: string) => {
    setIsProcessing(true);
    setImageSrc(url);
    setActiveTab('editor');
  };

  const handleTemplateScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      const newTemplates = Array.from({ length: 12 }).map((_, i) => {
        const id = Date.now() + i;
        const randomCategories = ['People', 'City', 'Nature', 'Object', 'Art', 'Macro', 'Space'];
        const randomCat = randomCategories[Math.floor(Math.random() * randomCategories.length)];
        return {
          id: `dyn-${id}`,
          url: `https://picsum.photos/seed/${id}/800/800`,
          label: randomCat
        };
      });
      setDynamicTemplates(prev => [...prev, ...newTemplates]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      // Save to local gallery state
      setGalleryItems(prev => [{
        id: Date.now().toString(),
        dataUrl,
        style,
        date: Date.now()
      }, ...prev]);

      const link = document.createElement('a');
      link.download = `sketchify-${style}-export.png`;
      link.href = dataUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Download was blocked by your browser. Please try opening the app in a new tab, or use the Share button instead.');
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      if (navigator.share) {
        // Synchronously convert to file to keep the user gesture context
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], `sketchify-${style}.png`, { type: mime });

        // Some browsers don't support sharing files, check first
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Sketchify Art',
            text: 'Check out this sketch I made with Sketchify!',
            files: [file],
          });
        } else {
          // Fallback to just sharing the text if files aren't supported
          await navigator.share({
            title: 'My Sketchify Art',
            text: 'Check out this sketch I made with Sketchify!',
          });
        }
      } else {
        alert('Sharing is not supported on your browser or device.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const advancedControls = (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Advanced Tuning</h4>
      
      {/* Line Thickness */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-500">Thickness</span>
          <span className="text-xs font-mono font-bold text-indigo-600">{lineThickness}px</span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-100 rounded-full flex items-center group">
          <div className="absolute left-0 h-full bg-slate-400 rounded-full transition-all group-hover:bg-slate-500" style={{ width: `${(lineThickness / 20) * 100}%` }}></div>
          <input
            type="range" min="1" max="20" step="0.5"
            value={lineThickness} onChange={(e) => setLineThickness(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>

      {/* Edge Sensitivity */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-500">Edge Detail</span>
          <span className="text-xs font-mono font-bold text-indigo-600">{edgeSensitivity}%</span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-100 rounded-full flex items-center group">
          <div className="absolute left-0 h-full bg-slate-400 rounded-full transition-all group-hover:bg-slate-500" style={{ width: `${((edgeSensitivity - 10) / 290) * 100}%` }}></div>
          <input
            type="range" min="10" max="300" step="5"
            value={edgeSensitivity} onChange={(e) => setEdgeSensitivity(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>
      
      {/* Frame Style */}
      <div>
         <span className="text-xs font-medium text-slate-500 mb-2 block">Decorative Frame</span>
         <div className="flex flex-wrap gap-2 mb-3">
           {FRAME_STYLES.map(frame => (
             <button
               key={frame.id}
               onClick={() => setFrameStyle(frame.id)}
               className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors ${
                 frameStyle === frame.id 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
               }`}
             >
               {frame.label}
             </button>
           ))}
         </div>
      </div>
      
      {/* Color Tone */}
      <div>
         <span className="text-xs font-medium text-slate-500 mb-2 block">Color Tone</span>
         <div className="grid grid-cols-2 gap-2">
           {(['monochrome', 'warm', 'cool', 'original'] as const).map(tone => (
             <button
               key={tone}
               onClick={() => setColorTone(tone)}
               className={`py-1.5 px-2 text-[11px] font-bold rounded-lg capitalize transition-colors ${
                 colorTone === tone 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
               }`}
             >
               {tone}
             </button>
           ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden selection:bg-indigo-100 max-h-[100dvh]">
      {/* Navigation Bar */}
      <nav className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Sketchify</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-sm font-medium text-slate-500">
            <button onClick={() => setActiveTab('editor')} className={`${activeTab === 'editor' ? 'text-indigo-600' : 'hover:text-slate-800'} transition-colors`}>Editor</button>
            <button onClick={() => setActiveTab('gallery')} className={`${activeTab === 'gallery' ? 'text-indigo-600' : 'hover:text-slate-800'} transition-colors`}>Gallery</button>
            <button onClick={() => setActiveTab('templates')} className={`${activeTab === 'templates' ? 'text-indigo-600' : 'hover:text-slate-800'} transition-colors`}>Templates</button>
          </div>
          {imageSrc ? (
            <button
               onClick={() => setImageSrc(null)}
               className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
               <RefreshCw className="w-4 h-4" /> Start Over
            </button>
          ) : (
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">Upgrade Pro</button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex gap-8 p-4 md:p-8 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 overflow-y-auto h-full"
            >
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Gallery</h2>
               {galleryItems.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[400px]">
                    <ImageIcon className="w-16 h-16 mb-4 text-slate-300" />
                    <p className="font-bold text-lg text-slate-600 mb-1">Your gallery is empty</p>
                    <p className="text-sm">Save finished sketches to see them here.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {galleryItems.map(item => (
                      <div key={item.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative border-b border-slate-100">
                           <img src={item.dataUrl} alt="Saved sketch" className="w-full h-full object-contain" />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                           <div>
                             <p className="text-sm font-bold capitalize text-slate-800">{SKETCH_STYLES.find(s => s.id === item.style)?.label || item.style}</p>
                             <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                           </div>
                           <div className="flex gap-1.5">
                             <a href={item.dataUrl} download={`sketchify-${item.style}-${item.date}.png`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                               <Download className="w-4 h-4" />
                             </a>
                             <button onClick={() => setGalleryItems(prev => prev.filter(i => i.id !== item.id))} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </div>
                      </div>
                   ))}
                 </div>
               )}
            </motion.div>
          ) : activeTab === 'templates' ? (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 overflow-y-auto h-full"
              onScroll={handleTemplateScroll}
            >
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Starter Templates</h2>
               <p className="text-slate-500 mb-8">Choose an image to start experimenting with Sketchify styles.</p>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dynamicTemplates.map(temp => (
                    <div 
                      key={temp.id} 
                      onClick={() => loadTemplate(temp.url)}
                      className="group cursor-pointer rounded-2xl overflow-hidden relative bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all aspect-square"
                    >
                      <img src={temp.url} alt={temp.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                        <span className="text-white font-bold tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform">Start Sketching</span>
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-slate-700 rounded-md shadow-sm">
                        {temp.label}
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          ) : !imageSrc ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 w-full max-w-3xl mx-auto flex items-center justify-center h-full"
            >
              <div
                className={`w-full border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[400px]
                  ${isDragging 
                    ? 'border-indigo-500 bg-indigo-50/50' 
                    : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50'
                  } shadow-sm`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                  Drop your image here
                </h3>
                <p className="text-slate-500 mb-8 max-w-md">
                  Upload any photo to instantly convert it into a beautiful, high-resolution pencil sketch.
                </p>
                <label className="relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors rounded-3xl" />
                  <div className="relative px-8 py-3.5 flex items-center gap-2 text-white font-medium">
                    <Upload className="w-5 h-5" />
                    Choose File
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex gap-8 w-full h-full"
            >
              {/* Sidebar Controls */}
              <aside className="w-72 flex flex-col gap-6 shrink-0 overflow-y-auto hidden md:flex pb-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sketch Style</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {SKETCH_STYLES.map((s) => {
                      const isActive = style === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                            isActive 
                              ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700' 
                              : 'border ring-1 ring-slate-200/50 border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full opacity-60 ${s.iconColor}`}></div>
                          <span className="text-xs font-bold">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={suggestStyleWithAI}
                    disabled={isAiSuggesting}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-sm shadow-sm hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Wand2 className={`w-4 h-4 ${isAiSuggesting ? 'animate-spin' : ''}`} />
                    {isAiSuggesting ? 'Analyzing Image...' : 'AI Suggest Style'}
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  {/* Slider styled like the intensity control */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Intensity
                      </label>
                      <span className="text-xs font-mono font-bold text-indigo-600">{intensity}%</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full flex items-center group">
                      <div className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all group-hover:bg-indigo-400" style={{ width: `${intensity}%` }}></div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
                      />
                    </div>
                  </div>
                  {advancedControls}
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Save to Device
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full py-3.5 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Sketch
                  </button>
                </div>
              </aside>

              {/* Preview Area */}
              <div className="flex-1 flex flex-col gap-6 min-w-0 h-full">
                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                  {/* Before Container */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden relative group shadow-sm flex items-center justify-center min-h-0">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-white/50 shadow-sm">Original Photo</div>
                    <img 
                      src={imageSrc} 
                      className="max-w-full max-h-full object-contain p-4" 
                      alt="Original upload" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>

                  {/* After Container */}
                  <div className="flex-1 bg-white rounded-2xl border-2 border-indigo-200 overflow-hidden relative shadow-md flex items-center justify-center min-h-0">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm flex items-center gap-2">
                       Sketch Preview
                       {isProcessing && (
                         <motion.span 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                           className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"
                         />
                       )}
                    </div>
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full max-h-full object-contain p-4 z-10" 
                    />
                    {/* Simulated Sketch Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }}></div>
                  </div>
                </div>

                {/* Mobile sidebar layout equivalent (since sidebar is hidden on mobile) */}
                <div className="md:hidden flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                   <div className="overflow-x-auto pb-2 flex gap-3 snap-x">
                    {SKETCH_STYLES.map((s) => {
                      const isActive = style === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`p-3 shrink-0 rounded-xl flex items-center gap-3 transition-colors snap-center ${
                            isActive 
                              ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700' 
                              : 'border ring-1 ring-slate-200/50 border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full opacity-60 ${s.iconColor}`}></div>
                          <span className="text-sm font-bold whitespace-nowrap">{s.label}</span>
                        </button>
                      );
                    })}
                   </div>
                   <button
                    onClick={suggestStyleWithAI}
                    disabled={isAiSuggesting}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-sm shadow-sm hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                    <Wand2 className={`w-4 h-4 ${isAiSuggesting ? 'animate-spin' : ''}`} />
                    {isAiSuggesting ? 'Analyzing...' : 'AI Suggest Style'}
                   </button>
                   <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sketch Intensity</label>
                        <span className="text-xs font-mono font-bold text-indigo-600">{intensity}%</span>
                      </div>
                      <div className="relative h-2 w-full bg-slate-100 rounded-full flex items-center group">
                        <div className="absolute left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${intensity}%` }}></div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={intensity}
                          onChange={(e) => setIntensity(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
                        />
                      </div>
                   </div>
                   {advancedControls}
                   <div className="flex gap-3 pt-2">
                     <button
                      onClick={handleDownload}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                     >
                      <Download className="w-5 h-5" /> Save
                     </button>
                     <button
                      onClick={handleShare}
                      className="flex-1 py-3 bg-white text-slate-800 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2"
                     >
                      <Share2 className="w-5 h-5" /> Share
                     </button>
                   </div>
                </div>

                {/* The "Recent Activity Rail" from design */}
                <div className="h-24 xl:h-28 hidden lg:flex gap-4 overflow-hidden shrink-0 pb-2">
                  <div className="w-[100px] xl:w-[120px] bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center hover:border-indigo-300 transition-colors cursor-pointer shadow-sm">
                    <ImageIcon className="w-8 h-8 text-slate-200" />
                  </div>
                  <div className="w-[100px] xl:w-[120px] bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 grayscale opacity-40 shadow-sm">
                     <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                        <Download className="w-6 h-6 text-slate-300"/>
                     </div>
                  </div>
                  <div className="w-[100px] xl:w-[120px] bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 grayscale opacity-40 shadow-sm">
                     <div className="h-full w-full bg-slate-100"></div>
                  </div>
                  <div className="flex-1 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center flex-col gap-1 shadow-sm">
                     <span className="text-xs font-bold text-indigo-400">History is full</span>
                     <span className="text-[10px] text-indigo-300">Clean up to save more</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
