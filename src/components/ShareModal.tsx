import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const shareText = 'График работы 2/2 в ночь:';
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#201e1b] border border-[#332e27] rounded-2xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d2924]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2b251b] text-[#deb887] flex items-center justify-center border border-[#4a3923]">
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[#ede7dc]">
              Поделиться графиком
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272420] hover:bg-[#332f2a] text-[#999081] hover:text-[#ede7dc] transition"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-[#999081] mt-3 leading-relaxed">
          По этой ссылке график откроется в режиме «только чтение». Посторонние лица смогут просматривать смены, но не смогут изменить ваши данные.
        </p>

        {/* Copy input */}
        <div className="mt-4">
          <label className="text-xs font-medium text-[#999081] block mb-1.5">
            Ссылка на график
          </label>
          <div className="flex items-center gap-2">
            <input
              id="share-url-input"
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#181715] border border-[#332f2a] rounded-lg px-3 py-2 text-xs text-[#dce2e6] font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-[#6d9684] text-[#181715]'
                  : 'bg-[#deb887] hover:bg-[#ebd0a7] text-[#181715]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Копировать</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Messengers */}
        <div className="mt-4 pt-3 border-t border-[#2d2924]">
          <span className="text-xs text-[#999081] block mb-2">Отправить в мессенджер:</span>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#272420] hover:bg-[#332f2a] border border-[#36312a] text-[#ede7dc] text-xs font-medium transition"
            >
              <Send className="w-3.5 h-3.5 text-[#deb887]" strokeWidth={1.5} />
              <span>Telegram</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#272420] hover:bg-[#332f2a] border border-[#36312a] text-[#ede7dc] text-xs font-medium transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#6d9684]" strokeWidth={1.5} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2d2924] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#272420] hover:bg-[#332f2a] text-[#999081] hover:text-[#ede7dc] transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
